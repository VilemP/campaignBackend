import { EventStore, EventCollector, EventRecord } from '@libs/event-sourcing';
import { Campaign } from '../../domain/model/Campaign';
import { CampaignRepository } from './CampaignRepository';
import { DomainEvent } from '../../domain/events/DomainEvent';
import { EventSourcedCampaignState } from './EventSourcedCampaignState';
import { CampaignState } from '../../domain/model/CampaignState';

const SNAPSHOT_INTERVAL = 100;

export class EventSourcedCampaignRepository implements CampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();
    private entityStates = new WeakMap<Campaign, EventSourcedCampaignState>();
    private eventCollector = new EventCollector();

    constructor(
        private readonly eventStore: EventStore
    ) {}

    async save(campaign: Campaign): Promise<void> {
        const events = this.eventCollector.getEvents(campaign);
        if (events.length === 0) return;

        const originalVersion = this.entityVersions.get(campaign);
        const currentState = this.entityStates.get(campaign);
        if (originalVersion === undefined || !currentState) {
            throw new Error('Cannot save an entity that was not loaded through the repository');
        }

        const records = this.createEventRecords(campaign.id, events, originalVersion);
        await this.eventStore.append(campaign.id, records, originalVersion);
        
        const newVersion = records[records.length - 1].metadata.version;
        const newState = currentState.applyEvents(events);

        if (newVersion % SNAPSHOT_INTERVAL === 0) {
            await this.eventStore.storeStateAsSnapshot(
                campaign.id, 
                newState, 
                newVersion
            );
        }

        this.eventCollector.clearEvents(campaign);
        this.entityVersions.delete(campaign);
        this.entityStates.delete(campaign);
    }

    async load(id: string): Promise<Campaign | null> {
        const { events, state } = await this.eventStore.readStream<DomainEvent, CampaignState>(
            id,
            EventSourcedCampaignState.empty()
        );

        if (events.length === 0 && state === EventSourcedCampaignState.empty()) {
            return null;
        }

        const finalState = EventSourcedCampaignState.fromSnapshot(state)
            .applyEvents(events.map(record => record.event));
            
        const campaign = Campaign.fromState(finalState);
        this.eventCollector.track(campaign);
        this.entityVersions.set(campaign, events[events.length - 1]?.metadata.version ?? 0);
        this.entityStates.set(campaign, finalState);
        
        return campaign;
    }

    private createEventRecords(
        streamId: string, 
        events: DomainEvent[], 
        startVersion: number
    ): EventRecord<DomainEvent>[] {
        return events.map((event, index) => ({
            streamId,
            event,
            metadata: {
                version: startVersion + index + 1
            }
        }));
    }
} 
import { EventStore, EventCollector, EventRecord, ConcurrencyError } from '@libs/event-sourcing';
import { Campaign } from '../../domain/model/Campaign.js';
import { CampaignAlreadyExists, CampaignRepository} from './CampaignRepository.js';
import { DomainEvent } from '@libs/domain';
import { EventSourcedCampaignState } from './EventSourcedCampaignState.js';
import { CampaignState } from '../../domain/model/CampaignState.js';
import { CampaignId } from '../../domain/model/CampaignId.js';
import { BusinessType } from '../../domain/model/types.js';
import { UntrackedCampaignError, CampaignPersistenceError } from '../errors.js';

const SNAPSHOT_INTERVAL = 100;

export class EventSourcedCampaignRepository implements CampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();
    private entityStates = new WeakMap<Campaign, EventSourcedCampaignState>();
    private eventCollector = new EventCollector<DomainEvent>();

    constructor(private readonly eventStore: EventStore) {}

    async createCampaign(id: CampaignId, name: string, businessType: BusinessType): Promise<Campaign> {
        try {
            const creationEvents: DomainEvent[] = [];
            const campaign = new Campaign(
                id, 
                name, 
                businessType,
                [(event) => creationEvents.push(event)]
            );
            
            // Create event record starting with version 0
            const records = this.createEventRecords(id.toString(), creationEvents, 0); // starts at version 0            
            // Try to append with expectedVersion 0 (stream should not exist)
            await this.eventStore.append(id.toString(), records, 0);
            
            this.setupEntityTracking(campaign, records, new EventSourcedCampaignState(id, name, businessType));
            return campaign;
        } catch (error) {
            if (error instanceof ConcurrencyError) {
                throw new CampaignAlreadyExists(id.toString());
            }
            throw new CampaignPersistenceError(id.toString(), error as Error);
        }
    }

    async save(campaign: Campaign): Promise<void> {
        try {
            const events = this.collectPendingEvents(campaign);
            if (events.length === 0) return;

            const version = this.getOriginalVersion(campaign);
            const records = this.createEventRecords(campaign.getId().toString(), events, version);

            await this.appendEventsToStream(campaign.getId().toString(), records, version);
            await this.createSnapshotIfNeeded(campaign, records);

            this.clearEntityTracking(campaign);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not tracked')) {
                throw new UntrackedCampaignError(campaign.getId().toString());
            }
            throw new CampaignPersistenceError(campaign.getId().toString(), error as Error);
        }
    }

    async load(id: string): Promise<Campaign | null> {
        try {
            const { events, state } = await this.eventStore.readStream<DomainEvent, CampaignState>(
                id,
                EventSourcedCampaignState.initial(id)
            );

            if (events.length === 0) {
                return null;
            }

            const finalState = EventSourcedCampaignState.fromSnapshot(state)
                .applyEvents(events.map(record => record.event));
                
            const campaign = Campaign.fromState(finalState);
            this.setupEntityTracking(campaign, events, finalState);
            
            return campaign;
        } catch (error) {
            throw new CampaignPersistenceError(id, error as Error);
        }
    }

    private collectPendingEvents(campaign: Campaign): DomainEvent[] {
        const events = this.eventCollector.getEvents(campaign);
        if (!this.entityStates.has(campaign)) {
            throw new Error('Campaign is not tracked by the repository');
        }
        return events;
    }

    private getOriginalVersion(campaign: Campaign): number {
        const version = this.entityVersions.get(campaign);
        if (version === undefined) {
            throw new Error('Campaign version not found');
        }
        return version;
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

    private async appendEventsToStream(
        streamId: string,
        records: EventRecord<DomainEvent>[],
        expectedVersion: number
    ): Promise<void> {
        await this.eventStore.append(streamId, records, expectedVersion);
    }

    private async createSnapshotIfNeeded(
        campaign: Campaign,
        records: EventRecord<DomainEvent>[]
    ): Promise<void> {
        const lastRecord = records[records.length - 1];
        if (lastRecord.metadata.version % SNAPSHOT_INTERVAL === 0) {
            const state = this.entityStates.get(campaign);
            if (state) {
                const updatedState = state.applyEvents(records.map(record => record.event));
                await this.eventStore.storeStateAsSnapshot(
                    campaign.getId().toString(),
                    updatedState,
                    lastRecord.metadata.version
                );
            }
        }
    }

    private clearEntityTracking(campaign: Campaign): void {
        this.eventCollector.clearEvents(campaign);
        this.entityVersions.delete(campaign);
        this.entityStates.delete(campaign);
    }

    private setupEntityTracking(
        campaign: Campaign, 
        events: EventRecord<DomainEvent>[], 
        state: EventSourcedCampaignState
    ): void {
        this.eventCollector.track(campaign);
        this.entityVersions.set(campaign, events[events.length - 1]?.metadata.version ?? 0);
        this.entityStates.set(campaign, state);
    }
} 
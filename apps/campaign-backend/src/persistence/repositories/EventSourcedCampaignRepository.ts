import { EventStore, EventCollector, EventRecord } from '@libs/event-sourcing';
import { Campaign } from '../../domain/model/Campaign';
import { CampaignRepository } from './CampaignRepository';
import { DomainEvent } from '@libs/domain';
import { EventSourcedCampaignState } from './EventSourcedCampaignState';
import { CampaignState } from '../../domain/model/CampaignState';
import { UntrackedCampaignError, CampaignPersistenceError } from '../errors';
const SNAPSHOT_INTERVAL = 100;

export class EventSourcedCampaignRepository implements CampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();
    private entityStates = new WeakMap<Campaign, EventSourcedCampaignState>();
    private eventCollector = new EventCollector();

    constructor(
        private readonly eventStore: EventStore
    ) {}

    async save(campaign: Campaign): Promise<void> {
        try {
            const events = this.collectPendingEvents(campaign);
            if (events.length === 0) return;

            const version = this.getOriginalVersion(campaign);
            const records = this.createEventRecords(campaign.id, events, version);

            await this.appendEventsToStream(campaign.id, records, version);
            await this.createSnapshotIfNeeded(campaign.id, records);

            this.clearEntityTracking(campaign);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not tracked')) {
                throw new UntrackedCampaignError(campaign.id);
            }
            throw new CampaignPersistenceError(campaign.id, error as Error);
        }
    }

    async load(id: string): Promise<Campaign | null> {
        try {
            const { events, state } = await this.eventStore.readStream<DomainEvent, CampaignState>(
                id,
                EventSourcedCampaignState.initial()
            );

            if (events.length === 0 && state === EventSourcedCampaignState.initial()) {
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
        streamId: string,
        records: EventRecord<DomainEvent>[]
    ): Promise<void> {
        const lastRecord = records[records.length - 1];
        if (lastRecord.metadata.version % SNAPSHOT_INTERVAL === 0) {
            const state = this.entityStates.get(Campaign.fromState({ id: streamId } as CampaignState));
            if (state) {
                await this.eventStore.storeStateAsSnapshot(
                    streamId,
                    state,
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
import { EventStore, EventCollector, SnapshotStore } from '@campaign/event-sourcing';
import { Campaign, CampaignState } from '../../domain/model/Campaign';

export class ConcurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConcurrencyError';
    }
}

export class CampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();
    private readonly SNAPSHOT_FREQUENCY = 100;

    constructor(
        private readonly eventStore: EventStore,
        private readonly snapshotStore: SnapshotStore,
        private readonly eventCollector: EventCollector
    ) {}

    async save(campaign: Campaign): Promise<void> {
        const events = this.eventCollector.getEvents(campaign);
        if (events.length === 0) return;

        const originalVersion = this.entityVersions.get(campaign);
        if (originalVersion === undefined) {
            throw new Error('Cannot save an entity that was not loaded through the repository');
        }

        try {
            await this.eventStore.saveEvents(campaign.getId(), events, originalVersion);
            
            const newVersion = originalVersion + events.length;
            if (newVersion % this.SNAPSHOT_FREQUENCY === 0) {
                await this.snapshotStore.saveSnapshot(campaign.getId(), {
                    id: campaign.getId(),
                    name: campaign.getName(),
                    businessType: campaign.getBusinessType()
                }, newVersion);
            }
            
            this.entityVersions.set(campaign, newVersion);
            this.eventCollector.clearEvents(campaign);
        } catch (error) {
            if (error instanceof ConcurrencyError) {
                throw new ConcurrencyError(
                    `Concurrency violation when saving campaign ${campaign.getId()}. ` +
                    `Expected version ${originalVersion}`
                );
            }
            throw error;
        }
    }

    async load(id: string): Promise<Campaign | null> {
        const snapshot = await this.snapshotStore.getLatestSnapshot<CampaignState>(id);
        const fromVersion = snapshot ? snapshot.version : -1;
        
        const events = await this.eventStore.getEvents(id, fromVersion);

        if (!snapshot && events.length === 0) {
            return null;
        }

        const campaign = snapshot 
            ? Campaign.fromState(snapshot.state)
            : Campaign.fromState(this.reconstructState(events));

        this.eventCollector.track(campaign);
        this.entityVersions.set(campaign, fromVersion + events.length);

        return campaign;
    }

    private reconstructState(events: DomainEvent[]): CampaignState {
        const firstEvent = events[0] as CampaignCreated;
        let state: CampaignState = {
            id: firstEvent.campaignId,
            name: firstEvent.name,
            businessType: firstEvent.businessType
        };

        for (const event of events.slice(1)) {
            if (event instanceof CampaignBusinessTypeChanged) {
                state = {
                    ...state,
                    businessType: event.newType
                };
            }
        }

        return state;
    }
}
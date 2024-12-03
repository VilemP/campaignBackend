import { Campaign, CampaignState } from '../../domain/model/Campaign';
import { CampaignRepository as ICampaignRepository } from '../../domain/repositories/CampaignRepository';
import { EventStore } from '../eventstore/EventStore';
import { EventCollector } from '../eventstore/EventCollector';
import { ConcurrencyError } from '../../domain/Errors';

export class CampaignRepository implements ICampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();
    private readonly SNAPSHOT_FREQUENCY = 100;

    constructor(
        private readonly eventStore: EventStore,
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

    async findById(id: string): Promise<Campaign | null> {
        const events = await this.eventStore.getEvents(id);
        if (events.length === 0) return null;

        const campaign = Campaign.fromState(this.reconstructState(events));

        this.eventCollector.track(campaign);
        this.entityVersions.set(campaign, events.length);

        return campaign;
    }

    private reconstructState(events: DomainEvent[]): CampaignState {
        // This could be moved to a separate StateReconstructor class if needed
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
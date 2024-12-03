import { Campaign, CampaignState } from '../../domain/model/Campaign';
import { EventStore } from '../eventSourcing/EventStore';
import { EventCollector } from '../eventSourcing/EventCollector';
import { DomainEvent } from '../../domain/events/DomainEvent';

export class ConcurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConcurrencyError';
    }
}

export class CampaignRepository {
    private entityVersions = new WeakMap<Campaign, number>();

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
            this.entityVersions.set(campaign, originalVersion + events.length);
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
}
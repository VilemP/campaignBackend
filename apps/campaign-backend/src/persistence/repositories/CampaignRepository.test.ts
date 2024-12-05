import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventStore, EventCollector } from '@libs/event-sourcing';
import { Campaign } from '../../domain/model/Campaign';
import { BusinessType } from '../../domain/model/types';
import { EventSourcedCampaignState } from './EventSourcedCampaignState';
import { EventSourcedCampaignRepository } from './EventSourcedCampaignRepository';

describe('EventSourcedCampaignRepository', () => {
    const mockEventStore: EventStore = {
        append: vi.fn(),
        readStream: vi.fn().mockResolvedValue({
            events: [],
            state: EventSourcedCampaignState.initial()
        }),
        storeStateAsSnapshot: vi.fn()
    };

    const eventCollector = new EventCollector();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save new campaign events', async () => {
        const repository = new EventSourcedCampaignRepository(mockEventStore);
        const campaign = Campaign.create('123', 'Test Campaign', BusinessType.RETAIL);
        
        await repository.save(campaign);

        expect(mockEventStore.append).toHaveBeenCalled();
    });

    // More tests to be added
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventStore, EventCollector } from '@libs/event-sourcing';
import { Campaign } from '../../domain/model/Campaign.js';
import { BusinessType } from '../../domain/model/types.js';
import { EventSourcedCampaignState } from './EventSourcedCampaignState.js';
import { EventSourcedCampaignRepository } from './EventSourcedCampaignRepository.js';

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
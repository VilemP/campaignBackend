import { describe, it, expect, vi } from 'vitest';
import { CampaignRepository } from './CampaignRepository';
import { EventStore, EventCollector, SnapshotStore } from '@campaign/event-sourcing';
import { Campaign } from '../../domain/model/Campaign';
import { BusinessType } from '../../domain/model/types';

describe('CampaignRepository', () => {
    const mockEventStore: EventStore = {
        saveEvents: vi.fn(),
        getEvents: vi.fn(),
        getLastVersion: vi.fn()
    };

    const mockSnapshotStore: SnapshotStore = {
        saveSnapshot: vi.fn(),
        getLatestSnapshot: vi.fn()
    };

    const eventCollector = new EventCollector();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save new campaign events', async () => {
        const repository = new CampaignRepository(mockEventStore, mockSnapshotStore, eventCollector);
        const campaign = Campaign.create('123', 'Test Campaign', BusinessType.RETAIL);
        
        await repository.save(campaign);

        expect(mockEventStore.saveEvents).toHaveBeenCalled();
    });

    // More tests to be added
});
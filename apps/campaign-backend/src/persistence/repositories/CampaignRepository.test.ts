// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { EventStore } from '@libs/event-sourcing';
// import { BusinessType } from '../../domain/model/types.js';
// import { EventSourcedCampaignState } from './EventSourcedCampaignState.js';
// import { EventSourcedCampaignRepository } from './EventSourcedCampaignRepository.js';
// import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';

// describe('EventSourcedCampaignRepository', () => {
//     const mockEventStore: EventStore = {
//         append: vi.fn(),
//         readStream: vi.fn().mockResolvedValue({
//             events: [],
//             state: EventSourcedCampaignState.initial('0')
//         }),
//         storeStateAsSnapshot: vi.fn()
//     };

//     beforeEach(() => {
//         vi.clearAllMocks();
//     });

//     it('should save new campaign events', async () => {
//         const repository = new EventSourcedCampaignRepository(mockEventStore);
//         const campaign = repository.createCampaign(CampaignId.generate(), 'Test Campaign', BusinessType.STANDARD);
        
//         await repository.save(campaign);

//         expect(mockEventStore.append).toHaveBeenCalled();
//     });

//     // More tests to be added
// });
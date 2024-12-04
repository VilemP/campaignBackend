import { describe, it, expect } from 'vitest';
import { Campaign } from '../Campaign';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../../events/CampaignEvents';

describe('Campaign', () => {
    it('should create a campaign with initial events', () => {
        const emittedEvents: any[] = [];
        const campaign = Campaign.create('test-id', 'Test Campaign', 'RETAIL');
        campaign.listen(event => emittedEvents.push(event));

        expect(campaign.getId()).toBe('test-id');
        expect(campaign.getBusinessType()).toBe('RETAIL');
        expect(emittedEvents[0]).toBeInstanceOf(CampaignCreated);
    });

    it('should create campaign from state without emitting events', () => {
        const emittedEvents: any[] = [];
        const campaign = Campaign.fromState({
            id: 'test-id',
            name: 'Test Campaign',
            businessType: 'RETAIL'
        });
        campaign.listen(event => emittedEvents.push(event));

        expect(campaign.getId()).toBe('test-id');
        expect(campaign.getBusinessType()).toBe('RETAIL');
        expect(emittedEvents).toHaveLength(0);
    });
});
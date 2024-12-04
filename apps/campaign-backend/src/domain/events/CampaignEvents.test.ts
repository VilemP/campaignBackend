import { describe, it, expect } from 'vitest';
import { CampaignCreated, CampaignBusinessTypeChanged } from './CampaignEvents';
import { BusinessType } from '../model/types';

describe('Campaign Events', () => {
    it('should create CampaignCreated event with correct properties', () => {
        const event = new CampaignCreated('123', 'Test Campaign', BusinessType.RETAIL);
        
        expect(event.campaignId).toBe('123');
        expect(event.name).toBe('Test Campaign');
        expect(event.businessType).toBe(BusinessType.RETAIL);
        expect(event.occurredAt).toBeInstanceOf(Date);
    });

    it('should create CampaignBusinessTypeChanged event with correct properties', () => {
        const event = new CampaignBusinessTypeChanged(
            '123',
            BusinessType.RETAIL,
            BusinessType.ECOMMERCE
        );
        
        expect(event.campaignId).toBe('123');
        expect(event.oldType).toBe(BusinessType.RETAIL);
        expect(event.newType).toBe(BusinessType.ECOMMERCE);
        expect(event.occurredAt).toBeInstanceOf(Date);
    });
});
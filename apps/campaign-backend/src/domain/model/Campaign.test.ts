import { describe, it, expect } from 'vitest';
import { Campaign } from './Campaign.js';
import { BusinessType } from './types.js';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../events/CampaignEvents.js';

describe('Campaign', () => {
    describe('create', () => {
        it('should create campaign and emit CampaignCreated event', () => {
            let emittedEvent: CampaignCreated | null = null;
            const campaign = Campaign.create('123', 'Test Campaign', BusinessType.RETAIL);
            
            campaign.listen((event) => {
                if (event instanceof CampaignCreated) {
                    emittedEvent = event;
                }
            });

            expect(campaign.getId()).toBe('123');
            expect(campaign.getName()).toBe('Test Campaign');
            expect(campaign.getBusinessType()).toBe(BusinessType.RETAIL);
        });
    });

    describe('changeBusinessType', () => {
        it('should change business type and emit event', () => {
            let emittedEvent: CampaignBusinessTypeChanged | null = null;
            const campaign = Campaign.create('123', 'Test', BusinessType.RETAIL);
            
            campaign.listen((event) => {
                if (event instanceof CampaignBusinessTypeChanged) {
                    emittedEvent = event;
                }
            });

            campaign.changeBusinessType(BusinessType.ECOMMERCE);

            expect(campaign.getBusinessType()).toBe(BusinessType.ECOMMERCE);
            expect(emittedEvent?.oldType).toBe(BusinessType.RETAIL);
            expect(emittedEvent?.newType).toBe(BusinessType.ECOMMERCE);
        });

        it('should throw error when changing to same type', () => {
            const campaign = Campaign.create('123', 'Test', BusinessType.RETAIL);

            expect(() => {
                campaign.changeBusinessType(BusinessType.RETAIL);
            }).toThrow('New business type must be different from current type');
        });
    });

    describe('fromState', () => {
        it('should recreate campaign from state without emitting events', () => {
            let eventEmitted = false;
            const campaign = Campaign.fromState({
                id: '123',
                name: 'Test',
                businessType: BusinessType.RETAIL
            });

            campaign.listen(() => {
                eventEmitted = true;
            });

            expect(campaign.getId()).toBe('123');
            expect(campaign.getName()).toBe('Test');
            expect(campaign.getBusinessType()).toBe(BusinessType.RETAIL);
            expect(eventEmitted).toBe(false);
        });
    });
});
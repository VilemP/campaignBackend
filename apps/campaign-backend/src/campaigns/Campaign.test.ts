import { describe, it, expect } from 'vitest';
import { Campaign } from './Campaign.js';
import { BusinessProductType } from '../business-products/productTypes.js';
import { CampaignCreated, CampaignBusinessTypeChanged } from './events/CampaignEvents.js';
import { DomainEvent } from '@libs/domain';
import { CampaignId } from '@campaign-backend/campaigns/CampaignId.js';

const CAMPAIGN_ID = CampaignId.generate();
describe('Campaign', () => {
    describe('create', () => {
        it('should create campaign and emit CampaignCreated event', () => {
            let emittedEvent: CampaignCreated | null = null;
            new Campaign(
                CAMPAIGN_ID, 
                'Test Campaign', 
                BusinessProductType.STANDARD,
                [(event: DomainEvent) => {
                    if (event instanceof CampaignCreated) {
                        emittedEvent = event;
                    }
                }]
            );
            expect(emittedEvent).not.toBeNull();
            expect(emittedEvent!.campaignId).toBe(CAMPAIGN_ID);
            expect(emittedEvent!.name).toBe('Test Campaign');
            expect(emittedEvent!.businessType).toBe(BusinessProductType.STANDARD);
        });
    });

    describe('changeBusinessType', () => {
        it('should change business type and emit event', () => {
            let emittedEvent: CampaignBusinessTypeChanged | null = null;
            const campaign = new Campaign( CAMPAIGN_ID, 'Test', BusinessProductType.STANDARD);
            
            campaign.listen((event) => {
                if (event instanceof CampaignBusinessTypeChanged) {
                    emittedEvent = event;
                }
            });

            campaign.changeBusinessType(BusinessProductType.SPONSORSHIP);
            expect(emittedEvent).not.toBeNull();
            expect(emittedEvent!.oldType).toBe(BusinessProductType.STANDARD);
            expect(emittedEvent!.newType).toBe(BusinessProductType.SPONSORSHIP);
        });

        it('should not emit event if new type is the same', () => {
            let emittedEvent: CampaignBusinessTypeChanged | null = null;
            const campaign = new Campaign(CAMPAIGN_ID, 'Test', BusinessProductType.SPONSORSHIP);
            campaign.listen((event) => {
                if (event instanceof CampaignBusinessTypeChanged) {
                    emittedEvent = event;
                }
            });
            expect(emittedEvent).toBeNull();
        });
    });

    describe('fromState', () => {
        it('should recreate campaign from state without emitting events', () => {
            let eventEmitted = false;
            const campaign = Campaign.fromState({
                id:   CAMPAIGN_ID,
                name: 'Test',
                businessType: BusinessProductType.STANDARD
            });

            campaign.listen(() => {
                eventEmitted = true;
            });

            // expect(campaign.getId()).toBe('123');
            // expect(campaign.getName()).toBe('Test');
            // expect(campaign.getBusinessType()).toBe(BusinessType.RETAIL);
            expect(eventEmitted).toBe(false);
        });
    });
});
import { describe, it, expect } from 'vitest';
import { CreateCampaignCommand } from './CreateCampaignCommand.js';
import { BusinessType } from '@campaign-backend/domain/model/types.js';
import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';
import { Campaign } from '@campaign-backend/domain/model/Campaign.js';
import { CampaignRepository, DuplicateCampaignError } from '../../persistence/repositories/CampaignRepository.js';

describe('Campaign Creation', () => {
    describe('given a campaign with name and business type', () => {
        const campaignId = new CampaignId(crypto.randomUUID());
        const campaignData = {
            id: campaignId.toString(),
            name: 'Test Campaign',
            businessType: BusinessType.STANDARD
        };

        describe('when the campaign with such id does not exist yet', () => {
            let storedCampaign: Campaign | null = null;
            const repository: CampaignRepository = {
                createCampaign: async (id, name, businessType) => {
                    const campaign = new Campaign(id, name, businessType);
                    storedCampaign = campaign;
                    return campaign;
                },
                save: async () => {},
                load: async (id) => id === campaignData.id ? storedCampaign : null
            };

            it('then the campaign should be created with provided data', async () => {
                const command = new CreateCampaignCommand(campaignData, repository);
                await command.execute();

                const campaign = await repository.load(campaignData.id);
                expect(campaign).toBeDefined();
                expect(campaign?.getId().toString()).toBe(campaignData.id);
                expect(campaign?.getName()).toBe(campaignData.name);
            });
        });

        describe('when campaign with same id already exists', () => {
            const repository: CampaignRepository = {
                createCampaign: async () => {
                    throw new DuplicateCampaignError(campaignId.toString());
                },
                save: async () => {},
                load: async () => new Campaign(campaignId, 'Existing Campaign', BusinessType.STANDARD)
            };

            it('then it should fail with duplicate campaign error', async () => {
                const command = new CreateCampaignCommand(campaignData, repository);
                await expect(command.execute()).rejects.toThrow(DuplicateCampaignError);
            });
        });
    });
});
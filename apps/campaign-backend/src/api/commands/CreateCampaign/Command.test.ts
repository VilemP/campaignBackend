import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCampaignCommand } from './CreateCampaign/Command.js';
import { BusinessType } from '@campaign-backend/domain/model/types.js';
import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';
import { CampaignAlreadyExists } from '../../persistence/repositories/CampaignRepository.js';
import { InMemoryCampaignRepository } from '../../persistence/repositories/InMemoryCampaignRepository.js';

describe('Campaign Creation', () => {
    describe('given a campaign with name and business type', () => {
        const campaignId = new CampaignId(crypto.randomUUID());
        const campaignData = {
            id: campaignId.toString(),
            name: 'Test Campaign',
            businessType: BusinessType.STANDARD
        };

        let repository: InMemoryCampaignRepository;

        beforeEach(() => {
            repository = new InMemoryCampaignRepository();
        });

        describe('when the campaign with such id does not exist yet', () => {
            repository.empty();
            it('then the campaign should be created with provided data', async () => {
                const command = new CreateCampaignCommand(repository);
                await command.execute(campaignData);

                const campaign = await repository.load(campaignData.id);
                expect(campaign).toBeDefined();
                expect(campaign?.getId().toString()).toBe(campaignData.id);
                expect(campaign?.getName()).toBe(campaignData.name);
            });
        });

        describe('when campaign with same id already exists', () => {
            beforeEach(async () => {
                await repository.createCampaign(
                    campaignId,
                    campaignData.name,
                    campaignData.businessType
                );
            });

            it('then it should fail with duplicate campaign error', async () => {
                const command = new CreateCampaignCommand(repository);
                await expect(command.execute(campaignData)).rejects.toThrow(CampaignAlreadyExists);
            });
        });
    });
});
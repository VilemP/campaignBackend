
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignCommand } from './Command.js';
import { BusinessType } from '../../../domain/model/types.js';
import { CampaignId } from '../../..//domain/model/CampaignId.js';
import { InMemoryCampaignRepository } from '../../../persistence/repositories/InMemoryCampaignRepository.js';
import { describe, expect, it, beforeEach } from 'vitest';
import { CampaignAlreadyExists } from '../../../persistence/repositories/CampaignRepository.js';

describe('Campaign Creation', () => {
    let command: CreateCampaignCommand;
    let repository: InMemoryCampaignRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateCampaignCommand, InMemoryCampaignRepository],
        }).compile();

        command = module.get<CreateCampaignCommand>(CreateCampaignCommand);
        repository = module.get<InMemoryCampaignRepository>(InMemoryCampaignRepository);
    });

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
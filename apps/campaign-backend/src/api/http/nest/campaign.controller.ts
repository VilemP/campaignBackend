import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateCampaignData } from './data/create-campaign.data.js';
import { CreateCampaignCommand } from '../../commands/CreateCampaign/Command.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from './campaign.token.js';

@Controller('campaigns')
export class CampaignController {
    constructor(
        @Inject(CAMPAIGN_REPOSITORY)
        private readonly repository: CampaignRepository
    ) {}

    @Post()
    async create(@Body() createCampaignData: CreateCampaignData): Promise<void> {
        const command = new CreateCampaignCommand(this.repository);
        console.log(createCampaignData);
        await command.execute(createCampaignData);
    }
}

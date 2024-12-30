import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateCampaignPayload } from './payload.js';
import { CreateCampaignCommand } from './Command.js';
import type  { CampaignRepository } from '../../adapters/repositories/CampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from '../../adapters/di/di.tokens.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Create new campaign')
@Controller('campaigns')
export class CreateCampaignEndpoint {
    constructor(
        @Inject(CAMPAIGN_REPOSITORY)
        private readonly repository: CampaignRepository
    ) {}

    @Post()
    async create(
        @Body() 
        createCampaignData: CreateCampaignPayload): Promise<void> 
    {
        const command = new CreateCampaignCommand(this.repository);
        await command.execute(createCampaignData);
    }

}

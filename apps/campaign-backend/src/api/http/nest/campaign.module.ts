import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller.js';
import { EventSourcedCampaignRepository } from '../../../persistence/repositories/EventSourcedCampaignRepository.js';
import { InMemoryCampaignRepository } from '../../../persistence/repositories/InMemoryCampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from './campaign.token.js';

@Module({
    controllers: [CampaignController],
    providers: [{
        provide: CAMPAIGN_REPOSITORY,
        useClass: process.env['NODE_ENV'] === 'test' 
            ? InMemoryCampaignRepository 
            : EventSourcedCampaignRepository
    }]
})
export class CampaignModule {}

import { Module } from '@nestjs/common';
import { CreateCampaignEndpoint } from '../../../campaigns/create/endpoint.js';
import { EventSourcedCampaignRepository } from '../../../persistence/repositories/EventSourcedCampaignRepository.js';
import { InMemoryCampaignRepository } from '../../../persistence/repositories/InMemoryCampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from './campaign.token.js';

@Module({
    controllers: [
        CreateCampaignEndpoint
    ],
    providers: [{
        provide: CAMPAIGN_REPOSITORY,
        useClass: true
            ? InMemoryCampaignRepository 
            : EventSourcedCampaignRepository
    }]
})
export class CampaignModule {}

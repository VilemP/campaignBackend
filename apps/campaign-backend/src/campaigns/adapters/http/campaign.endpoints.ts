import { Module } from '@nestjs/common';
import { CreateCampaignEndpoint } from '../../actions/create/endpoint.js';
import { EventSourcedCampaignRepository } from '../repositories/EventSourcedCampaignRepository.js';
import { InMemoryCampaignRepository } from '../repositories/InMemoryCampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from '../di/di.tokens.js';

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
export class CampaignEndpointsModule {}

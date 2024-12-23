import { Module } from '@nestjs/common';
import { CreateCampaignEndpoint } from '../../../campaigns/create/endpoint.js';
import { EventSourcedCampaignRepository } from '../../../campaigns/adapters/repositories/EventSourcedCampaignRepository.js';
import { InMemoryCampaignRepository } from '../../../campaigns/adapters/repositories/InMemoryCampaignRepository.js';
import { CAMPAIGN_REPOSITORY } from '../../../campaigns/adapters/di/di.tokens.js';

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

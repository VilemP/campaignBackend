import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller.js';
import { InMemoryCampaignRepository } from '../../../persistence/repositories/InMemoryCampaignRepository.js'; // Import your in-memory implementation
import { EventSourcedCampaignRepository } from '../../../persistence/repositories/EventSourcedCampaignRepository.js'; // Import your event-sourced implementation
import { CAMPAIGN_REPOSITORY } from './dependency-injection-tokens.js';

const repositoryProvider = {
    provide: CAMPAIGN_REPOSITORY,
    useClass: process.env['NODE_ENV'] === 'test' ? InMemoryCampaignRepository : EventSourcedCampaignRepository,
};

@Module({
    controllers: [CampaignsController],
    providers: [repositoryProvider],
    exports: [repositoryProvider],
})
export class CampaignsModule {}
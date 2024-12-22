import { Module } from '@nestjs/common';
import { CampaignModule } from './api/http/nest/campaign.module.js';

@Module({
    imports: [CampaignModule]
})
export class AppModule {}

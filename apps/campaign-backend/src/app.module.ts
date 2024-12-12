
import { Module } from '@nestjs/common';
import { CampaignsModule } from './api/http/controllers/campaigns.module.js'; // Adjust the path as necessary

@Module({
    imports: [CampaignsModule], // Import the CampaignsModule here
})
export class AppModule {}
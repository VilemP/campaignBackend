import { Module } from '@nestjs/common';
import { CampaignEndpointsModule } from './campaigns/adapters/http/campaign.endpoints.js';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Module({
    imports: [CampaignEndpointsModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
                transform: true
            })
        }
    ]
})
export class AppModule {}

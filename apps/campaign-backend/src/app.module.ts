import { Module } from '@nestjs/common';
import { CampaignModule } from './api/http/nest/campaign.module.js';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Module({
    imports: [CampaignModule],
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

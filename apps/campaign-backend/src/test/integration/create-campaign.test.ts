import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module.js';
import { BusinessProductType } from '../../business-products/productTypes.js';
import { CAMPAIGN_REPOSITORY } from '../../campaigns/adapters/di/di.tokens.js';
import { EventSourcedCampaignRepository } from '../../campaigns/adapters/repositories/EventSourcedCampaignRepository.js';
import { InMemoryEventStore } from '@libs/event-sourcing';
import { CampaignId } from '@campaign-backend/campaigns/CampaignId.js';

describe('Create Campaign Integration', () => {
    let app: INestApplication;
    let repository: EventSourcedCampaignRepository;
    
    beforeAll(async () => {
        const eventStore = new InMemoryEventStore();
        repository = new EventSourcedCampaignRepository(eventStore);

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideProvider(CAMPAIGN_REPOSITORY)
        .useValue(repository)
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app?.close();
    });

    it('should create campaign and return 201', async () => {
        const payload = {
            id: CampaignId.generate().toString(),
            name: 'Test Campaign',
            businessType: BusinessProductType.STANDARD,
        };

        await request(app.getHttpServer())
            .post('/campaigns')
            .send(payload)
            .expect(201);

        const storedCampaign = await repository.load(payload.id);
        expect(storedCampaign).not.toBeNull();
        expect(storedCampaign?.getId().toString()).toBe(payload.id);
    });
});
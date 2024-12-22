import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module.js';
import { BusinessType } from '../../domain/model/types.js';
import { CAMPAIGN_REPOSITORY } from '../../api/http/nest/campaign.token.js';
import { EventSourcedCampaignRepository } from '../../persistence/repositories/EventSourcedCampaignRepository.js';
import { InMemoryEventStore } from '@libs/event-sourcing';

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
            id: crypto.randomUUID(),
            name: 'Test Campaign',
            businessType: BusinessType.STANDARD,
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
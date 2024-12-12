import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Server } from 'http';
import request from 'supertest';
import { InMemoryEventStore } from '@libs/event-sourcing';
import { EventSourcedCampaignRepository } from '../../persistence/repositories/EventSourcedCampaignRepository.js';
import { BusinessType } from '../../domain/model/types.js';
import { NestFactory } from '@nestjs/core'; // Direct import
import { AppModule } from '../../app.module.js'; // Adjust the path as necessary

describe('Create Campaign Integration', () => {
    let app: any;
    let server: Server;
    let repository: EventSourcedCampaignRepository;
    let eventStore: InMemoryEventStore;
    
    beforeAll(async () => {
        eventStore = new InMemoryEventStore();
        await eventStore.init();
        repository = new EventSourcedCampaignRepository(eventStore);
        app = await NestFactory.create(AppModule); // Use the direct import
        server = app.listen(0); // Random port
    });

    afterAll(() => {
        return new Promise<void>((resolve) => {
            server.close(() => resolve());
        });
    });

    it('should create campaign and return 201', async () => {
        const payload = {
            id: crypto.randomUUID(),
            name: 'Test Campaign',
            businessType: BusinessType.STANDARD
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
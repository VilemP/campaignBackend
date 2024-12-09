import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Express } from 'express';
import { Server } from 'http';
import request from 'supertest';
import { createServer } from '../../api/http/server.js';
import { InMemoryEventStore } from '@libs/event-sourcing';
import { EventSourcedCampaignRepository } from '../../persistence/repositories/EventSourcedCampaignRepository.js';
import { BusinessType } from '../../domain/model/types.js';

describe('Create Campaign Integration', () => {
    let app: Express;
    let server: Server;
    let repository: EventSourcedCampaignRepository;
    
    beforeAll(() => {
        const eventStore = new InMemoryEventStore();
        repository = new EventSourcedCampaignRepository(eventStore);
        app = createServer({ repositories: { campaign: repository } });
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

        await request(app)
            .post('/campaigns')
            .send(payload)
            .expect(201);

        const storedCampaign = await repository.load(payload.id);
        expect(storedCampaign).not.toBeNull();
        expect(storedCampaign?.getId().toString()).toBe(payload.id);
    });
}); 
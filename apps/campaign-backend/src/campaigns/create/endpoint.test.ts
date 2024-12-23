import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BusinessType } from '../../domain/model/types.js';
import { CreateCampaignCommand } from './Command.js';
import { CAMPAIGN_REPOSITORY } from '../adapters/di/di.tokens.js';
import { AppModule } from '../../app.module.js';
import { InMemoryCampaignRepository } from '@campaign-backend/campaigns/adapters/repositories/InMemoryCampaignRepository.js';

describe('POST /campaigns endpoint', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        })    
        .overrideProvider(CAMPAIGN_REPOSITORY)
        .useValue(new InMemoryCampaignRepository())
        .compile();
      
        app = moduleRef.createNestApplication();
        return await app.init();
      });

    afterEach(async () => {
        vi.restoreAllMocks();
        await app?.close();
    });

    it('should execute [create campaign command] with provided data' , async () => {
        const executeSpy = vi.spyOn(CreateCampaignCommand.prototype, 'execute');
    
        const httpRequest = {
            id: '018df485-9956-7f8c-8502-f6e271193b2b',
            name: 'Test Campaign',
            businessType: 'STANDARD'
        };

        await request(app.getHttpServer())
            .post('/campaigns')
            .send(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith({
            id: httpRequest.id,
            name: httpRequest.name,
            businessType: BusinessType.STANDARD
        });
    });

    it('should accept request with extra properties', async () => {
        const executeSpy = vi.spyOn(CreateCampaignCommand.prototype, 'execute');

        const httpRequest = {
            id: '018df485-9956-7f8c-8502-f6e271193b2b',
            name: 'Test Campaign',
            businessType: 'STANDARD',
            extraProperty: 'some value',
            anotherExtra: 123
        };

        const response = await request(app.getHttpServer())
            .post('/campaigns')
            .send(httpRequest);

        expect(response.status).toBe(201);
        expect(executeSpy).toHaveBeenCalledWith({
            id: httpRequest.id,
            name: httpRequest.name,
            businessType: BusinessType.STANDARD
        });
    });

    it('should fail with validation errors for invalid data', async () => {

        const invalidRequests = [
            {
                data: {
                    id: 'not-a-uuid',
                    name: 'Test Campaign',
                    businessType: 'STANDARD'
                },
                expectedError: 'Campaign ID must be a valid UUIDv4'
            },
            {
                data: {
                    id: '018df485-9956-7f8c-8502-f6e271193b2b',
                    name: 'Te',  // too short
                    businessType: 'STANDARD'
                },
                expectedError: 'Campaign name must be between 3 and 100 characters'
            },
            {
                data: {
                    id: '018df485-9956-7f8c-8502-f6e271193b2b',
                    name: 'Test Campaign',
                    businessType: 'INVALID_TYPE'
                },
                expectedError: 'Business type must be one of: SPONSORSHIP, STANDARD'
            }
        ];

        for (const { data, expectedError } of invalidRequests) {
            const response = await request(app.getHttpServer())
                .post('/campaigns')
                .send(data);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain(expectedError);
        }
    });
});
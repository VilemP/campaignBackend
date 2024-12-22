import { describe, it, expect, vi, afterEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BusinessType } from '../../../domain/model/types.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { CreateCampaignCommand } from './Command.js';
import { CampaignModule } from '../../http/nest/campaign.module.js';
import { CAMPAIGN_REPOSITORY } from '../../http/nest/campaign.token.js';

describe('POST /campaigns endpoint', () => {
    let app: INestApplication;

    afterEach(async () => {
        vi.restoreAllMocks();
        await app?.close();
    });

    it('should execute [create campaign command] with provided data' , async () => {
        const executeSpy = vi.spyOn(CreateCampaignCommand.prototype, 'execute');
        
        const mockRepository: CampaignRepository = {
            createCampaign: vi.fn(),
            save: vi.fn(),
            load: vi.fn()
        };

        const moduleRef = await Test.createTestingModule({
            imports: [CampaignModule],
        })
        .overrideProvider(CAMPAIGN_REPOSITORY)
        .useValue(mockRepository)
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        const httpRequest = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Test Campaign',
            businessType: 'STANDARD'
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
});
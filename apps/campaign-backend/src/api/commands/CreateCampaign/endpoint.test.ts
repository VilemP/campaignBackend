import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import { BusinessType } from '../../../domain/model/types.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { createServer } from '../../http/server.js';
import { CreateCampaignCommand } from './Command.js';

describe('POST /campaigns endpoint', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should pass HTTP request data to command execute', async () => {
        const executeSpy = vi.spyOn(CreateCampaignCommand.prototype, 'execute');
        
        const mockRepository: CampaignRepository = {
            createCampaign: vi.fn(),
            save: vi.fn(),
            load: vi.fn()
        };
        
        const app = createServer({
            repositories: {
                campaign: mockRepository
            }
        });

        const httpRequest = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Test Campaign',
            businessType: 'STANDARD'
        };

        const response = await request(app)
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
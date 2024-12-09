import { CommandHttpEndpoint, HttpRequest } from '@libs/rest-api';
import { BusinessType } from '../../../domain/model/types.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { CreateCampaignCommand, CampaignData, campaignSchema } from './Command.js';

export const endpoint: CommandHttpEndpoint<CampaignData, CampaignRepository> = {
    method: 'POST',
    path: '/campaigns',
    command: CreateCampaignCommand,
    schema: campaignSchema,
    responses: {
        success: {
            code: 201,
            response: { description: 'Campaign created successfully' }
        },
        clientErrors: [{
            code: 400,
            response: { description: 'Invalid request payload' }
        }],
        serverErrors: [{
            code: 500,
            response: { description: 'Internal server error' }
        }]
    },
    createPayload: (req: HttpRequest): CampaignData => {
        const body = req.body as { id?: unknown; name?: unknown; businessType?: unknown };
        const payload = {
            id: typeof body.id === 'string' ? body.id : '',
            name: typeof body.name === 'string' ? body.name : '',
            businessType: typeof body.businessType === 'string' ? BusinessType[body.businessType as keyof typeof BusinessType] : BusinessType.STANDARD
        };
        return payload;
    }
}; 
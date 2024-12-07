import { Schema } from '@libs/validation';
import { Command, CommandHttpEndpoint, HttpRequest } from '@libs/rest-api';
import { Campaign } from '../../domain/model/Campaign.js';
import { BusinessType } from '../../domain/model/types.js';
import { CampaignRepository } from '../../persistence/repositories/CampaignRepository.js';

const schema = Schema.input(Schema.object({
    name: Schema.string().min(3).max(100),
    businessType: Schema.enum([...Object.values(BusinessType)] as [string, ...string[]])
}));

type CampaignData = (typeof schema)['type'];

export class CreateCampaignCommand implements Command<CampaignData> {
    constructor(
        private readonly payload: CampaignData,
        private readonly repository: CampaignRepository
    ) {
        schema.validate(payload);
    }

    async execute(): Promise<void> {
        const campaign = Campaign.create(
            Math.random().toString(36).substring(2, 15),
            this.payload.name,
            this.payload.businessType as BusinessType
        );
        
        await this.repository.save(campaign);
    }
}

export const endpoint: CommandHttpEndpoint<CampaignData, CampaignRepository> = {
    method: 'POST',
    path: '/campaigns',
    command: CreateCampaignCommand,
    schema,
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
        const body = req.body as { name?: unknown; businessType?: unknown };
        const payload = {
            name: typeof body.name === 'string' ? body.name : '',
            businessType: typeof body.businessType === 'string' ? body.businessType : ''
        };
        return payload;
    }
};

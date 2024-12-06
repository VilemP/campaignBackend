import { Schema } from '@libs/validation';
import { Command } from '@libs/cqrs';
import { CommandHttpEndpoint } from '@libs/rest-api';
import { Campaign } from '../../domain/model/Campaign';
import { BusinessType } from '../../domain/model/types';
import { CampaignRepository } from '../../persistence/repositories/CampaignRepository';
import { v4 as uuid } from 'uuid';

const schema = Schema.input(Schema.object({
    name: Schema.string().min(3).max(100),
    businessType: Schema.enum([...Object.values(BusinessType)] as [string, ...string[]])
}));

type CampaignData = (typeof schema)['type'];

export class CreateCampaignCommand implements Command {
    constructor(
        private readonly payload: CampaignData,
        private readonly repository: CampaignRepository
    ) {
        schema.validate(payload);
    }

    async execute(): Promise<void> {
        const campaign = Campaign.create(
            uuid(),
            this.payload.name,
            BusinessType[this.payload.businessType]
        );
        
        await this.repository.save(campaign);
    }
}
export const endpoint: CommandHttpEndpoint<CreateCampaignCommand, CampaignData> = {
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
    createPayload: (req: any): CampaignData => ({
        name: req.body.name,
        businessType: req.body.businessType
    })
};

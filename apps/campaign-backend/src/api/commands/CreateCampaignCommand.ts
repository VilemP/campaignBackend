import { Schema } from '@libs/validation/Schema';
import { Command } from '../types';
import { HttpEndpoint } from '../http/types';

const schema = Schema.object({
    name: Schema.string().min(3).max(100).build(),
    businessType: Schema.enum(['RETAIL', 'ECOMMERCE', 'SERVICE']).build()
});

type CreateCampaignPayload = (typeof schema)['type'];

export class CreateCampaignCommand implements Command {
    constructor(
        private readonly payload: CreateCampaignPayload,
        private readonly repository: any  // Type will be added when repository is implemented
    ) {
        schema.validate(payload);
    }

    async execute(): Promise<void> {
        // Implementation will be added
    }
}

export const endpoint: HttpEndpoint = {
    method: 'POST',
    path: '/campaigns',
    command: CreateCampaignCommand,
    schema,
    responses: {
        201: { description: 'Campaign created successfully' },
        400: { description: 'Invalid request payload' }
    },
    createPayload: (req: any): CreateCampaignPayload => ({
        name: req.body.name,
        businessType: req.body.businessType
    })
};
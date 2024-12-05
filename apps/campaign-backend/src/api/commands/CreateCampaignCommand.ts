import { Schema } from '@libs/validation';
import { Command } from '@libs/cqrs';
import type { HttpEndpoint } from '@libs/api-rest';

interface CampaignData {
    name: string;
    businessType: 'RETAIL' | 'ECOMMERCE' | 'SERVICE';
}

const schema = Schema.input(Schema.object({
    name: Schema.string().min(3).max(100),
    businessType: Schema.enum(['RETAIL', 'ECOMMERCE', 'SERVICE'])
}));

export class CreateCampaignCommand implements Command {
    constructor(
        private readonly payload: CampaignData,
        private readonly repository: any
    ) {
        schema.validate(payload);
    }

    async execute(): Promise<void> {
        // Implementation will be added
    }
}

export const endpoint: HttpEndpoint<CampaignData> = {
    method: 'POST',
    path: '/campaigns',
    command: CreateCampaignCommand,
    schema,
    responses: {
        201: { description: 'Campaign created successfully' },
        400: { description: 'Invalid request payload' }
    },
    createPayload: (req: any): CampaignData => ({
        name: req.body.name,
        businessType: req.body.businessType
    })
};
import { Schema, InferSchemaType } from '@libs/validation';
import { Command } from '@libs/rest-api';
import { BusinessType } from '../../domain/model/types.js';
import { CampaignRepository } from '../../persistence/repositories/CampaignRepository.js';
import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';

const campaignSchema = Schema.object({
    id: Schema.string(),
    name: Schema.string(),
    businessType: Schema.nativeEnum(BusinessType)
});

export type CampaignData = InferSchemaType<typeof campaignSchema>;

export class CreateCampaignCommand implements Command<void> {
    private readonly payload: CampaignData;

    constructor(
        payload: CampaignData,
        private readonly repository: CampaignRepository
    ) {
        this.payload = campaignSchema.validate(payload);
    }

    async execute(): Promise<void> {
        const id = new CampaignId(this.payload.id);
        await this.repository.createCampaign(
            id,
            this.payload.name,
            this.payload.businessType
        );
    }
}

// export const endpoint: CommandHttpEndpoint<CampaignData, CampaignRepository> = {
//     method: 'POST',
//     path: '/campaigns',
//     command: CreateCampaignCommand,
//     schema,
//     responses: {
//         success: {
//             code: 201,
//             response: { description: 'Campaign created successfully' }
//         },
//         clientErrors: [{
//             code: 400,
//             response: { description: 'Invalid request payload' }
//         }],
//         serverErrors: [{
//             code: 500,
//             response: { description: 'Internal server error' }
//         }]
//     },
//     createPayload: (req: HttpRequest): CampaignData => {
//         const body = req.body as { name?: unknown; businessType?: unknown };
//         const payload = {
//             name: typeof body.name === 'string' ? body.name : '',
//             businessType: typeof body.businessType === 'string' ? body.businessType : ''
//         };
//         return payload;
//     }
// };

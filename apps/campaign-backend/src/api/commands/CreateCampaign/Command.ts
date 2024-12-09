import { Schema, InferSchemaType } from '@libs/validation';
import { Command } from '@libs/rest-api';
import { BusinessType } from '../../../domain/model/types.js';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';

export const campaignSchema = Schema.object({
    id: Schema.string(),
    name: Schema.string(),
    businessType: Schema.nativeEnum(BusinessType)
});

export type CampaignData = InferSchemaType<typeof campaignSchema>;

export class CreateCampaignCommand implements Command<CampaignData> {
    constructor(private readonly repository: CampaignRepository) {}

    async execute(data: CampaignData): Promise<void> {
        const payload = campaignSchema.validate(data);
        const id = new CampaignId(payload.id);
        await this.repository.createCampaign(
            id,
            payload.name,
            payload.businessType
        );
    }
} 
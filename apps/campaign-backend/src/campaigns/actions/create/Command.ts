import { Command } from '@libs/rest-api';
import { CampaignRepository } from '../../adapters/repositories/CampaignRepository.js';
import { CampaignId } from '@campaign-backend/campaigns/CampaignId.js';
import { CreateCampaignPayload } from '@campaign-backend/campaigns/actions/create/payload.js';


export class CreateCampaignCommand implements Command<CreateCampaignPayload> {
    constructor(private readonly repository: CampaignRepository) {}

    async execute(data: CreateCampaignPayload): Promise<void> {
        const id = new CampaignId(data.id);
        await this.repository.createCampaign(
            id,
            data.name,
            data.businessType
        );
    }
} 
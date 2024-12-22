import { Command } from '@libs/rest-api';
import { CampaignRepository } from '../../../persistence/repositories/CampaignRepository.js';
import { CampaignId } from '@campaign-backend/domain/model/CampaignId.js';
import { CreateCampaignData } from '@campaign-backend/api/http/nest/data/create-campaign.data.js';


export class CreateCampaignCommand implements Command<CreateCampaignData> {
    constructor(private readonly repository: CampaignRepository) {}

    async execute(data: CreateCampaignData): Promise<void> {
        const id = new CampaignId(data.id);
        await this.repository.createCampaign(
            id,
            data.name,
            data.businessType
        );
    }
} 
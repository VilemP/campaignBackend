import { Campaign } from '../../domain/model/Campaign.js';
import { CampaignId } from '../../domain/model/CampaignId.js';
import { BusinessType } from '../../domain/model/types.js';
import { CampaignRepository, CampaignAlreadyExists, CampaignNotFoundError } from './CampaignRepository.js';

export class InMemoryCampaignRepository implements CampaignRepository {
    private campaigns = new Map<string, Campaign>();

    async createCampaign(id: CampaignId, name: string, businessType: BusinessType): Promise<Campaign> {
        const campaignId = id.toString();
        if (this.campaigns.has(campaignId)) {
            throw new CampaignAlreadyExists(campaignId);
        }

        const campaign = new Campaign(id, name, businessType);
        this.campaigns.set(campaignId, campaign);
        return campaign;
    }

    async save(campaign: Campaign): Promise<void> {
        const id = campaign.getId().toString();
        if (!this.campaigns.has(id)) {
            throw new CampaignNotFoundError(id);
        }
        this.campaigns.set(id, campaign);
    }

    async load(id: string): Promise<Campaign | null> {
        return this.campaigns.get(id) ?? null;
    }

    empty(): void {
        this.campaigns.clear();
    }
} 
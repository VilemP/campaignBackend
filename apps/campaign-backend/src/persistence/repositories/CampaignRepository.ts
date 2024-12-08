import { Campaign } from '../../domain/model/Campaign.js';
import { CampaignId } from '../../domain/model/CampaignId.js';
import { BusinessType } from '../../domain/model/types.js';

export interface CampaignRepository {
    /**
     * Creates a new campaign. Throws if campaign with given id already exists.
     */
    createCampaign(id: CampaignId, name: string, businessType: BusinessType): Promise<Campaign>;

    /**
     * Saves changes to an existing campaign. Throws if campaign doesn't exist.
     */
    save(campaign: Campaign): Promise<void>;
    
    load(id: string): Promise<Campaign | null>;
}

export class DuplicateCampaignError extends Error {
    constructor(id: string) {
        super(`Campaign with id ${id} already exists`);
        this.name = 'DuplicateCampaignError';
    }
}

export class CampaignNotFoundError extends Error {
    constructor(id: string) {
        super(`Campaign with id ${id} not found`);
        this.name = 'CampaignNotFoundError';
    }
}
import { Campaign } from '../../domain/model/Campaign';

export interface CampaignRepository {
    save(campaign: Campaign): Promise<void>;
    load(id: string): Promise<Campaign | null>;
}

export class ConcurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConcurrencyError';
    }
}
import { CampaignId } from './CampaignId.js';
import { BusinessType } from './types.js';

export interface CampaignState {
    readonly id: CampaignId;
    readonly name: string;
    readonly businessType: BusinessType;
    readonly description?: string;
} 
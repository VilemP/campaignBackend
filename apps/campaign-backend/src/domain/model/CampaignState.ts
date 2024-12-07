import { BusinessType } from './types.js';

export interface CampaignState {
    readonly id: string;
    readonly name: string;
    readonly businessType: BusinessType;
} 
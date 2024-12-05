import { BusinessType } from './types';

export interface CampaignState {
    readonly id: string;
    readonly name: string;
    readonly businessType: BusinessType;
} 
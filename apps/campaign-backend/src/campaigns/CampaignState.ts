import { CampaignId } from './CampaignId.js';
import { BusinessProductType } from '../business-products/productTypes.js';

export interface CampaignState {
    readonly id: CampaignId;
    readonly name: string;
    readonly businessType: BusinessProductType;
    readonly description?: string;
}
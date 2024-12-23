import { DomainEvent } from '@libs/domain';
import { BusinessProductType } from '../../business-products/productTypes.js';
import { CampaignId } from '../../campaigns/CampaignId.js';

export class CampaignCreated extends DomainEvent {
    constructor(
        readonly campaignId: CampaignId,
        readonly name: string,
        readonly businessType: BusinessProductType
    ) {
        super();
    }
}

export class CampaignBusinessTypeChanged extends DomainEvent {
    constructor(
        readonly campaignId: CampaignId,
        readonly oldType: BusinessProductType,
        readonly newType: BusinessProductType   
    ) {
        super();
    }
}
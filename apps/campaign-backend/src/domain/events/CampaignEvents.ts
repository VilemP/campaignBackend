import { DomainEvent } from '@libs/domain';
import { BusinessType } from '../model/types.js';
import { CampaignId } from '../model/CampaignId.js';

export class CampaignCreated extends DomainEvent {
    constructor(
        readonly campaignId: CampaignId,
        readonly name: string,
        readonly businessType: BusinessType
    ) {
        super();
    }
}

export class CampaignBusinessTypeChanged extends DomainEvent {
    constructor(
        readonly campaignId: CampaignId,
        readonly oldType: BusinessType,
        readonly newType: BusinessType
    ) {
        super();
    }
}
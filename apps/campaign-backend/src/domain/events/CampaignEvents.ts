import { DomainEvent } from '@libs/domain';
import { BusinessType } from '../model/types.js';

export class CampaignCreated extends DomainEvent {
    constructor(
        readonly campaignId: string,
        readonly name: string,
        readonly businessType: BusinessType
    ) {
        super();
    }
}

export class CampaignBusinessTypeChanged extends DomainEvent {
    constructor(
        readonly campaignId: string,
        readonly oldType: BusinessType,
        readonly newType: BusinessType
    ) {
        super();
    }
}
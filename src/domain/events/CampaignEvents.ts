import { DomainEvent } from './DomainEvent';
import { BusinessType } from '../model/Campaign';

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
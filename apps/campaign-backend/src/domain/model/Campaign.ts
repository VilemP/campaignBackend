import { Entity } from '@libs/domain';
import { BusinessType } from './types.js';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../events/CampaignEvents.js';
import { CampaignState } from './CampaignState.js';

export class Campaign extends Entity<string> {
    private name: string;
    private businessType: BusinessType;

    constructor(id: string, name: string, businessType: BusinessType) {
        super(id);
        this.name = name;
        this.businessType = businessType;
    }

    static create(id: string, name: string, businessType: BusinessType): Campaign {
        const campaign = new Campaign(id, name, businessType);
        campaign.emit(new CampaignCreated(id, name, businessType));
        return campaign;
    }

    static fromState(state: CampaignState): Campaign {
        return new Campaign(state.id, state.name, state.businessType);
    }

    getName(): string {
        return this.name;
    }

    getId(): string {
        return this.id;
    }

    changeBusinessType(newType: BusinessType): void {
        const oldType = this.businessType;
        this.businessType = newType;

        this.emit(new CampaignBusinessTypeChanged(this.id, oldType, newType));
    }
}
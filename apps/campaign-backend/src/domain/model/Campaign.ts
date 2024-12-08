import { Entity } from '@libs/domain';
import { BusinessType } from './types.js';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../events/CampaignEvents.js';
import { CampaignState } from './CampaignState.js';
import { CampaignId } from './CampaignId.js';
import { DomainEvent } from '@libs/domain';

export class Campaign extends Entity<CampaignId> {
    private name: string;
    private businessType: BusinessType;
    // @ts-expect-error Placeholder for future use
    private description?: string;

    constructor(
        id: CampaignId,
        name: string,
        businessType: BusinessType,
        listeners?: Array<(event: DomainEvent) => void>
    ) {
        super(id, listeners);
        this.name = name;
        this.businessType = businessType;
        this.emit(new CampaignCreated(id, name, businessType));
    }

    private setState(state: CampaignState): void {
        this.description = state.description;
    }

    static fromState(state: CampaignState): Campaign {
        const campaign = new Campaign(state.id, state.name, state.businessType);
        campaign.setState(state);
        return campaign;
    }

    getName(): string {
        return this.name;
    }

    getId(): CampaignId {
        return this.id;
    }

    changeBusinessType(newType: BusinessType): void {
        const oldType = this.businessType;
        this.businessType = newType;

        this.emit(new CampaignBusinessTypeChanged(this.id, oldType, newType));
    }
}
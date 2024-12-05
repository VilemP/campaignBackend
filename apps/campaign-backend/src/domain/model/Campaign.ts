import { Entity } from '@libs/domain';
import { BusinessType } from './types';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../events/CampaignEvents';

export interface CampaignState {
    id: string;
    name: string;
    businessType: BusinessType;
}

export class Campaign extends Entity<string> {
    private constructor(
        id: string,
        private name: string,
        private businessType: BusinessType
    ) {
        super(id);
    }

    static create(id: string, name: string, businessType: BusinessType): Campaign {
        const campaign = new Campaign(id, name, businessType);
        campaign.emit(new CampaignCreated(id, name, businessType));
        return campaign;
    }

    static fromState(state: CampaignState): Campaign {
        return new Campaign(state.id, state.name, state.businessType);
    }

    changeBusinessType(newType: BusinessType): void {
        if (newType === this.businessType) {
            throw new Error('New business type must be different from current type');
        }
        
        const oldType = this.businessType;
        this.businessType = newType;
        
        this.emit(new CampaignBusinessTypeChanged(this.id, oldType, newType));
    }

    getName(): string {
        return this.name;
    }

    getBusinessType(): BusinessType {
        return this.businessType;
    }
}
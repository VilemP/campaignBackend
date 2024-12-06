import { BusinessType } from '../../domain/model/types.js';
import { CampaignState } from '../../domain/model/CampaignState.js';
import { DomainEvent } from '@libs/domain';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../../domain/events/CampaignEvents.js';

export class EventSourcedCampaignState implements CampaignState {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly businessType: BusinessType
    ) {}

    static initial(): EventSourcedCampaignState {
        return new EventSourcedCampaignState('', '', BusinessType.RETAIL);
    }

    static fromSnapshot(snapshot: CampaignState): EventSourcedCampaignState {
        return new EventSourcedCampaignState(snapshot.id, snapshot.name, snapshot.businessType);
    }

    applyEvent(event: DomainEvent): EventSourcedCampaignState {
        if (event instanceof CampaignCreated) {
            return new EventSourcedCampaignState(event.campaignId, event.name, event.businessType);
        }
        if (event instanceof CampaignBusinessTypeChanged) {
            return new EventSourcedCampaignState(this.id, this.name, event.newType);
        }
        return this;
    }

    applyEvents(events: DomainEvent[]): EventSourcedCampaignState {
        return events.reduce<EventSourcedCampaignState>(
            (state, event) => state.applyEvent(event), 
            this
        );
    }
} 
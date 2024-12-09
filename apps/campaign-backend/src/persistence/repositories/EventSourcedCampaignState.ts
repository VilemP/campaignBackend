import { BusinessType } from '../../domain/model/types.js';
import { CampaignState } from '../../domain/model/CampaignState.js';
import { DomainEvent } from '@libs/domain';
import { CampaignCreated, CampaignBusinessTypeChanged } from '../../domain/events/CampaignEvents.js';
import { CampaignId } from '../../domain/model/CampaignId.js';

export class EventSourcedCampaignState implements CampaignState {
    constructor(
        readonly id: CampaignId,
        readonly name: string,
        readonly businessType: BusinessType,
        readonly description?: string
    ) {}

    static initial(id: string): EventSourcedCampaignState {
        return new EventSourcedCampaignState(
            new CampaignId(id),
            '',
            BusinessType.STANDARD
        );
    }

    static fromSnapshot(snapshot: CampaignState): EventSourcedCampaignState {
        return new EventSourcedCampaignState(
            snapshot.id,
            snapshot.name,
            snapshot.businessType,
            snapshot.description
        );
    }

    applyEvent(event: DomainEvent): EventSourcedCampaignState {
        if (event instanceof CampaignCreated) {
            return new EventSourcedCampaignState(
                event.campaignId,
                event.name,
                event.businessType
            );
        }
        if (event instanceof CampaignBusinessTypeChanged) {
            return new EventSourcedCampaignState(
                this.id,
                this.name,
                event.newType,
                this.description
            );
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
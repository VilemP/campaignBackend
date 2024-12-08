import { EntityId } from '@libs/domain';
import { v7 as uuidv7 } from 'uuid';

export class CampaignId extends EntityId {
    static generate(): CampaignId {
        return new CampaignId(uuidv7());
    }
} 
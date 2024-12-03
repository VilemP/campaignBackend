import { DomainEvent } from '../../domain/events/DomainEvent';
import { DomainEntity } from '../../domain/model/DomainEntity';

export class EventCollector {
    private entityEvents = new WeakMap<DomainEntity, DomainEvent[]>();

    track(entity: DomainEntity): void {
        this.entityEvents.set(entity, []);
        entity.listen(event => this.entityEvents.get(entity)?.push(event));
    }

    getEvents(entity: DomainEntity): readonly DomainEvent[] {
        return [...(this.entityEvents.get(entity) ?? [])];
    }

    clearEvents(entity: DomainEntity): void {
        this.entityEvents.set(entity, []);
    }
}
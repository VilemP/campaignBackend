import { DomainEvent, DomainEventEmitter } from '@libs/domain';

export class EventCollector<TEvent extends DomainEvent> {
    private collectedEvents = new WeakMap<DomainEventEmitter, TEvent[]>();

    track(entity: DomainEventEmitter): void {
        const events: TEvent[] = [];
        this.collectedEvents.set(entity, events);
        entity.listen(event => events.push(event as TEvent));
    }

    getEvents(entity: DomainEventEmitter): TEvent[] {
        return this.collectedEvents.get(entity) || [];
    }

    clearEvents(entity: DomainEventEmitter): void {
        this.collectedEvents.delete(entity);
    }
} 
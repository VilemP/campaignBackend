import { describe, it, expect } from 'vitest';
import { EventCollector } from './EventCollector';
import { DomainEntity } from '@domain/model/DomainEntity';
import { DomainEvent } from '@domain/events/DomainEvent';

class TestEvent extends DomainEvent {}
class TestEntity extends DomainEntity {
    emitTestEvent() {
        this.emit(new TestEvent());
    }
}

describe('EventCollector', () => {
    it('should collect events from tracked entity', () => {
        const collector = new EventCollector();
        const entity = new TestEntity();

        collector.track(entity);
        entity.emitTestEvent();

        const events = collector.getEvents(entity);
        expect(events.length).toBe(1);
        expect(events[0]).toBeInstanceOf(TestEvent);
    });

    it('should clear events for entity', () => {
        const collector = new EventCollector();
        const entity = new TestEntity();

        collector.track(entity);
        entity.emitTestEvent();
        collector.clearEvents(entity);

        expect(collector.getEvents(entity)).toHaveLength(0);
    });
});
import { AggregateRoot } from './aggregate-root';
import { DomainEvent } from './domain-event';

class TestEvent implements DomainEvent {}

class TestAggregate extends AggregateRoot<string> {
  emitTestEvent(): void {
    this.emit(new TestEvent());
  }
}

describe('AggregateRoot', () => {
  it('should collect emitted events', () => {
    const aggregate = new TestAggregate('test-id');
    aggregate.emitTestEvent();
    aggregate.emitTestEvent();

    const events = aggregate.clearEvents();
    expect(events).toHaveLength(2);
    expect(events[0]).toBeInstanceOf(TestEvent);
  });

  it('should clear events after retrieval', () => {
    const aggregate = new TestAggregate('test-id');
    aggregate.emitTestEvent();

    aggregate.clearEvents();
    const events = aggregate.clearEvents();
    expect(events).toHaveLength(0);
  });
});

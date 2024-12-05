import { Entity } from './entity';
import { DomainEvent } from './domain-event';

/**
 * Base class for aggregate roots - consistency boundaries in the domain.
 * Can emit domain events that represent meaningful changes.
 */
export abstract class AggregateRoot<TId> extends Entity<TId> {
  private _events: DomainEvent[] = [];

  protected emit(event: DomainEvent): void {
    this._events.push(event);
  }

  clearEvents(): DomainEvent[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }
}

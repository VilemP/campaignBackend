/**
 * Base class for domain objects that have a unique identity.
 */
import { DomainEvent } from './domain-event';
import { DomainEventEmitter } from './domain-event-emitter';

export abstract class Entity<TId> implements DomainEventEmitter {
  private listeners: Array<(event: DomainEvent) => void> = [];

  constructor(private readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  equals(other: Entity<TId>): boolean {
    if (!(other instanceof Entity)) return false;
    return this._id === other._id;
  }

  public listen(handler: (event: DomainEvent) => void): void {
    this.listeners.push(handler);
  }

  protected emit(event: DomainEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}

import { DomainEvent } from './domain-event';

export interface DomainEventEmitter {
    listen(handler: (event: DomainEvent) => void): void;
} 
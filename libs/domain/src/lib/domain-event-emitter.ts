import { DomainEvent } from './domain-event.js';

export interface DomainEventEmitter {
    listen(handler: (event: DomainEvent) => void): void;
} 
import { EventEmitter } from '@libs/event-sourcing';
import { DomainEvent } from '@libs/domain';

export abstract class DomainEntity implements EventEmitter<DomainEvent> {
    private listeners: Array<(event: DomainEvent) => void> = [];

    public listen(handler: (event: DomainEvent) => void): void {
        this.listeners.push(handler);
    }

    protected emit(event: DomainEvent): void {
        this.listeners.forEach(listener => listener(event));
    }
}
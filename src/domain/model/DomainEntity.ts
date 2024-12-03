import { DomainEvent } from '../events/DomainEvent';

export abstract class DomainEntity {
    private listeners: Array<(event: DomainEvent) => void> = [];

    public listen(handler: (event: DomainEvent) => void): void {
        this.listeners.push(handler);
    }

    protected emit(event: DomainEvent): void {
        this.listeners.forEach(listener => listener(event));
    }
}
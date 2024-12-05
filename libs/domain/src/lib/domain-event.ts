/**
 * Represents something meaningful that happened in the domain.
 */
export abstract class DomainEvent {
    readonly occurredAt: Date;

    protected constructor() {
        this.occurredAt = new Date();
    }
}

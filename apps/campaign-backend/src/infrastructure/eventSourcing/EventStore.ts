import { DomainEvent } from '../../domain/events/DomainEvent';

export interface EventStore {
    saveEvents(streamId: string, events: DomainEvent[], expectedVersion: number): Promise<void>;
    getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]>;
    getLastVersion(streamId: string): Promise<number>;
}
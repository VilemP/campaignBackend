import { EventStore, ConcurrencyError } from './event-store';
import { EventRecord } from './types';

/**
 * In-memory implementation of EventStore for testing purposes.
 * Not suitable for production use.
 */
export class InMemoryEventStore implements EventStore {
    private readonly streams = new Map<string, EventRecord<unknown, unknown>[]>();

    async append<TEvent, TMeta>(
        streamId: string,
        events: EventRecord<TEvent, TMeta>[],
        expectedVersion?: number
    ): Promise<void> {
        const currentEvents = this.streams.get(streamId) || [];
        const currentVersion = currentEvents.length;

        // Optimistic concurrency check
        if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
            throw new ConcurrencyError(streamId, expectedVersion, currentVersion);
        }

        // Validate event versions
        events.forEach((event, index) => {
            const expectedVersion = currentVersion + index;
            if (event.version !== expectedVersion) {
                throw new Error(
                    `Invalid event version. Expected ${expectedVersion}, got ${event.version}`
                );
            }
        });

        // Append events
        this.streams.set(streamId, [...currentEvents, ...events]);
    }

    async readStream<TEvent, TMeta>(
        streamId: string,
        fromVersion?: number,
        toVersion?: number
    ): Promise<EventRecord<TEvent, TMeta>[]> {
        const events = this.streams.get(streamId) || [];
        
        let result = events;
        
        if (fromVersion !== undefined) {
            result = result.filter(event => event.version >= fromVersion);
        }
        
        if (toVersion !== undefined) {
            result = result.filter(event => event.version <= toVersion);
        }
        
        return result as EventRecord<TEvent, TMeta>[];
    }
}

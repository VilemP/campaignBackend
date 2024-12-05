import { EventStore, ConcurrencyError } from './event-store';
import { EventRecord } from './types';

interface StoredState<T> {
    state: T;
    lastEventApplied: number;
    timestamp: Date;
}

/**
 * In-memory implementation of EventStore for testing purposes.
 * Not suitable for production use.
 */
export class InMemoryEventStore implements EventStore {
    private readonly streams = new Map<string, EventRecord<unknown>[]>();
    private readonly snapshots = new Map<string, StoredState<unknown>>();

    async append<TEvent>(
        streamId: string,
        events: EventRecord<TEvent>[],
        expectedVersion?: number
    ): Promise<void> {
        const currentEvents = this.streams.get(streamId) || [];
        const currentVersion = currentEvents.length;

        if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
            throw new ConcurrencyError(streamId, expectedVersion, currentVersion);
        }

        events.forEach((event, index) => {
            const expectedVersion = currentVersion + index;
            if (event.metadata.version !== expectedVersion) {
                throw new Error(
                    `Invalid event version. Expected ${expectedVersion}, got ${event.metadata.version}`
                );
            }
        });

        this.streams.set(streamId, [...currentEvents, ...events]);
    }

    async readStream<TEvent, TState>(
        streamId: string,
        initialState: TState
    ): Promise<{
        events: EventRecord<TEvent>[];
        state: TState;
    }> {
        const storedState = this.snapshots.get(streamId) as StoredState<TState> | undefined;
        const events = this.streams.get(streamId) as EventRecord<TEvent>[] || [];

        if (!storedState) {
            return {
                events,
                state: initialState
            };
        }

        const eventsAfterSnapshot = events.filter(
            event => event.metadata.version > storedState.lastEventApplied
        );

        return {
            events: eventsAfterSnapshot,
            state: storedState.state
        };
    }

    async storeStateAsSnapshot<TState>(
        streamId: string,
        state: TState,
        lastEventApplied: number
    ): Promise<void> {
        this.snapshots.set(streamId, {
            state,
            lastEventApplied,
            timestamp: new Date()
        });
    }
}

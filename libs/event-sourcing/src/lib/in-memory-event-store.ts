import { EventStore, ConcurrencyError } from './event-store.js';
import { EventRecord } from './types.js';
import { EventStoreReadError, EventStoreWriteError } from './errors.js';

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
        expectedLatestVersion?: number
    ): Promise<void> {
        try {
            const currentEvents = this.streams.get(streamId) || [];
            const latestVersionStored = currentEvents.length > 0 
                ? currentEvents[currentEvents.length - 1].metadata.version 
                : 0;

            if (expectedLatestVersion !== undefined && expectedLatestVersion !== latestVersionStored) {
                throw new ConcurrencyError(streamId, expectedLatestVersion, latestVersionStored);
            }

            // Verify event versions are sequential
            for (const [index, event] of events.entries()) {
                const expectedEventVersion = latestVersionStored + index + 1;
                if (event.metadata.version !== expectedEventVersion) {
                    throw new EventStoreWriteError(streamId, new Error(
                        `Invalid event version. Expected ${expectedEventVersion}, got ${event.metadata.version}`
                    ));
                }
            }

            this.streams.set(streamId, [...currentEvents, ...events]);
        } catch (error) {
            if (error instanceof ConcurrencyError) {
                throw error;
            }
            if (error instanceof EventStoreWriteError) {
                throw error;
            }
            throw new EventStoreWriteError(streamId, error as Error);
        }
    }

    async readStream<TEvent, TState>(
        streamId: string,
        initialState: TState
    ): Promise<{
        events: EventRecord<TEvent>[];
        state: TState;
    }> {
        try {
            const storedState = this.snapshots.get(streamId) as StoredState<TState> | undefined;
            const events = this.streams.get(streamId) as EventRecord<TEvent>[] || [];

            if (!storedState) {
                return { events, state: initialState };
            }

            const eventsAfterSnapshot = events.filter(
                event => event.metadata.version > storedState.lastEventApplied
            );

            return {
                events: eventsAfterSnapshot,
                state: storedState.state
            };
        } catch (error) {
            throw new EventStoreReadError(streamId, error as Error);
        }
    }

    async storeStateAsSnapshot<TState>(
        streamId: string,
        state: TState,
        lastEventApplied: number
    ): Promise<void> {
        try {
            this.snapshots.set(streamId, {
                state,
                lastEventApplied,
                timestamp: new Date()
            });
        } catch (error) {
            throw new EventStoreWriteError(streamId, error as Error);
        }
    }
}

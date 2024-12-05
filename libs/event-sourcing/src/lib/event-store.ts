import { EventRecord } from './types';

/**
 * Interface for an event store implementation
 */
export interface EventStore {
    /**
     * Append events to a stream
     * @param streamId - ID of the event stream (aggregate/entity ID)
     * @param events - Events to append
     * @param expectedVersion - Optional expected version for optimistic concurrency
     * @throws {ConcurrencyError} If expectedVersion doesn't match current version
     */
    append<TEvent>(
        streamId: string,
        events: EventRecord<TEvent>[],
        expectedVersion?: number
    ): Promise<void>;

    /**
     * Read events from a stream with optional snapshot
     * @param streamId - ID of the event stream
     * @param initialState - Initial state to start reading from
     */
    readStream<TEvent, TState>(
        streamId: string,
        initialState: TState
    ): Promise<{
        events: EventRecord<TEvent>[];
        state: TState;
    }>;

    /**
     * Store a snapshot for a stream
     * @param streamId - ID of the event stream
     * @param snapshot - The snapshot data
     * @param version - Version of the stream this snapshot represents (last event version included)
     */
    storeStateAsSnapshot<TState>(
        streamId: string,
        state: TState,
        lastEventApplied: number
    ): Promise<void>;
}

/**
 * Error thrown when optimistic concurrency check fails
 */
export class ConcurrencyError extends Error {
    constructor(
        public readonly streamId: string,
        public readonly expectedVersion: number,
        public readonly actualVersion: number
    ) {
        super(
            `Concurrency error in stream ${streamId}: expected version ${expectedVersion}, got ${actualVersion}`
        );
        this.name = 'ConcurrencyError';
    }
}

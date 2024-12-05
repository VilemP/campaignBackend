import { EventRecord, Serializable, SnapshotRecord } from './types';

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
  append<T extends Serializable>(
    streamId: string,
    events: EventRecord<T>[],
    expectedVersion?: number
  ): Promise<void>;

  /**
   * Read events from a stream
   * @param streamId - ID of the event stream
   * @param fromVersion - Optional version to start reading from
   * @param toVersion - Optional version to read until
   * @returns Array of event records
   */
  readStream<T extends Serializable>(
    streamId: string,
    fromVersion?: number,
    toVersion?: number
  ): Promise<EventRecord<T>[]>;

  /**
   * Get the latest snapshot for a stream
   * @param streamId - ID of the event stream
   * @returns Latest snapshot record or null if none exists
   */
  getLatestSnapshot<T extends Serializable>(
    streamId: string
  ): Promise<SnapshotRecord<T> | null>;

  /**
   * Save a snapshot of aggregate state
   * @param streamId - ID of the event stream
   * @param snapshot - Snapshot record to save
   */
  saveSnapshot<T extends Serializable>(
    streamId: string,
    snapshot: SnapshotRecord<T>
  ): Promise<void>;

  /**
   * Delete all events and snapshots for a stream
   * @param streamId - ID of the event stream
   */
  deleteStream(streamId: string): Promise<void>;
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

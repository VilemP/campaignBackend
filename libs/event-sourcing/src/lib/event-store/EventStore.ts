import { EventRecord, Serializable, SnapshotRecord } from '../types';

/**
 * Interface for storing and retrieving events and snapshots
 */
export interface EventStore {
  /**
   * Save new events to a stream
   * @throws ConcurrencyError if expectedVersion doesn't match
   */
  saveEvents<T extends Serializable>(
    streamId: string,
    events: EventRecord<T>[],
    expectedVersion: number
  ): Promise<void>;

  /**
   * Get events from a stream starting from specific version
   */
  getEvents<T extends Serializable>(
    streamId: string,
    fromVersion?: number
  ): Promise<EventRecord<T>[]>;

  /**
   * Get the latest snapshot for a stream if it exists
   */
  getLatestSnapshot<T extends Serializable>(
    streamId: string
  ): Promise<SnapshotRecord<T> | null>;

  /**
   * Get the current version of a stream
   */
  getLastVersion(streamId: string): Promise<number>;
}

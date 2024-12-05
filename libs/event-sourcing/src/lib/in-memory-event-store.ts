import { EventStore, ConcurrencyError } from './event-store';
import { EventRecord, Serializable } from './types';

/**
 * In-memory implementation of EventStore for testing purposes.
 * Not suitable for production use.
 */
export class InMemoryEventStore implements EventStore {
  private streams = new Map<string, EventRecord<Serializable>[]>();

  async append<T extends Serializable>(
    streamId: string,
    events: EventRecord<T>[],
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
      if (event.version !== currentVersion + index) {
        throw new Error(
          `Invalid event version. Expected ${currentVersion + index}, got ${event.version}`
        );
      }
    });

    // Append events
    this.streams.set(streamId, [...currentEvents, ...events]);
  }

  async readStream<T extends Serializable>(
    streamId: string,
    fromVersion?: number,
    toVersion?: number
  ): Promise<EventRecord<T>[]> {
    const events = this.streams.get(streamId) || [];
    
    let result = events;
    
    if (fromVersion !== undefined) {
      result = result.filter(event => event.version >= fromVersion);
    }
    
    if (toVersion !== undefined) {
      result = result.filter(event => event.version <= toVersion);
    }
    
    return result as EventRecord<T>[];
  }
}

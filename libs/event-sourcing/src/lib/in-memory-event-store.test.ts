import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventStore } from './in-memory-event-store';
import { EventRecord, EventMetadata } from './types';
import { ConcurrencyError } from './event-store';

interface TestEvent {
  type: string;
  data: string;
}

function createEventRecord(streamId: string, version: number, data: string): EventRecord<TestEvent> {
  return {
    streamId,
    version,
    payload: { type: 'TEST', data },
    metadata: { timestamp: new Date() }
  };
}

describe('InMemoryEventStore', () => {
  let store: InMemoryEventStore;

  beforeEach(() => {
    store = new InMemoryEventStore();
  });

  describe('append', () => {
    it('should append events to an empty stream', async () => {
      const event = createEventRecord('stream-1', 0, 'test');
      await store.append('stream-1', [event]);

      const events = await store.readStream('stream-1');
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(event);
    });

    it('should append multiple events in sequence', async () => {
      const event1 = createEventRecord('stream-1', 0, 'test1');
      const event2 = createEventRecord('stream-1', 1, 'test2');

      await store.append('stream-1', [event1]);
      await store.append('stream-1', [event2]);

      const events = await store.readStream('stream-1');
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual(event1);
      expect(events[1]).toEqual(event2);
    });

    it('should enforce optimistic concurrency', async () => {
      const event1 = createEventRecord('stream-1', 0, 'test1');
      await store.append('stream-1', [event1]);

      const event2 = createEventRecord('stream-1', 1, 'test2');
      await expect(
        store.append('stream-1', [event2], 0)
      ).rejects.toThrow(ConcurrencyError);
    });

    it('should allow appending with correct expected version', async () => {
      const event1 = createEventRecord('stream-1', 0, 'test1');
      await store.append('stream-1', [event1]);

      const event2 = createEventRecord('stream-1', 1, 'test2');
      await expect(
        store.append('stream-1', [event2], 1)
      ).resolves.not.toThrow();
    });
  });

  describe('readStream', () => {
    beforeEach(async () => {
      await store.append('stream-1', [
        createEventRecord('stream-1', 0, 'test1'),
        createEventRecord('stream-1', 1, 'test2'),
        createEventRecord('stream-1', 2, 'test3')
      ]);
    });

    it('should read all events from a stream', async () => {
      const events = await store.readStream('stream-1');
      expect(events).toHaveLength(3);
      expect(events.map(e => e.payload.data)).toEqual(['test1', 'test2', 'test3']);
    });

    it('should return empty array for non-existent stream', async () => {
      const events = await store.readStream('non-existent');
      expect(events).toEqual([]);
    });

    it('should respect fromVersion parameter', async () => {
      const events = await store.readStream('stream-1', 1);
      expect(events).toHaveLength(2);
      expect(events.map(e => e.payload.data)).toEqual(['test2', 'test3']);
    });

    it('should respect toVersion parameter', async () => {
      const events = await store.readStream('stream-1', undefined, 1);
      expect(events).toHaveLength(2);
      expect(events.map(e => e.payload.data)).toEqual(['test1', 'test2']);
    });

    it('should handle version range correctly', async () => {
      const events = await store.readStream('stream-1', 1, 1);
      expect(events).toHaveLength(1);
      expect(events[0].payload.data).toBe('test2');
    });
  });
});

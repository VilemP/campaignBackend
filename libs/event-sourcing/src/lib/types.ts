/**
 * Marker interface that domain events must implement
 * to work with event sourcing system
 */
export interface Serializable {}

export interface EventMetadata {
  readonly correlationId?: string;  // For tracking related events
  readonly causationId?: string;    // For tracking event causation chain
  readonly userId?: string;         // Who caused the event
  readonly timestamp: Date;         // When the event was recorded
}

/**
 * A record in the event store, wrapping a domain event
 * with necessary technical metadata
 */
export interface EventRecord<T extends Serializable, P = unknown> {
  readonly streamId: string;      // Aggregate/Entity ID
  readonly version: number;       // Position in the stream
  readonly payload: P;           // The actual event payload
  readonly metadata: EventMetadata;
}

/**
 * Represents a snapshot of aggregate state at a specific version
 */
export interface SnapshotRecord<T extends Serializable, P = T> extends EventRecord<T, P> {}

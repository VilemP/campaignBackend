/**
 * Minimal interface that domain events must implement
 * to work with event sourcing system
 */
export interface Serializable {}

export interface EventMetadata {
  // Additional event metadata like:
  readonly correlationId?: string;  // For tracking related events
  readonly causationId?: string;    // For tracking event causation chain
  readonly userId?: string;         // Who caused the event
  readonly timestamp: Date;         // When the event was recorded
}

/**
 * A record in the event store, wrapping a domain event
 * with necessary technical metadata
 */
export interface EventRecord<T extends Serializable> {
  readonly streamId: string;      // Aggregate/Entity ID
  readonly version: number;       // Position in the stream
  readonly payload: T;           // The actual domain event
  readonly metadata: EventMetadata;
}

/**
 * Represents a snapshot of aggregate state at a specific version
 */
export interface SnapshotRecord<T extends Serializable> extends EventRecord<never> {
  readonly state: T;  // The complete state at this version
}

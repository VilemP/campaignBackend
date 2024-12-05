/**
 * Thrown when attempting to save events with incorrect expected version
 */
export class ConcurrencyError extends Error {
  constructor(
    readonly streamId: string,
    readonly expectedVersion: number,
    readonly actualVersion: number
  ) {
    super(
      `Concurrency violation when saving to stream ${streamId}. ` +
      `Expected version ${expectedVersion}, but current version is ${actualVersion}`
    );
    this.name = 'ConcurrencyError';
  }
}

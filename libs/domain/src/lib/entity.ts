/**
 * Base class for domain objects that have a unique identity.
 */
export abstract class Entity<TId> {
  constructor(private readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  equals(other: Entity<TId>): boolean {
    if (!(other instanceof Entity)) return false;
    return this._id === other._id;
  }
}

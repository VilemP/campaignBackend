import { InvalidIdError } from '@libs/errors';

interface HasUuid {
    uuid: string;
}

export abstract class EntityId implements HasUuid {
    constructor(readonly uuid: string) {
        if (!this.isValidUuid(uuid)) {
            throw new InvalidIdError(uuid);
        }
    }

    private isValidUuid(uuid: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
    }

    equals(other: EntityId): boolean {
        return other instanceof EntityId && other.uuid === this.uuid;
    }

    toString(): string {
        return this.uuid;
    }
} 
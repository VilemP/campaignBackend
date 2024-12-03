export class EntityNotFoundError extends Error {
    constructor(entityType: string, id: string) {
        super(`${entityType} with id ${id} not found`);
        this.name = 'EntityNotFoundError';
    }
}

export class ConcurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConcurrencyError';
    }
}
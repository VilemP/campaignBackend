export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly details: Array<{
            path: string;
            message: string;
        }>
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}
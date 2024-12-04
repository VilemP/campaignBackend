import { z } from 'zod';
import { ValidationError } from './errors';

export class Schema<T> {
    private constructor(private zodSchema: z.ZodType<T>) {}

    readonly type!: T;

    static string() {
        return new SchemaBuilder(z.string());
    }

    static number() {
        return new SchemaBuilder(z.number());
    }

    validate(value: unknown): T {
        try {
            return this.zodSchema.parse(value);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError(
                    'Validation failed',
                    error.errors.map(e => ({
                        path: e.path.join('.'),
                        message: e.message
                    }))
                );
            }
            throw error;
        }
    }
}
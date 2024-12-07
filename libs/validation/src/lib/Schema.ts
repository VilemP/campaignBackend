import { z } from 'zod';
import { IInputSchema, IOutputSchema } from './contracts.js';

export class ValidationError extends Error {
    constructor(message: string, public readonly errors: z.ZodError) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class InputSchema<T> implements IInputSchema<T> {
    constructor(private readonly zodSchema: z.ZodType<T>) {}
    
    readonly type!: T;
    
    validate(value: unknown): T {
        try {
            return this.zodSchema
                .transform((val: T) => {
                    if (typeof val === 'object' && val !== null && this.zodSchema instanceof z.ZodObject) {
                        const shape = this.zodSchema.shape;
                        const knownKeys = Object.keys(shape);
                        const result = Object.fromEntries(
                            Object.entries(val as Record<string, unknown>)
                                .filter(([key]) => knownKeys.includes(key))
                        );
                        return result as T;
                    }
                    return val;
                })
                .parse(value);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError('Input validation failed', error);
            }
            throw error;
        }
    }
}

export class OutputSchema<T> implements IOutputSchema<T> {
    constructor(private readonly zodSchema: z.ZodType<T>) {}
    
    readonly type!: T;
    
    validate(value: unknown): T {
        try {
            const result = this.zodSchema.safeParse(value);
            if (!result.success) {
                throw new ValidationError('Output validation failed', result.error);
            }
            return result.data;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error('Unexpected validation error');
        }
    }
}

export const Schema = {
    string() {
        return z.string();
    },
    
    number() {
        return z.number();
    },
    
    boolean() {
        return z.boolean();
    },
    
    enum<T extends [string, ...string[]]>(values: T) {
        return z.enum(values);
    },
    
    object<T extends z.ZodRawShape>(shape: T) {
        return z.object(shape);
    },
    
    array<T>(schema: z.ZodType<T>) {
        return z.array(schema);
    },
    
    input<T>(zodSchema: z.ZodType<T>): InputSchema<T> {
        return new InputSchema(zodSchema);
    },
    
    output<T>(zodSchema: z.ZodType<T>): OutputSchema<T> {
        return new OutputSchema(zodSchema);
    }
}; 
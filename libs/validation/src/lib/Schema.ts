import { z } from 'zod';

export class InputSchema<T> {
    constructor(private zodSchema: z.ZodType<T>) {}
    
    // For TypeScript type inference
    readonly type!: T;
    
    validate(value: unknown): T {
        return this.zodSchema
            .transform((val) => {
                if (typeof val === 'object' && val !== null) {
                    // Remove unknown properties
                    const knownKeys = Object.keys(this.zodSchema.shape || {});
                    return Object.fromEntries(
                        Object.entries(val).filter(([key]) => knownKeys.includes(key))
                    );
                }
                return val;
            })
            .parse(value, { 
                coerce: true,
                strict: false 
            });
    }
}

export class OutputSchema<T> {
    constructor(private zodSchema: z.ZodType<T>) {}
    
    readonly type!: T;
    
    validate(value: unknown): T {
        return this.zodSchema.parse(value, { 
            coerce: false,
            strict: true 
        });
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
    
    input<T>(zodSchema: z.ZodType<T>): InputSchema<T> {
        return new InputSchema(zodSchema);
    },
    
    output<T>(zodSchema: z.ZodType<T>): OutputSchema<T> {
        return new OutputSchema(zodSchema);
    }
}; 
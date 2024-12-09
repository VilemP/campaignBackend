import { z } from 'zod';

export class ValidationError extends Error {
    constructor(message: string, public readonly issues: ValidationIssue[]) {
        super(message);
        this.name = 'ValidationError';
    }
}

export interface ValidationIssue {
    path: (string | number)[];
    message: string;
}

export class SchemaType<T> {
    constructor(public readonly zodSchema: z.ZodType<T>) {}

    optional(): SchemaType<T | undefined> {
        return new SchemaType(this.zodSchema.optional());
    }

    nullable(): SchemaType<T | null> {
        return new SchemaType(this.zodSchema.nullable());
    }

    validate(value: unknown): T {
        try {
            return this.zodSchema.parse(value);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const issues = error.errors.map(err => ({
                    path: err.path,
                    message: err.message
                }));
                throw new ValidationError('Validation failed', issues);
            }
            throw error;
        }
    }
}

class StringSchema extends SchemaType<string> {
    constructor(schema: z.ZodString = z.string()) {
        super(schema);
    }

    min(length: number, message?: string): StringSchema {
        return new StringSchema(
            (this.zodSchema as z.ZodString).min(length, message)
        );
    }

    max(length: number, message?: string): StringSchema {
        return new StringSchema(
            (this.zodSchema as z.ZodString).max(length, message)
        );
    }

    email(message?: string): StringSchema {
        return new StringSchema(
            (this.zodSchema as z.ZodString).email(message)
        );
    }

    url(message?: string): StringSchema {
        return new StringSchema(
            (this.zodSchema as z.ZodString).url(message)
        );
    }
}

class NumberSchema extends SchemaType<number> {
    constructor(schema: z.ZodNumber = z.number()) {
        super(schema);
    }

    min(value: number, message?: string): NumberSchema {
        return new NumberSchema(
            (this.zodSchema as z.ZodNumber).min(value, message)
        );
    }

    max(value: number, message?: string): NumberSchema {
        return new NumberSchema(
            (this.zodSchema as z.ZodNumber).max(value, message)
        );
    }

    positive(message?: string): NumberSchema {
        return new NumberSchema(
            (this.zodSchema as z.ZodNumber).positive(message)
        );
    }

    int(message?: string): NumberSchema {
        return new NumberSchema(
            (this.zodSchema as z.ZodNumber).int(message)
        );
    }
}

export const Schema = {
    string(): StringSchema {
        return new StringSchema();
    },

    number(): NumberSchema {
        return new NumberSchema();
    },
    
    boolean(): SchemaType<boolean> {
        return new SchemaType(z.boolean());
    },
    
    nativeEnum<T extends z.EnumLike>(
        values: T
    ): SchemaType<T[keyof T]> {
        return new SchemaType(z.nativeEnum(values));
    },
    
    object<T extends Record<string, SchemaType<any>>>(shape: T): SchemaType<z.infer<z.ZodObject<{[K in keyof T]: T[K]['zodSchema']}, "strip", z.ZodTypeAny>>> {
        const zodShape = {} as { [K in keyof T]: z.ZodType<any> };
        for (const [key, value] of Object.entries(shape)) {
            zodShape[key as keyof T] = value.zodSchema;
        }
        return new SchemaType(z.object(zodShape));
    },

    array<T>(schema: SchemaType<T>): SchemaType<T[]> {
        return new SchemaType(z.array(schema.zodSchema));
    }
};

export type InferSchemaType<T> = T extends SchemaType<infer U> ? U : never;
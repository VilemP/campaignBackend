import { describe, it, expect } from 'vitest';
import { Schema, ValidationError, InferSchemaType } from './schema.js';
import { z } from 'zod';

enum TestEnum {
    A = 'A',
    B = 'B',
    C = 'C'
}

// Type compatibility tests
type TypeTest<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

describe('Schema type inference', () => {
    it('should match Zod type inference', () => {

        const simpleSchema = Schema.object({
            required: Schema.string(),
            optional: Schema.string().optional()
        });
        
        const simpleZodSchema = z.object({
            required: z.string(),
            optional: z.string().optional()
        });
        
        type SimpleOurType = InferSchemaType<typeof simpleSchema>;
        type SimpleZodType = z.infer<typeof simpleZodSchema>;
        
        // Log them to see the difference
        type Test = {
            our: SimpleOurType;
            zod: SimpleZodType;
        }








        const ourSchema = Schema.object({
            str: Schema.string(),
            num: Schema.number(),
            opt: Schema.string().optional(),
            enum: Schema.nativeEnum(TestEnum),
            nested: Schema.object({
                arr: Schema.array(Schema.string())
            })
        });

        const zodSchema = z.object({
            str: z.string(),
            num: z.number(),
            opt: z.string().optional(),
            enum: z.nativeEnum(TestEnum),
            nested: z.object({
                arr: z.array(z.string())
            })
        });

        type OurType = InferSchemaType<typeof ourSchema>;
        type ZodType = z.infer<typeof zodSchema>;

        // This will fail compilation if types don't match
        type TypesMatch = TypeTest<Equal<OurType, ZodType>>;
    });
});

describe('Schema', () => {
    describe('string()', () => {
        it('should validate strings', () => {
            const schema = Schema.string();
            expect(schema.validate('test')).toBe('test');
            expect(() => schema.validate(123)).toThrow(ValidationError);
        });

        it('should handle optional strings', () => {
            const schema = Schema.string().optional();
            expect(schema.validate('test')).toBe('test');
            expect(schema.validate(undefined)).toBe(undefined);
        });

        it('should validate string length', () => {
            const schema = Schema.string().min(2).max(4);
            expect(schema.validate('test')).toBe('test');
            expect(() => schema.validate('a')).toThrow(ValidationError);
            expect(() => schema.validate('toolong')).toThrow(ValidationError);
        });

        it('should validate email', () => {
            const schema = Schema.string().email();
            expect(schema.validate('test@example.com')).toBe('test@example.com');
            expect(() => schema.validate('invalid')).toThrow(ValidationError);
        });

        it('should validate url', () => {
            const schema = Schema.string().url();
            expect(schema.validate('https://example.com')).toBe('https://example.com');
            expect(() => schema.validate('invalid')).toThrow(ValidationError);
        });
    });

    describe('number()', () => {
        it('should validate numbers', () => {
            const schema = Schema.number();
            expect(schema.validate(123)).toBe(123);
            expect(() => schema.validate('123')).toThrow(ValidationError);
        });

        it('should validate number range', () => {
            const schema = Schema.number().min(2).max(4);
            expect(schema.validate(3)).toBe(3);
            expect(() => schema.validate(1)).toThrow(ValidationError);
            expect(() => schema.validate(5)).toThrow(ValidationError);
        });

        it('should validate integers', () => {
            const schema = Schema.number().int();
            expect(schema.validate(123)).toBe(123);
            expect(() => schema.validate(123.45)).toThrow(ValidationError);
        });

        it('should validate positive numbers', () => {
            const schema = Schema.number().positive();
            expect(schema.validate(123)).toBe(123);
            expect(() => schema.validate(-123)).toThrow(ValidationError);
        });
    });

    describe('nativeEnum()', () => {
        it('should validate enum values', () => {
            const schema = Schema.nativeEnum(TestEnum);
            expect(schema.validate(TestEnum.A)).toBe(TestEnum.A);
            expect(() => schema.validate('D')).toThrow(ValidationError);
        });

        it('should handle optional enums', () => {
            const schema = Schema.nativeEnum(TestEnum).optional();
            expect(schema.validate(TestEnum.B)).toBe(TestEnum.B);
            expect(schema.validate(undefined)).toBe(undefined);
        });
    });

    describe('object()', () => {
        it('should validate objects', () => {
            const schema = Schema.object({
                name: Schema.string(),
                age: Schema.number()
            });

            expect(schema.validate({ name: 'test', age: 25 }))
                .toEqual({ name: 'test', age: 25 });

            expect(() => schema.validate({ name: 'test' }))
                .toThrow(ValidationError);
        });

        it('should handle optional object properties', () => {
            const schema = Schema.object({
                name: Schema.string(),
                age: Schema.number().optional()
            });

            expect(schema.validate({ name: 'test' }))
                .toEqual({ name: 'test' });

            expect(schema.validate({ name: 'test', age: 25 }))
                .toEqual({ name: 'test', age: 25 });
        });

        it('should handle nested objects', () => {
            const schema = Schema.object({
                user: Schema.object({
                    name: Schema.string()
                })
            });

            expect(schema.validate({ user: { name: 'test' } }))
                .toEqual({ user: { name: 'test' } });

            expect(() => schema.validate({ user: {} }))
                .toThrow(ValidationError);
        });
    });

    describe('array()', () => {
        it('should validate array of strings', () => {
            const schema = Schema.array(Schema.string());
            expect(schema.validate(['a', 'b'])).toEqual(['a', 'b']);
            expect(() => schema.validate(['a', 123])).toThrow(ValidationError);
        });

        it('should validate array of objects', () => {
            const schema = Schema.array(
                Schema.object({
                    name: Schema.string()
                })
            );

            expect(schema.validate([{ name: 'test' }]))
                .toEqual([{ name: 'test' }]);

            expect(() => schema.validate([{ name: 123 }]))
                .toThrow(ValidationError);
        });
    });
}); 
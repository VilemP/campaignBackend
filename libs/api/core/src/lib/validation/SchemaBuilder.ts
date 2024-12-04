import { z } from 'zod';

export class SchemaBuilder {
    // String builders
    static string() {
        return z.string();
    }

    static uuid() {
        return z.string().uuid();
    }

    static email() {
        return z.string().email();
    }

    // Number builders
    static number() {
        return z.number();
    }

    static integer() {
        return z.number().int();
    }

    // Boolean
    static boolean() {
        return z.boolean();
    }

    // Object and array builders
    static object<T extends z.ZodRawShape>(shape: T) {
        return z.object(shape);
    }

    static array<T extends z.ZodTypeAny>(type: T) {
        return z.array(type);
    }

    // Enum
    static enum<T extends [string, ...string[]]>(values: T) {
        return z.enum(values);
    }

    // Date
    static date() {
        return z.date();
    }

    // Nullable and optional
    static nullable<T extends z.ZodTypeAny>(type: T) {
        return type.nullable();
    }

    static optional<T extends z.ZodTypeAny>(type: T) {
        return type.optional();
    }
}
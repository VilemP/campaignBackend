import { ValidationError } from './schema';

export interface ValidationResult<T> {
    success: boolean;
    value?: T;
    errors?: ValidationError[];
}

export interface Validator<T> {
    validate(value: unknown): T;
}

export interface IInputSchema<T> extends Validator<T> {
    type: T;
}

export interface IOutputSchema<T> extends Validator<T> {
    type: T;
} 
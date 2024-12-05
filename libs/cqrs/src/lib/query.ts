/**
 * Represents a query that retrieves data from the system.
 * Part of the Command Query Responsibility Segregation (CQRS) pattern.
 */
export interface Query<TResult> {
    execute(): Promise<TResult>;
} 
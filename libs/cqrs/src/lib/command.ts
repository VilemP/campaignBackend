/**
 * Represents a command that can be executed to change the system's state.
 * Part of the Command Query Responsibility Segregation (CQRS) pattern.
 */
export interface Command {
    execute(): Promise<void>;
} 
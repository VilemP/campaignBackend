/**
 * Represents a command that can be executed to change the system's state
 */
export interface Command {
    execute(): Promise<void>;
} 
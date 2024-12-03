export interface Command {
    execute(): Promise<void>;
}

export interface Query<TResult> {
    execute(): Promise<TResult>;
}
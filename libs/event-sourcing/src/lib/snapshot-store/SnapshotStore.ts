export interface Snapshot<T> {
    state: T;
    version: number;
}

export interface SnapshotStore {
    saveSnapshot<T>(streamId: string, state: T, version: number): Promise<void>;
    getLatestSnapshot<T>(streamId: string): Promise<Snapshot<T> | null>;
}
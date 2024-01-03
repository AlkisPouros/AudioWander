class RecordingsCollection {

    private data = new Map<number, string>();
    private count = 0;

    private static copy(other: RecordingsCollection) {
        let newThis = new RecordingsCollection();

        newThis.data = other.data;
        newThis.count = other.count;

        return newThis;
    }

    public get size(): number { return this.data.size; }

    public get(index: number): string {
        let recording = this.data.get(index);

        if (!recording) {
            throw new Error(`Recording ${index} not found`);
        }

        return recording
    }

    public add(recording: string): RecordingsCollection {
        this.count++;
        this.data.set(this.count, recording);
        return RecordingsCollection.copy(this);
    }

    public delete(index: number): RecordingsCollection {
        let success = this.data.delete(index);

        if (!success) {
            throw new Error(`Recording ${index} not found to delete`);
        }

        return RecordingsCollection.copy(this);
    }

    public mapRecordings<T>(fn: (index: number, recording: string) => T): T[] {
        const array: T[] = [];

        this.data.forEach((recording, index) => {
            array.push(fn(index, recording));
        });

        return array;
    }
}

export { RecordingsCollection };

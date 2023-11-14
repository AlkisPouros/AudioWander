class Instrument {

    constructor(
        public readonly id: number,
        public readonly displayName: string,
    ) { }

    play() {
        console.log(`Playing instrument ${this.displayName}`);
    }
}

const INSTRUMENTS = new Map<number, Instrument>([
    [1, new Instrument(1, "Instrument 1")],
    [2, new Instrument(2, "Instrument 2")],
    [3, new Instrument(3, "Instrument 3")],
]);

export { Instrument, INSTRUMENTS };

class Beat {
    constructor(
        readonly bar: number,
        readonly beat: number,
        readonly subdivision: number
    ) {}
}

class Loop {

    private beats_per_minute!: number;

    private bar_count!: number
    private beat_count!: number
    private subdivisison_count!: number

    constructor(bpm: number, bars: number, beats: number, subdivisions: number = 1) {
        // call the setter for each private field to perform error checking
        this.bpm = bpm;
        this.bars = bars;
        this.beats = beats;
        this.subdivisions = subdivisions;
    }

    toTick(beat: Beat): number {
        // beat is 1-indexed, return value (tick) is 0-indexed
        return this.beats * (beat.bar - 1) + this.subdivisions * (beat.beat - 1)
            + beat.subdivision - 1;
    }

    toBeat(tick: number): Beat {
        // tick is 0-indexed, return value (beat) is 1-indexed

        // https://stackoverflow.com/questions/4228356/how-to-perform-an-integer-division-and-separately-get-the-remainder-in-javascr#answer-44079852
        let subdivision = tick % this.subdivisions;
        tick = (tick - subdivision) / this.subdivisions;

        let beat = tick % this.beats;
        tick = (tick - beat) / this.beats;

        let bar = tick % this.bars;
        return new Beat(bar + 1, beat + 1, subdivision + 1);
    }

    get tickCount(): number {
        return this.bars * this.beats * this.subdivisions;
    }

    // vvv boilerplate getters and setters vvv

    get bpm(): number { return this.beats_per_minute; }

    set bpm(value: number) {
        if (!Loop.Constraints.checkBpm(value)) {
            throw new Error("Invalid BPM");
        }

        this.beats_per_minute = value;
    }

    get bars(): number { return this.bar_count; }

    set bars(value: number) {
        if (!Loop.Constraints.checkBars(value)) {
            throw new Error("Invalid number of bars");
        }

        this.bar_count = value;
    }

    get beats(): number { return this.beat_count; }

    set beats(value: number) {
        if (!Loop.Constraints.checkBeats(value)) {
            throw new Error("Invalid number of beats");
        }

        this.beat_count = value;
    }

    get subdivisions(): number { return this.subdivisison_count; }

    set subdivisions(value: number) {
        if (!Loop.Constraints.checkSubdivisions(value)) {
            throw new Error("Invalid number of subdivisions");
        }

        this.subdivisison_count = value;
    }

    static Constraints = new class {

        // constraints are arbitrary, subject to change in the future as a
        // result of extensive user testing and feedback

        // ensure that min delay = 10ms (sort of browser limit for setTimeout)
        // -> max_bpm = 100 bps = 6000 bpm
        // -> max_bpm * maxsubdivisison_count <= 6000

        readonly MIN_BPM = 1;
        readonly MAX_BPM = 200;

        readonly MIN_BAR_COUNT = 1;
        readonly MAX_BAR_COUNT = 4;

        readonly MIN_BEAT_COUNT = 1;
        readonly MAX_BEAT_COUNT = 4;

        readonly MIN_SUBDIVISION_COUNT = 1;
        readonly MAX_SUBDIVISION_COUNT = 3;

        checkBpm(bpm: number): boolean {
            return bpm >= Loop.Constraints.MIN_BPM
                && bpm <= Loop.Constraints.MAX_BPM;
        }

        checkBars(bars: number): boolean {
            return bars >= Loop.Constraints.MIN_BAR_COUNT
                && bars <= Loop.Constraints.MAX_BAR_COUNT;
        }

        checkBeats(beats: number): boolean {
            return beats >= Loop.Constraints.MIN_BEAT_COUNT
                && beats <= Loop.Constraints.MAX_BEAT_COUNT;
        }

        checkSubdivisions(subdivisions: number): boolean {
            return subdivisions >= Loop.Constraints.MIN_SUBDIVISION_COUNT
                && subdivisions <= Loop.Constraints.MAX_SUBDIVISION_COUNT;
        }
    }
}

export { Beat, Loop };

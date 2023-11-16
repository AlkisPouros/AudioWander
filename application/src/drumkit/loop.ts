/**
 * @fileoverview Defines the {@link Beat} and {@link LoopMetadata} classes, which work
 * together to fully define a drump loop and a singular moment in that loop.
 */

import { INSTRUMENTS, Instrument } from "./instrument";

/**
 * Dataclass for a Beat, a moment inside a drump loop. Each Beat is identified
 * by its bar number, its beat in the bar, and the subdivision of the beat. All
 * fields are 1-indexed meaning that bar 1 is the first bar.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class Beat {
    constructor(
        readonly bar: number,
        readonly beat: number,
        readonly subdivision: number
    ) {}
}

/**
 * Encapsulates the time information of drump loop. A loop is defined by its
 * speed (bpm) and the number of bars, beats and subdivisions thereof. Time
 * passes in ticks (one subdivision) and can be converted to meaningful and
 * rich Beat information, and vice versa.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class LoopMetadata {

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

    /**
     * Converts the given Beat to its corresponding tick in this drump loop.
     * The tick is 0-indexed, meaning that Beat(1, 1, 1) corresponds to tick 1.
     *
     * A tick counts how many subdivisions have passed since the loop's
     * beginning. For example, a loop with 4 bars, 3 beats and 2 subdivisions
     * has a total of 4 * 3 * 2 = 24 ticks.
     *
     * @param {Beat} beat the Beat to convert
     * @returns {number} the tick the beat corresponds to in this drump loop
     *
     * @see {@link Beat}
     *
     * @since v0.0.1
     */
    toTick(beat: Beat): number {
        // beat is 1-indexed, return value (tick) is 0-indexed
        return this.beats * (beat.bar - 1) + this.subdivisions * (beat.beat - 1)
            + beat.subdivision - 1;
    }

    /**
     * Converts the given tick to its corresponding Beat in this drump loop.
     * The Beat is 1-indexed, meaning that tick 0 corresponds to Beat(1, 1, 1).
     *
     * The Beat contains rich information about the position of the music
     * inside the loop.
     *
     * @param {number} tick the tick to convert
     * @returns {Beat} the beat the tick corresponds to in this drump loop
     *
     * @see {@link Beat}
     *
     * @since v0.0.1
     */
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
        if (!LoopMetadata.Constraints.checkBpm(value)) {
            throw new Error("Invalid BPM");
        }

        this.beats_per_minute = value;
    }

    get bars(): number { return this.bar_count; }

    set bars(value: number) {
        if (!LoopMetadata.Constraints.checkBars(value)) {
            throw new Error("Invalid number of bars");
        }

        this.bar_count = value;
    }

    get beats(): number { return this.beat_count; }

    set beats(value: number) {
        if (!LoopMetadata.Constraints.checkBeats(value)) {
            throw new Error("Invalid number of beats");
        }

        this.beat_count = value;
    }

    get subdivisions(): number { return this.subdivisison_count; }

    set subdivisions(value: number) {
        if (!LoopMetadata.Constraints.checkSubdivisions(value)) {
            throw new Error("Invalid number of subdivisions");
        }

        this.subdivisison_count = value;
    }

    /**
     * Defines constraints for the Loop's fields, and provides methods to
     * easily check whether value given is within said constraints.
     *
     * @author Alex Mandelias
     *
     * @since v0.0.1
     */
    static Constraints = new class {

        // constraints are arbitrary, subject to change in the future as a
        // result of extensive user testing and feedback

        // ensure that min delay = 10ms (sort of browser limit for setTimeout)
        // -> max_bpm = 100 bps = 6000 bpm
        // -> max_bpm * maxsubdivisison_count <= 6000

        /**
         * Minimum BPM
         *
         * @since v0.0.1
         */
        readonly MIN_BPM = 1;

        /**
         * Maximum BPM
         *
         * @since v0.0.1
         */
        readonly MAX_BPM = 200;

        /**
         * Minimum bar count
         *
         * @since v0.0.1
         */
        readonly MIN_BAR_COUNT = 1;

        /**
         * Maximum bar count
         *
         * @since v0.0.1
         */
        readonly MAX_BAR_COUNT = 4;

        /**
         * Minimum beat count
         *
         * @since v0.0.1
         */
        readonly MIN_BEAT_COUNT = 1;

        /**
         * Maximum beat count
         *
         * @since v0.0.1
         */
        readonly MAX_BEAT_COUNT = 4;

        /**
         * Minimum subdivision count
         *
         * @since v0.0.1
         */
        readonly MIN_SUBDIVISION_COUNT = 1;

        /**
         * Maximum subdivision count
         *
         * @since v0.0.1
         */
        readonly MAX_SUBDIVISION_COUNT = 3;

        /**
         * Checks whether the given BPM is within the constraints of this class.
         *
         * @since v0.0.1
         */
        checkBpm(bpm: number): boolean {
            return bpm >= LoopMetadata.Constraints.MIN_BPM
                && bpm <= LoopMetadata.Constraints.MAX_BPM;
        }

        /**
         * Checks whether the given bar count is within the constraints of this
         * class.
         *
         * @since v0.0.1
         */
        checkBars(bars: number): boolean {
            return bars >= LoopMetadata.Constraints.MIN_BAR_COUNT
                && bars <= LoopMetadata.Constraints.MAX_BAR_COUNT;
        }

        /**
         * Checks whether the given beat count is within the constraints of
         * this class.
         *
         * @since v0.0.1
         */
        checkBeats(beats: number): boolean {
            return beats >= LoopMetadata.Constraints.MIN_BEAT_COUNT
                && beats <= LoopMetadata.Constraints.MAX_BEAT_COUNT;
        }

        /**
         * Checks whether the given subdivision count is within the constraints
         * of this class.
         *
         * @since v0.0.1
         */
        checkSubdivisions(subdivisions: number): boolean {
            return subdivisions >= LoopMetadata.Constraints.MIN_SUBDIVISION_COUNT
                && subdivisions <= LoopMetadata.Constraints.MAX_SUBDIVISION_COUNT;
        }
    }
}

/**
 * Encapsulates the data and the functionality of a drum kit. The data consists
 * of information about whether each instrument will play each tick. This data
 * is then used to play the drumkit, as defiend by the loop.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.3
 */
class Loop {

    // map: instrument id -> array of length `tickCount`, one vlaue for each tick
    readonly data: Map<number, Array<number>> = new Map();

    constructor(
        readonly metadata: LoopMetadata
    ) {
        INSTRUMENTS.forEach((_, id) => {
            let ticks = Array(this.metadata.tickCount).fill(0);
            this.data.set(id, ticks);
        })
    }

    set(instrumentId: number, beat: Beat, value: number) {
        let tick = this.metadata.toTick(beat);
        this.data.get(instrumentId)![tick] = value;
    }
}

export { Beat, LoopMetadata, Loop };

/**
 * @fileoverview Defines the {@link Beat} and {@link LoopMetadata} classes, which work
 * together to fully define a drump loop and a singular moment in that loop.
 */

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

    private static cache = new Map<string, Beat>();

    private static getKey(bar: number, beat: number, subdivision: number) {
        return `${bar}#${beat}#${subdivision}`;
    }

    /**
     * Creates an instance of the Beat class. Creating two Beat instances with
     * the same bar, beat and subdivision properties will return the same Beat
     * object (`===` operator will return `true`).
     *
     * @param {number} bar the bar number in the meter
     * @param {number} beat the beat number in the bar
     * @param {number} subdivision the subdivision number in the beat
     *
     * @since v0.0.1
     */
    static from(bar: number, beat: number, subdivision: number) {
        let key = Beat.getKey(bar, beat, subdivision);
        let cachedBeatExists = Beat.cache.has(key);

        if (!cachedBeatExists) {
            Beat.cache.set(key, new Beat(bar, beat, subdivision));
        }

        return Beat.cache.get(key)!;
    }

    private constructor(
        readonly bar: number,
        readonly beat: number,
        readonly subdivision: number
    ) {}
}

/**
 * Encapsulates the metadata of drump loop. A loop is defined by its speed
 * (bpm) and the number of bars, beats and subdivisions thereof. Time passes in
 * ticks (one subdivision) and can be converted to and from meaningful and rich
 * Beat information.
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

    /**
     * Creates an instance of the LoopMetadata class. The setters of each field
     * are called in the constructor, ensuring that they are all within the
     * constraints of this class.
     *
     * @param {number} bpm the speed of the loop in beats per minute
     * @param {number} bars the bar count of the loop
     * @param {number} beats the beat count of each bar
     * @param {number} [subdivisions=1] the subdivision count of each beat
     *
     * @see {@link LoopMetadata.Constraints}
     *
     * @since v0.0.1
     */
    constructor(bpm: number, bars: number, beats: number, subdivisions: number = 1) {
        // call the setter for each private field to perform error checking
        this.bpm = bpm;
        this.bars = bars;
        this.beats = beats;
        this.subdivisions = subdivisions;
    }

    /**
     * Converts the given Beat to its corresponding tick in the context of a
     * loop with this metadata. The tick is 0-indexed, meaning that
     * Beat(1, 1, 1) corresponds to tick 0.
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
        return (this.beats * this.subdivisions) * (beat.bar - 1) + this.subdivisions * (beat.beat - 1)
            + beat.subdivision - 1;
    }

    /**
     * Converts the given tick to its corresponding Beat in the context of a
     * loop with this metadata. The Beat is 1-indexed, meaning that tick 0
     * corresponds to Beat(1, 1, 1).
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
        return Beat.from(bar + 1, beat + 1, subdivision + 1);
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
     * Copy constructor in the form of a static factory method.
     *
     * @param other the LoopMetadata object to copy
     *
     * @returns a copy of the given LoopMetadata object
     *
     * @since v0.0.9
     */
    private static from(other: LoopMetadata) {
        return new LoopMetadata(other.bpm, other.bars, other.beats, other.subdivisions);
    }

    /**
     * Returns a new LoopMetadata object, which is a copy of this object but
     * its bpm is set to the given value.
     *
     * @param {number} value the new value for the bpm
     *
     * @returns {LoopMetadata} the new LoopMetadata object
     *
     * @since v0.0.9
     */
    copySetBpm(value: number) {
        let copy = LoopMetadata.from(this);
        copy.bpm = value;
        return copy;
    }

    /**
     * Returns a new LoopMetadata object, which is a copy of this object but
     * its bar count is set to the given value.
     *
     * @param {number} value the new value for the bar count
     *
     * @returns {LoopMetadata} the new LoopMetadata object
     *
     * @since v0.0.9
     */
    copySetBars(value: number) {
        let copy = LoopMetadata.from(this);
        copy.bars = value;
        return copy;
    }

    /**
     * Returns a new LoopMetadata object, which is a copy of this object but
     * its beat count is set to the given value.
     *
     * @param {number} value the new value for the beat count
     *
     * @returns {LoopMetadata} the new LoopMetadata object
     *
     * @since v0.0.9
     */
    copySetBeats(value: number) {
        let copy = LoopMetadata.from(this);
        copy.beats = value;
        return copy;
    }

    /**
     * Returns a new LoopMetadata object, which is a copy of this object but
     * its subdivision count is set to the given value.
     *
     * @param {number} value the new value for the subdivision count
     *
     * @returns {LoopMetadata} the new LoopMetadata objec
     *
     * @since v0.0.9
     */
    copySetSubdivisions(value: number) {
        let copy = LoopMetadata.from(this);
        copy.subdivisions = value;
        return copy;
    }

    /**
     * Defines constraints for the metadata fields, and provides methods to
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
        readonly MAX_BPM = 300;

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
        readonly MAX_BAR_COUNT = 8;

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
        readonly MAX_BEAT_COUNT = 12;

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
        readonly MAX_SUBDIVISION_COUNT = 8;

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
    }();
}

export { Beat, LoopMetadata };

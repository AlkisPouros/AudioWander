/**
 * @fileoverview Defines the {@link Instrument} class, which encapsulates the
 * a musical instrument which can be used to play a sound. A number of preset
 * instruments are defined in the {@link INSTRUMENTS} constant.
 */

/**
 * Defines a musical instrument which can be used to play a sound.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class Instrument {

    constructor(
        public readonly id: number,
        public readonly displayName: string,
    ) { }

    play() {
        console.log(`Playing instrument ${this.displayName}`);
    }
}

/**
 * Map for built-in instruments.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
const INSTRUMENTS = new Map<number, Instrument>([
    [1, new Instrument(1, "Instrument 1")],
    [2, new Instrument(2, "Instrument 2")],
    [3, new Instrument(3, "Instrument 3")],
]);

export { Instrument, INSTRUMENTS };

/**
 * @fileoverview Defines the {@link Player} class, which encapsulates the logic
 * required for a drumkit to function and play the instruments at the correct
 * moments in time according to some data and metadata.
 */

import { LoopMetadata } from './loop'

/**
 * Defines the player class which is responsible for playing the drumkit's
 * data in the context of the loop defined by the drumkit. Playing the
 * instrument is done via the provided callback, so no extra information is
 * needed for this class to function.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class Player {

    /**
     * Creates an instance of the Player class which plays the instruments in
     * the mutable data, as described by the metadata.
     *
     * @param {LoopMetadata} metadata the metadata used to determine the speed
     * at which to advance to the next tick of the data
     * @param {Map<number, Array<number>>} data the data which described which
     * instruments plays at which tick
     * @param {(instrumentId: number, value: number) => void} onPlay the
     * callback function to call when an instrument should be played
     *
     * @since v0.0.1
     */
    constructor(
        private readonly metadata: LoopMetadata,
        private readonly data: Map<number, Array<number>>,
        private readonly onPlay: (instrumentId: number, value: number) => void,
    ) { }

    private currentTick: number = 0;
    private nextTimeout?: NodeJS.Timeout;

    /**
     * Starts this player. If the player was already playing, it is first
     * stopped then started again.
     *
     * @since v0.0.1
     */
    start() {
        this.stop();
        this.nextTimeout = setTimeout(this.tick.bind(this));
    }

    /**
     * Stops this player. If the player was already stopped this method has no
     * effect.
     *
     * @since v0.0.1
     */
    stop() {
        this.currentTick = 0;
        if (this.nextTimeout) {
            clearTimeout(this.nextTimeout);
        }
    }

    private tick() {
        // TODO: maybe refactor loop outside of tick(),
        // and player just needs the loop?
        // maybe not, get each it tick because it might change dynamically?

        let time = this.currentTick % this.metadata.tickCount;
        this.data.forEach((array, id) => {
            let value = array[time];
            this.onPlay(id, value);
        });

        // advance tick counter for next timeout
        this.currentTick++;

        // set timeout for next tick of the loop
        let secondsPerBeat = (1 / this.metadata.bpm) * 60;
        let msPerSubdivision = (secondsPerBeat / this.metadata.subdivisions) * 1000;
        this.nextTimeout = setTimeout(this.tick.bind(this), msPerSubdivision);
    }
}

export { Player };

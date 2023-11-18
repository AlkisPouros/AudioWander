/**
 * @fileoverview Defines the {@link DrumkitLogic} class, which encapsulates the
 * logic required for a drumkit to function, which includes
 */

import { INSTRUMENTS } from './instrument'
import { Loop } from './loop'

/**
 * Defines the player class which is responsible for playing the drumkit's
 * data in the context of the loop defined by the drumkit.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
class Player {

    constructor(
        private readonly loop: Loop
    ) { }

    private currentTick: number = 0;
    private nextTimeout?: NodeJS.Timeout;

    start() {
        this.stop();
        this.nextTimeout = setTimeout(this.tick.bind(this));
    }

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
        let { metadata, data } = this.loop;

        let time = this.currentTick % metadata.tickCount;
        data.forEach((array, id) => {
            let value = array[time];

            if (value === 1) {
                INSTRUMENTS.get(id)!.play();
            }
        });

        // advance tick counter for next timeout
        this.currentTick++;

        // set timeout for next tick of the loop
        let secondsPerBeat = (1 / metadata.bpm) * 60;
        let msPerSubdivision = (secondsPerBeat / metadata.subdivisions) * 1000;
        this.nextTimeout = setTimeout(this.tick.bind(this), msPerSubdivision);
    }
}

export { Player };

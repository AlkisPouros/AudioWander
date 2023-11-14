/**
 * @fileoverview Defines the {@link DrumkitLogic} class, which encapsulates the
 * logic required for a drumkit to function, which includes
 */

import { INSTRUMENTS } from './instrument'
import { Beat, Loop } from './loop'

/**
 * Encapsulates the data and the functionality of a drum kit. The data consists
 * of information about whether each instrument will play each tick. This data
 * is then used to play the drumkit, as defiend by the loop.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.1
 */
class DrumkitLogic {

    readonly loop: Loop;

    // map: instrument id -> array of length `tickCount`, one vlaue for each tick
    private readonly data: Map<number, Array<number>>;

    constructor(loop: Loop) {
        this.loop = loop;
        this.data = new Map(Array.from(INSTRUMENTS.keys()).map(
            (id) => [id, Array.from({ length: this.loop.tickCount }, () => 0)]
        ));
    }

    start() {
        this.player.start();
    }

    stop() {
        this.player.stop();
    }

    set(instrumentId: number, beat: Beat, value: number) {
        let tick = this.loop.toTick(beat);
        this.data.get(instrumentId)![tick] = value;
    }

    /**
     * Defines the player class which is responsible for playing the drumkit's
     * data in the context of the loop defined by the drumkit.
     *
     * @author Alex Mandelias
     *
     * @since v0.0.1
     */
    private readonly player = new class {

        constructor(
            private readonly drumkit: DrumkitLogic
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

        tick() {
            // TODO: maybe refactor loop outside of tick(),
            // and player just needs the loop?
            // maybe not, get each it tick because it might change dynamically?
            let { loop, data } = this.drumkit;

            let time = this.currentTick % loop.tickCount;
            data.forEach((array, id) => {
                let value = array[time];

                if (value === 1) {
                    INSTRUMENTS.get(id)!.play();
                }
            });

            // advance tick counter for next timeout
            this.currentTick++;

            // set timeout for next tick of the loop
            let secondsPerBeat = (1 / loop.bpm) * 60;
            let msPerSubdivision = (secondsPerBeat / loop.subdivisions) * 1000;
            this.nextTimeout = setTimeout(this.tick.bind(this), msPerSubdivision);
        }
    }(this);
}

export { DrumkitLogic };

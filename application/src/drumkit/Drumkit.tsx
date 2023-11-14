/**
 * @fileoverview Defines the Drumkit component which just runs some hardcoded
 * data in a loop for a few seconds.
 */

import { DrumkitLogic } from './drumkit-logic'
import { Beat, Loop } from './loop';

/**
 * Defines the Drumkit component which consists of a button which, when
 * clicked, runs some hardcoded drumkit data in a loop for a few seconds.
 *
 * @author Alex Mandelias
 *
 * @sinve v0.0.1
 */
function Drumkit() {
    return (
        <button onClick={start}>Click to start (open the console to see results (F12))</button>
    );
}

function start() {
    const dk = new DrumkitLogic(new Loop(120, 2, 3));

    // [0].forEach(i => this.data.get(1)![i] = 1);
    dk.set(1, new Beat(1, 1, 1), 1);

    // [3].forEach(i => dk.data.get(2)![i] = 1);
    dk.set(2, new Beat(2, 1, 1), 1);

    // [1, 2, 4, 5].forEach(i => dk.data.get(3)![i] = 1);
    dk.set(3, new Beat(1, 2, 1), 1);
    dk.set(3, new Beat(1, 3, 1), 1);
    dk.set(3, new Beat(2, 2, 1), 1);
    dk.set(3, new Beat(2, 3, 1), 1);

    dk.start();
    setTimeout(() => dk.stop(), 10 * 1000)
}

export { Drumkit };

/**
 * @fileoverview Defines the Drumkit component which just runs some hardcoded
 * data in a loop for a few seconds.
 */

import React from 'react';
import { DrumkitLogic } from './drumkit-logic'
import { Loop } from './loop';
import { INSTRUMENTS, Instrument } from './instrument';

/**
 * Defines the Drumkit component which consists of a button which, when
 * clicked, runs some hardcoded drumkit data in a loop for a few seconds.
 *
 * @author Alex Mandelias
 *
 * @sinve v0.0.1
 */
function Drumkit() {

    let loop = new Loop(120, 2, 3, 1);

    const dk = new DrumkitLogic(loop);

    const start = () => {
        dk.start();
    }

    const stop = () => {
        dk.stop();
    }

    return (
        <div>
            <button onClick={start}>Click to start</button>
            <button onClick={stop}>Click to stop</button>
            <p>Open the console to see results (F12)</p>
            <DrumkitGrid
                dk={dk}
                instruments={INSTRUMENTS}
            />
        </div>
    );
}

/**
 * Defines the props for the DrumkitGrid component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
type DrumkitGridProps = {

    /**
     * The DrumkitLogic instance which holds the loop data.
     *
     * @since v0.0.2
     */
    dk: DrumkitLogic;

    /**
     * The instrument map used to construct the grid.
     *
     * @since v0.0.2
     */
    instruments: Map<number, Instrument>;
}

/**
 * Represents the whole Drumkit Grid component. It consists of one Drumkit Row
 * component for every instrument.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 *
 * @see {@link DrumkitGridProps}
 */
function DrumkitGrid({ dk, instruments }: Readonly<DrumkitGridProps>) {

    // array of instrument ids, sorted from lowest to highest
    // map each instrument id to a DrumkitRow component for that instrument
    let instrumentIds = Array.from(instruments.keys()).sort((i, j) => i - j);

    return (
        <div>
            {instrumentIds.map((id) =>
                <DrumkitRow
                    key={id}
                    dk={dk}
                    instrument={instruments.get(id)!}
                />
            )}
        </div>
    )
}

/**
 * Defines the props for the DrumkitRow component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
type DrumkitRowProps = {

    /**
     * The DrumkitLogic instance which holds the loop data.
     *
     * @since v0.0.2
     */
    dk: DrumkitLogic;

    /**
     * The instrument which corresponds to this row.
     *
     * @since v0.0.2
     */
    instrument: Instrument;
}

/**
 * Represents an instrument (a single row) in the Drumkit Grid component. It
 * consists of one Drumkit Cell component for each tick in the drumkit loop.
 * Each cell changes the state of the instrument on that tick according to its
 * state.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 *
 * @see {@link DrumkitGridProps}
 */
function DrumkitRow({ dk, instrument }: Readonly<DrumkitRowProps>) {

    // array 0 - tickCount-1
    // map each tick to a DrumkitCell component for that tick
    let ticks = Array(dk.loop.tickCount).fill(0).map((_, i) => i);

    return (
        <div>
            <p>{instrument.displayName}</p>
            <div>
                {ticks.map((tick) =>
                    <DrumkitCell
                        key={tick}
                        onCheckedChanged={(checked) =>
                             dk.set(instrument.id, dk.loop.toBeat(tick), checked ? 1 : 0)
                        }
                    />
                )}
            </div>
        </div>
    )
}

// TODO: contemplate whether beat info is required for the specific slot
// maybe use beat to style column inside of loop?

/**
 * Defines the props for the DrumkitCell component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
type DrumkitCellProps = {

    /**
     * The callback function which is called when the checked state of this
     * cell is changed
     *
     * @since v0.0.2
     */
    onCheckedChanged: (checked: boolean) => void;
}

/**
 * Represents a single cell in the Drumkit Grid. When clicked, its state
 * changes and the callback function is called.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
function DrumkitCell({ onCheckedChanged }: Readonly<DrumkitCellProps>) {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        let newChecked = !checked;
        setChecked(newChecked);
        onCheckedChanged(newChecked);
    };

    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
        />
    );
}

export { Drumkit };

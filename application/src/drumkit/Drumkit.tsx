/**
 * @fileoverview Defines the Drumkit component which just runs some hardcoded
 * data in a loop for a few seconds.
 */

import React from 'react';
import { Player } from './drumkit-logic'
import { Beat, Loop, LoopMetadata } from './loop';
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

    let loop = new Loop(new LoopMetadata(120, 2, 3, 1));

    const player = new Player(loop);

    const start = () => {
        player.start();
    }

    const stop = () => {
        player.stop();
    }

    const onCheckChanged = (instrumenetId: number, beat: Beat, checked: boolean) =>
        loop.set(instrumenetId, beat, checked ? 1 : 0)

    return (
        <div>
            <button onClick={start}>Click to start</button>
            <button onClick={stop}>Click to stop</button>
            <p>Open the console to see results (F12)</p>
            <DrumkitGrid
                metadata={loop.metadata}
                instruments={INSTRUMENTS}
                onCheckChanged={onCheckChanged}
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
     * The LoopMetadata instance which describes the grid.
     *
     * @since v0.0.3
     */
    metadata: LoopMetadata;

    /**
     * The instrument map used to construct the grid.
     *
     * @since v0.0.2
     */
    instruments: Map<number, Instrument>;

    /**
     * The callback function which is called when the cell of an instrument at
     * a specific beat changes state.
     *
     * @since v0.0.3
     */
    onCheckChanged: (instrumentId: number, beat: Beat, checked: boolean) => void;
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
function DrumkitGrid({ metadata, instruments, onCheckChanged }: Readonly<DrumkitGridProps>) {

    // array of instrument ids, sorted from lowest to highest
    // map each instrument id to a DrumkitRow component for that instrument
    let instrumentIds = Array.from(instruments.keys()).sort((i, j) => i - j);

    return (
        <div>
            {instrumentIds.map((id) =>
                <DrumkitRow
                    key={id}
                    metadata={metadata}
                    instrument={instruments.get(id)!}
                    onCheckChanged={(beat, checked) => onCheckChanged(id, beat, checked)}
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
     * The LoopMetadata instance which describes the grid.
     *
     * @since v0.0.3
     */
    metadata: LoopMetadata;

    /**
     * The instrument which corresponds to this row.
     *
     * @since v0.0.2
     */
    instrument: Instrument;

    /**
     * The callback function which is called when the cell at a specific beat
     * changes state.
     *
     * @since v0.0.3
     */
    onCheckChanged: (beat: Beat, checked: boolean) => void;
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
function DrumkitRow({ metadata, instrument, onCheckChanged }: Readonly<DrumkitRowProps>) {

    // array 0 - tickCount-1
    // map each tick to a DrumkitCell component for that tick
    let ticks = Array(metadata.tickCount).fill(0).map((_, i) => i);

    return (
        <div>
            <p>{instrument.displayName}</p>
            <div>
                {ticks.map((tick) =>
                    <DrumkitCell
                        key={tick}
                        onCheckedChanged={(checked) =>
                            onCheckChanged(metadata.toBeat(tick), checked)
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

/**
 * @fileoverview Defines the {@link DrumkitGrid} component as well as its
 * children, {@link DrumkitRow} and {@link DrumkitCell}. Together they define
 * the grid, which has one row per instrument, and each row contains one column
 * for each tick of the loop, as defiend by its metadata. Changes to the cells
 * are propagated to the grid's context via callbacks.
 */

import React from 'react';
import { Beat, LoopMetadata } from './loop';

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
     * The instrument data used to create the grid.
     *
     * @since v0.0.4
     */
    instrumentData: Map<number, string>;

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
 * component for every instrument. The Drumkit Grid component is responsible
 * for providing the user a way to change the drumkit data, the information
 * about when each instrument will play.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 *
 * @see {@link DrumkitGridProps}
 */
function DrumkitGrid({ metadata, instrumentData, onCheckChanged }: Readonly<DrumkitGridProps>) {

    let instrumentIds = Array.from(instrumentData.keys()).sort((a, b) => a - b);

    return (
        <div>
            {instrumentIds.map((id) =>
                <DrumkitRow
                    key={id}
                    metadata={metadata}
                    instrumentDisplayName={instrumentData.get(id)!}
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
     * The id of the instrument which corresponds to this row.
     *
     * @since v0.0.4
     */
    instrumentDisplayName: string;

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
 * the Drumkit Row component is responsible for changing the drumkit data about
 * a single instrument.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 *
 * @see {@link DrumkitGridProps}
 */
function DrumkitRow({ metadata, instrumentDisplayName, onCheckChanged }: Readonly<DrumkitRowProps>) {

    // array 0 - tickCount-1
    // map each tick to a DrumkitCell component for that tick
    let ticks = Array(metadata.tickCount).fill(0).map((_, i) => i);

    return (
        <div>
            <p>{instrumentDisplayName}</p>
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
 * Represents a single cell in the Drumkit Grid. When clicked, its state changes
 * and the callback function is called to change the state of the instrument on
 * that tick according to the state, thereby updating the drumkit data about the
 * instrument on that tick.
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

export { DrumkitGrid };

/**
 * @fileoverview Defines the {@link DrumkitGrid} component as well as its
 * children, {@link DrumkitRow} and {@link DrumkitCell}. Together they define
 * the grid, which has one row per instrument, and each row contains one column
 * for each tick of the loop, as defiend by its metadata. Changes to the cells
 * are propagated to the grid's context via callbacks.
 */

import React from 'react';
import { Beat, LoopMetadata } from './loop';
import './DrumkitGrid.css';

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
     * The instrument data used to create the grid. This includes the name of
     * each instrument, along with the information about which beat it plays.
     *
     * @since v0.0.4
     */
    instrumentData: Map<number, [string, Map<Beat, number>]>;

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
        <table id='drumkit-grid'>
            {instrumentIds.map((id) =>
                <DrumkitRow
                    key={id}
                    metadata={metadata}
                    instrumentData={instrumentData.get(id)!}
                    onCheckChanged={(beat, checked) => onCheckChanged(id, beat, checked)}
                />
            )}
        </table>
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
     * The data of the instrument which corresponds to this row, the
     * information about which beat it plays.
     *
     * @since v0.0.8
     */
    instrumentData: [string, Map<Beat, number>];

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
function DrumkitRow({ metadata, instrumentData, onCheckChanged }: Readonly<DrumkitRowProps>) {

    // array 0 - tickCount-1
    // map each tick to a DrumkitCell component for that tick
    let ticks = Array(metadata.tickCount).fill(0).map((_, i) => i);

    return (
        <tr className='drumkit-row'>
            <td className='drumkit-row-instrument'>{instrumentData[0]}</td>
            <td className='drumkit-row-data'>
                {ticks.map((tick) => metadata.toBeat(tick)).map((beat) => {
                    return (<DrumkitCell
                        key={metadata.toTick(beat)}
                        beat={beat}
                        checked={instrumentData[1].get(beat)!}
                        onCheckedChanged={(checked) => onCheckChanged(beat, checked) }
                    />)
                }
                )}
            </td>
        </tr>
    )
}

/**
 * Defines the props for the DrumkitCell component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.2
 */
type DrumkitCellProps = {

    /**
     * The Beat in the loop this cell corresponds to; used to style it
     * according to its place in the loop.
     *
     * @since v0.0.7
     */
    beat: Beat;

    /**
     * Whether this cell is checked; whether the instrument corresponding to
     * this beat will play.
     *
     * @since v0.0.8
     */
    checked: number;

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
function DrumkitCell({ beat, checked, onCheckedChanged }: Readonly<DrumkitCellProps>) {
    const [_checked, _setChecked] = React.useState(checked === 1);

    // https://stackoverflow.com/questions/58818727/react-usestate-not-setting-initial-value#answer-59308313
    React.useEffect(() => {
        _setChecked(checked === 1);
    }, [checked])

    const handleChange = () => {
        let newChecked = !_checked;
        _setChecked(newChecked);
        onCheckedChanged(newChecked);
    };

    const isBeat = beat.subdivision === 1;
    const isOne = isBeat && beat.beat === 1;

    let beatClass = `beat-${isOne ? "one" : isBeat ? "beat" : "sub"}`;

    return (
        <div
            className={`drumkit-cell-wrapper ${beatClass}`}
            onClick={handleChange}
        >
            <div className={`drumkit-cell ${_checked ? "" : "un"}checked`} />
        </div>
    );
}

export { DrumkitGrid };

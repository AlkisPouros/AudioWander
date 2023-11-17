/**
 * @fileoverview Defines the Drumkit component which defines the drum kit part
 * of this application in its entirety.
 */

import React from 'react';
import { Player } from './drumkit-logic'
import { Beat, LoopMetadata } from './loop';
import { CreateInstrumentListener, InstrumentManager } from './instrument';

/**
 * Defines the Drumkit component which consists of a grid of instruments and a
 * form for adding new instruments. The grid has one row per instrument, and
 * each row contains one column for each tick of the loop, as defiend by its
 * metadata. The drumkit can be started and stopped using buttons. The grid
 * cells indicate when each instrument will play in the beat. Changes to the
 * cells are refelcted in real time while the drumkit is playing.
 *
 * @author Alex Mandelias
 *
 * @sinve v0.0.1
 */
function Drumkit() {

    // --- instrument manager ---

    const instrumentManager = React.useRef(new InstrumentManager());

    const [instrumentIds, setInstrumentIds] = React.useState(instrumentManager.current.getSortedIds());

    React.useEffect(() => {

        const listener: CreateInstrumentListener = (instrumentId) => {
            setInstrumentIds(instrumentManager.current.getSortedIds());
            setData(data.set(instrumentId, Array(metadata.current.tickCount).fill(0)));
        };

        instrumentManager.current.addCreateInstrumentListener(listener);

        return () => {
            instrumentManager.current.removeCreateInstrumentListener(listener);
        };
    }, [])

    // --- metadata, data, player ---

    const metadata = React.useRef(new LoopMetadata(120, 2, 3, 1));

    // map (mutable): instrument id -> array of length `tickCount`, one vlaue for each tick
    const [data, setData] = React.useState(new Map<number, Array<number>>());

    const player = React.useRef(new Player(
        metadata.current,
        data,
        (id, value) => instrumentManager.current.play(id, value)
    ));

    // --- callback functions ---

    const start = () => {
        player.current.start();
    }

    const stop = () => {
        player.current.stop();
    }

    const onCheckChanged = (instrumentId: number, beat: Beat, checked: boolean) => {
        let instrumentData = data.get(instrumentId)!;
        let tick = metadata.current.toTick(beat);
        instrumentData[tick] = checked ? 1 : 0;
        setData(data.set(instrumentId, instrumentData));
    }

    // --- new instrument input form ---

    const [newInstrumentDisplayName, setNewInstrumentDisplayName] = React.useState("");

    const onAddInstrument = () => {
        if (/^\s*$/.test(newInstrumentDisplayName)) {
            return;
        }

        instrumentManager.current.create(newInstrumentDisplayName);
        setNewInstrumentDisplayName("");
    }

    // --- the actual drumkit component ---

    return (
        <div>
            <button onClick={start}>Click to start</button>
            <button onClick={stop}>Click to stop</button>
            <p>Open the console to see results (F12)</p>
            <DrumkitGrid
                metadata={metadata.current}
                instrumentData={new Map(instrumentIds.map(
                    (id) => [id, instrumentManager.current.getDisplayName(id)]
                ))}
                onCheckChanged={onCheckChanged}
            />
            <input
                type="text"
                value={newInstrumentDisplayName}
                onChange={(e) => setNewInstrumentDisplayName(e.target.value)}
            ></input>
            <button onClick={onAddInstrument}>Add Instrument</button>
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
 * component for every instrument.
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
 * Each cell changes the state of the instrument on that tick according to its
 * state.
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

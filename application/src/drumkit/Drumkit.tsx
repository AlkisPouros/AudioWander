/**
 * @fileoverview Defines the Drumkit component which defines the drum kit part
 * of this application in its entirety.
 */

import React from 'react';
import { DrumkitGrid } from './DrumkitGrid';
import { InstrumentForm } from './InstrumentForm';
import { CreateInstrumentListener, InstrumentManager } from './instrument';
import { Beat, LoopMetadata } from './loop';
import { Player } from './player';
import { playAudioBuffer } from '../audio/util';

/**
 * Defines the Drumkit component which consists of a grid of instruments and a
 * form for adding new instruments. The drumkit can be started and stopped
 * using buttons. The grid cells indicate when each instrument will play in the
 * beat. Changes to the cells are refelcted in real time while the drumkit is
 * playing.
 *
 * @author Alex Mandelias
 *
 * @sinve v0.0.1
 *
 * @see {@link DrumkitGrid}
 * @see {@link InstrumentForm}
 */
function Drumkit() {

    // --- instrument manager ---

    const instrumentManager = React.useRef(new InstrumentManager(playAudioBuffer));

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

    const onTryCreateInstrument = (displayName: string, blob: Blob) => {
        instrumentManager.current.create(displayName, blob);
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
            <InstrumentForm
                onTryCreateInstrument={onTryCreateInstrument}
            />
        </div>
    );
}

export { Drumkit };

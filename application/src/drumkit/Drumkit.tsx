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
import './Drumkit.css'
import { MetadataController } from './MetadataController';

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

        const im = instrumentManager.current;

        const listener: CreateInstrumentListener = (instrumentId) => {
            // TODO: this does trigger a re-render, and as a side-effect the data is also updated
            setInstrumentIds(im.getSortedIds());
            setData(data.set(instrumentId, new Map()));
        };

        im.addCreateInstrumentListener(listener);

        return () => {
            im.removeCreateInstrumentListener(listener);
        };
    }, [])

    // --- metadata, data, player ---

    const [metadata, _setMetadata] = React.useState(new LoopMetadata(60, 2, 2, 3));

    const setMetadata = (metadata: LoopMetadata) => {
        _setMetadata(metadata);
        player.current.setMetadata(metadata);
    }

    // map (mutable): instrument id -> array of length `tickCount`, one vlaue for each tick
    const [data, setData] = React.useState(new Map<number, Map<Beat, number>>());

    const player = React.useRef(new Player(
        metadata,
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
        instrumentData.set(beat, checked ? 1 : 0);
        setData(new Map(data.set(instrumentId, instrumentData)));
    }

    const onTryCreateInstrument = (displayName: string, blob: Blob) => {
        instrumentManager.current.create(displayName, blob);
    }

    // --- the actual drumkit component ---

    return (
        <div id="drumkit">
            <button onClick={start}>Click to start</button>
            <button onClick={stop}>Click to stop</button>
            <p>Open the console to see results (F12)</p>
            <MetadataController
                metadata={metadata}
                onSetMetadata={setMetadata}
            />
            <DrumkitGrid
                metadata={metadata}
                instrumentData={new Map(instrumentIds.map(
                    (id) => [id, [instrumentManager.current.getDisplayName(id), data.get(id)!]]
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

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


    return (
        <div>
            <DrumkitGrid
                dk={dk}
                instruments={INSTRUMENTS}
            />
        </div>
    );
}

interface DrumkitGridProps {
    dk: DrumkitLogic;
    instruments: Map<number, Instrument>;
}

function DrumkitGrid({ dk, instruments }: Readonly<DrumkitGridProps>) {

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

interface DrumkitRowProps {
    dk: DrumkitLogic;
    instrument: Instrument;
}

function DrumkitRow({ dk, instrument }: Readonly<DrumkitRowProps>) {
    return (
        <div>
            <p>{instrument.displayName}</p>
            <div>
                {Array(dk.loop.tickCount).fill(0).map((_, i) => {
                    let beat = dk.loop.toBeat(i);
                    return <DrumkitSlot
                        key={i}
                        onCheckedChanged={(checked) => console.log(`Switched instrument ${instrument.id}`
                        + ` to ${checked} on beat ${beat.bar} ${beat.beat} ${beat.subdivision}}`)}
                    />
                })}
            </div>
        </div>
    )
}

// TODO: contemplate whether beat info is required for the specific slot
// maybe use beat to style column inside of loop?
interface DrumkitSlotProps {
    onCheckedChanged: (checked: boolean) => void;
}

function DrumkitSlot({ onCheckedChanged }: Readonly<DrumkitSlotProps>) {
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

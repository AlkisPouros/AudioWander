/**
 * @fileoverview Defines the Drumkit component which just runs some hardcoded
 * data in a loop for a few seconds.
 */

import React from 'react';
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
        <div>
            <DrumkitSlot
                instrumentId={1}
                beat={new Beat(1, 2, 3)}
                onCheckedChanged={(instrumentId: number, beat: Beat, checked: boolean) =>
                    console.log(`Switched instrument ${instrumentId} to ${checked}`
                    + ` on beat ${beat.bar} ${beat.beat} ${beat.subdivision}}`)}
            ></DrumkitSlot>
        </div>
    );
}


interface DrumkitSlotProps {
    instrumentId: number;
    beat: Beat;
    onCheckedChanged: (instrumentId: number, beat: Beat, checked: boolean) => void;
}

function DrumkitSlot({ instrumentId, beat, onCheckedChanged }: Readonly<DrumkitSlotProps>) {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        let newChecked = !checked;
        setChecked(newChecked);
        onCheckedChanged(instrumentId, beat, newChecked);
    };

    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
        />
    );
};

export { Drumkit };

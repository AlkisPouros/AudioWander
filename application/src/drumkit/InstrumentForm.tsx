/**
 * @fileoverview Defines the {@link InstrumentForm} component, which is
 * responsible for allowing the user to create new instruments.
 */

import React from "react";

/**
 * Defines the props for the InstrumentForm component.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.5
 */
type InstrumentFormProps = {

    /**
     * The callback function which is called when the user wishes to create a
     * new instrument with the given display name. This function returns true if
     * the instrument was successfully created, false otherwise.
     *
     * @since v0.0.5
     */
    onTryCreateInstrument: (newInstrumentDisplayName: string) => boolean,
}

/**
 * Represents a form for creating new instruments. It consists of a text input
 * element for the instrument's display name and a button which attempts to
 * create an instrument with that display name. The form provides feedback to
 * the user according to whether the instrument was successfully created.
 *
 * @author Alex Mandelias
 *
 * @since v0.0.5
 */
function InstrumentForm({ onTryCreateInstrument }: InstrumentFormProps) {

    const [newInstrumentDisplayName, setNewInstrumentDisplayName] = React.useState("");

    const handleClick = () => {
        let success = onTryCreateInstrument(newInstrumentDisplayName);

        if (success) {
            setNewInstrumentDisplayName("");
        }
    }

    return (
        <div>
            <input
                type="text"
                value={newInstrumentDisplayName}
                onChange={(e) => setNewInstrumentDisplayName(e.target.value)}
            ></input>
            <button onClick={handleClick}>Add Instrument</button>
        </div>
    )
}

export { InstrumentForm };

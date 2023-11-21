/**
 * @fileoverview Defines the {@link InstrumentForm} component, which is
 * responsible for allowing the user to create new instruments.
 */

import React, { MutableRefObject } from "react";

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
     * new instrument with the given display name and blob as its audio data.
     *
     * @since v0.0.5
     */
    onTryCreateInstrument: (newInstrumentDisplayName: string, newInstrumentBlob: Blob) => void,
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

    // https://stackoverflow.com/questions/55677600/typescript-how-to-pass-object-is-possibly-null-error#answer-60204406
    const elForm = React.useRef<HTMLFormElement>(null) as MutableRefObject<HTMLFormElement>;
    const elInputDisplayName = React.useRef<HTMLInputElement>(null) as MutableRefObject<HTMLInputElement>;
    const elInputAudio = React.useRef<HTMLInputElement>(null) as MutableRefObject<HTMLInputElement>;
    const elAudioPreview = React.useRef<HTMLAudioElement>(null) as MutableRefObject<HTMLAudioElement>;

    const invalidDisplayNameErrorMsg = "Invalid display name!";
    const missingAudioFileErrorMsg = "No audio file selected!";
    const invalidAudioFileErrorMsg = "Invalid audio file!";

    // resets validity but does not report it
    const resetValidity = React.useCallback(() => {
        elInputDisplayName.current.setCustomValidity(invalidDisplayNameErrorMsg);
        elInputAudio.current.setCustomValidity(missingAudioFileErrorMsg);
    }, []);

    // set initial validity once but don't report it
    React.useEffect(() => {
        resetValidity();
    }, [resetValidity]);

    // cache listeners
    const onLoadListener = React.useCallback(() => {
        elInputAudio.current.setCustomValidity("");
    }, []);

    const onErrorListener = React.useCallback(() => {
        if (elInputAudio.current.value === "") {
            elInputAudio.current.setCustomValidity(missingAudioFileErrorMsg);
            // don't report on missing file; this happens in two cases:
            // either user cancelled input or src programmatically set to ""
        } else {
            elInputAudio.current.setCustomValidity(invalidAudioFileErrorMsg);
            elInputAudio.current.reportValidity();
        }
    }, []);

    // attach listeners on render, detach on destroy
    React.useEffect(() => {

        const currentElAudioPreview = elAudioPreview.current;

        currentElAudioPreview.addEventListener("canplaythrough", onLoadListener);
        currentElAudioPreview.addEventListener("error", onErrorListener);

        return () => {
            currentElAudioPreview.removeEventListener("canplaythrough", onLoadListener);
            currentElAudioPreview.removeEventListener("error", onErrorListener);
        }
    }, [onErrorListener, onLoadListener])

    // read selected audio file and preview it using an audio element
    const previewSelectedAudioFile = () => {
        if (!elInputAudio.current.files) {
            throw new Error("how could this haaaappen to meeeee");
        }

        let reader = new FileReader();
        reader.onloadend = () => {
            elAudioPreview.current.src = reader.result as string;
        }

        let audio_file = elInputAudio.current.files[0];

        if (audio_file) {
            reader.readAsDataURL(audio_file);
        } else {
            elAudioPreview.current.src = "";
        }
    }

    const [newInstrumentDisplayName, _setNewInstrumentDisplayName] = React.useState("");

    // check validity of display name
    const onSetNewInstrumentDisplayName = (displayName: string) => {
        _setNewInstrumentDisplayName(displayName);

        let invalidDisplayName = /^\s*$/.test(displayName);
        elInputDisplayName.current.setCustomValidity(
            invalidDisplayName ? invalidDisplayNameErrorMsg : ""
        );
        elInputDisplayName.current.reportValidity();
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // don't reload page
        e.preventDefault();

        // extract instrument data from input fields
        let displayName = newInstrumentDisplayName;
        let blob = await (await fetch(elAudioPreview.current.src)).blob();

        // call callback with that data
        onTryCreateInstrument(displayName, blob);

        // clear input fields
        // reset text input without changing or reporting validity
        _setNewInstrumentDisplayName("");
        // reset audio input without reporting validity
        elForm.current.reset();
        // reset audio preview; validity is not reported on missing file (src == "")
        elAudioPreview.current.src = "";
        // reset validity for all input elements
        resetValidity();
    }

    return (
        <form ref={elForm} onSubmit={onSubmit}>
            <input
                ref={elInputDisplayName}
                type="text"
                value={newInstrumentDisplayName}
                onChange={(e) => onSetNewInstrumentDisplayName(e.target.value) }
            />
            <input ref={elInputAudio} type="file" onChange={previewSelectedAudioFile}/>
            <audio ref={elAudioPreview} controls data-valid="false"></audio>
            <button type="submit">Add Instrument</button>
        </form>
    )
}

export { InstrumentForm };

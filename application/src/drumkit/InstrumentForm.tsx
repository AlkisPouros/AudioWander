/**
 * @fileoverview Defines the {@link InstrumentForm} component, which is
 * responsible for allowing the user to create new instruments.
 */

import React, { MutableRefObject } from "react";
import './InstrumentForm.css';

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
    const elSpanFileName = React.useRef<HTMLSpanElement>(null) as MutableRefObject<HTMLSpanElement>;
    const elAudioPreviewButton = React.useRef<HTMLButtonElement>(null) as MutableRefObject<HTMLButtonElement>;
    const elAudioPreview = React.useRef<HTMLAudioElement>(null) as MutableRefObject<HTMLAudioElement>;

    const invalidDisplayNameErrorMsg = "Invalid display name!";
    const missingAudioFileErrorMsg = "No audio file selected!";
    const invalidAudioFileErrorMsg = "Invalid audio file!";

    const [reportDisplayNameValidity, setReportDisplayNameValidity] = React.useState(false);
    const [reportAudioFileValidity, setReportAudioFileValidity] = React.useState(false);
    const [displayNameValidity, setDisplayNameValidity] = React.useState("");
    const [audioFileValidity, setAudioFileValidity] = React.useState("");

    // reset and hide validity
    const resetValidity = React.useCallback(() => {
        setReportDisplayNameValidity(false);
        setReportAudioFileValidity(false);
        setDisplayNameValidity(invalidDisplayNameErrorMsg);
        setAudioFileValidity(missingAudioFileErrorMsg);
        elAudioPreviewButton.current.disabled = true;
    }, []);

    // set initial validity and hide it
    React.useEffect(() => {
        resetValidity();
    }, [resetValidity]);

    // cache load/error/click listeners
    const onLoadListener = React.useCallback(() => {
        setAudioFileValidity("");

        elAudioPreviewButton.current.disabled = false;
    }, []);

    const onErrorListener = React.useCallback(() => {
        // determine cause of error: either missing of bad file type
        let missing = elInputAudio.current.value === "";

        setAudioFileValidity(missing
            ? missingAudioFileErrorMsg
            : invalidAudioFileErrorMsg
        );

        // don't report on missing file; this happens in two cases:
        // either user cancelled input or src programmatically set to ""
        setReportAudioFileValidity(!missing);

        elAudioPreviewButton.current.disabled = true;
    }, []);

    const onPreviewListener = React.useCallback(() => {
        // button disabled onerror; play() won't fail
        elAudioPreview.current.play();
    }, []);

    // add listeners on render, remove on destroy
    React.useEffect(() => {

        const currentElAudioPreview = elAudioPreview.current;
        const currentElAudioPreviewButton = elAudioPreviewButton.current;

        currentElAudioPreview.addEventListener("canplaythrough", onLoadListener);
        currentElAudioPreview.addEventListener("error", onErrorListener);
        currentElAudioPreviewButton.addEventListener("click", onPreviewListener);

        return () => {
            currentElAudioPreview.removeEventListener("canplaythrough", onLoadListener);
            currentElAudioPreview.removeEventListener("error", onErrorListener);
            currentElAudioPreviewButton.removeEventListener("click", onPreviewListener);
        }
    }, [onErrorListener, onLoadListener, onPreviewListener])

    // read selected audio file and preview it using an audio element
    const previewSelectedAudioFile = () => {
        if (!elInputAudio.current.files) {
            throw new Error("how could this haaaappen to meeeee");
        }

        let audio_file = elInputAudio.current.files[0];

        let reader = new FileReader();
        reader.onloadend = () => {
            elSpanFileName.current.textContent = audio_file.name;
            // this line will cause either the onLoad or the onError listeners
            // of the elAudioPreview element to fire, thereby updating both the
            // validity and the elAudioPreviewButton enabled state
            elAudioPreview.current.src = reader.result as string;
        }

        if (audio_file) {
            reader.readAsDataURL(audio_file);
        } else {
            // on cancel: clear the spanFileName element and also cause the
            // onError listener on the audio element to fire
            elSpanFileName.current.textContent = "";
            elAudioPreview.current.src = "";
        }
    }

    const [newInstrumentDisplayName, _setNewInstrumentDisplayName] = React.useState("");

    // check validity of display name
    const onSetNewInstrumentDisplayName = (displayName: string) => {
        _setNewInstrumentDisplayName(displayName);

        let invalidDisplayName = /^\s*$/.test(displayName);
        setDisplayNameValidity(
            invalidDisplayName ? invalidDisplayNameErrorMsg : ""
        );

        // turn on validity after being initially turned off
        setReportDisplayNameValidity(true);
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // don't reload page
        e.preventDefault();

        if (!(displayNameValidity === "" && audioFileValidity === "")) {
            // force show both validities on error and return
            setReportAudioFileValidity(true);
            setReportDisplayNameValidity(true);
            return;
        }

        // extract instrument data from input fields
        let displayName = newInstrumentDisplayName;
        let blob = await (await fetch(elAudioPreview.current.src)).blob();

        // call callback with that data
        onTryCreateInstrument(displayName, blob);

        // clear input fields

        // reset text and audio inputs
        _setNewInstrumentDisplayName("");
        elForm.current.reset();

        // reset audio preview
        elSpanFileName.current.textContent = "";
        elAudioPreview.current.src = "";

        // reset and hide validity
        resetValidity();
    }

    return (
        <form ref={elForm} id="instrument-form" className="container" noValidate onSubmit={onSubmit}>
            <div className="form-field">
                <label
                    htmlFor="display-name-input"
                >Instrument Name:</label>
                <input
                    ref={elInputDisplayName}
                    id="display-name-input"
                    type="text"
                    value={newInstrumentDisplayName}
                    onChange={(e) => onSetNewInstrumentDisplayName(e.target.value) }
                />
                <span className="error">
                    {reportDisplayNameValidity ? displayNameValidity : ""}
                </span>
            </div>
            <div className="form-field">
                <label
                    className="button-label"
                    htmlFor="audio-input"
                >Choose an Audio File</label>
                <input
                    ref={elInputAudio}
                    className="hidden"
                    id="audio-input"
                    type="file"
                    accept="audio/*"
                    onChange={previewSelectedAudioFile}
                />
                <span ref={elSpanFileName}></span>
                {/* https://stackoverflow.com/questions/2825856/html-button-to-not-submit-form#answer-2825867 */}
                <button ref={elAudioPreviewButton} type="button">Preview</button>
                <span className="error">
                    {reportAudioFileValidity ? audioFileValidity : ""}
                </span>
                <audio ref={elAudioPreview}></audio>
            </div>
            <div>
                <label htmlFor="submit" className="button-label">Submit</label>
                <input className="hidden" type="submit" id="submit"></input>
            </div>
        </form>
    )
}

export { InstrumentForm };

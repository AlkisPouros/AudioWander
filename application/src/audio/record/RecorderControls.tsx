import { RecorderState } from './../Recorder';

import './RecorderControls.css';

type RecorderControlsProps = {

    start: () => void,

    stop: () => void,

    state: RecorderState,
}

function RecorderControls( { start, stop, state }: RecorderControlsProps) {

    const recordingMsg = state === RecorderState.RECORDING ? "Recording" : "";

    const startEnabled = state === RecorderState.STOPPED;
    const stopEnabled = state === RecorderState.RECORDING;

    return (
        <div id="recorder-controls">
            <button
                className="button-label"
                onClick={start}
                disabled={!startEnabled}
            >Start Recording</button>
            <button
                className="button-label"
                onClick={stop}
                disabled={!stopEnabled}
            >Stop Recording</button>
            <span>{recordingMsg}</span>
        </div>
    );
}

export { RecorderControls };

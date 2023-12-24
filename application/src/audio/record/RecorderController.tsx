import { RecorderState } from '../Recorder';

import './RecorderController.css';

type RecorderControllerProps = {

    start: () => void,

    stop: () => void,

    state: RecorderState,
}

function RecorderController( { start, stop, state }: RecorderControllerProps) {

    const recordingMsg = state === RecorderState.RECORDING ? "Recording" : "";

    const startEnabled = state === RecorderState.STOPPED;
    const stopEnabled = state === RecorderState.RECORDING;

    return (
        <div id="recorder-controller">
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

export { RecorderController };

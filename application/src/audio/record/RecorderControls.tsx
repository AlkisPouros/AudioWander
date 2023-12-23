import { RecorderState } from './../Recorder';

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
        <div>
            <button onClick={start} disabled={!startEnabled}>Start Recording</button>
            <button onClick={stop} disabled={!stopEnabled}>Stop Recording</button>
            <span>{recordingMsg}</span>
        </div>
    );
}

export { RecorderControls };

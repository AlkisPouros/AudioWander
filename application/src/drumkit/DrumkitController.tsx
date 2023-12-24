import { DrumkitState } from './Drumkit';

type DrumkitControllerProps = {

    start: () => void,

    stop: () => void,

    state: DrumkitState,
}

function DrumkitController( { start, stop, state }: DrumkitControllerProps) {

    const playingMsg = state === DrumkitState.PLAYING ? "Playing" : "Stopped";

    const startEnabled = state === DrumkitState.STOPPED;
    const stopEnabled = state === DrumkitState.PLAYING;

    return (
        <div className="controller">
            <button
                className="button-label"
                onClick={start}
                disabled={!startEnabled}
            >Start Drumkit</button>
            <button
                className="button-label"
                onClick={stop}
                disabled={!stopEnabled}
            >Stop Drumkit</button>
            <span>{playingMsg}</span>
        </div>
    );
}

export { DrumkitController };

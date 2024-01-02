import * as Tone from 'tone';

import React from 'react';

import { RecordingsCollection } from './record/RecordingsCollection';
import { RecorderController } from './record/RecorderController';
import { DownloadList } from './record/DownloadList';

import './Recorder.css'

const recorder = new Tone.Recorder();

enum RecorderState {
    STOPPED, RECORDING,
};

const RecorderProxy = {

    connectToRecorder: (player: Tone.Player) => player.connect(recorder),
}

function Recorder() {

    const [recorderState, setRecorderState] = React.useState(RecorderState.STOPPED);

    const start = () => {
        recorder.start();
        setRecorderState(RecorderState.RECORDING);
    }

    const stop = () => {
        recorder.stop()
            .then((recording) => {
                const url = URL.createObjectURL(recording);
                setRecordings(recordings.add(url));
                setRecorderState(RecorderState.STOPPED);
            });
    }

    const [recordings, setRecordings] = React.useState(new RecordingsCollection());

    const onRecordingDeleted = (index: number) => {
        setRecordings(recordings.delete(index));
    }

    return (
        <div id="recorder">
            <RecorderController
                start={start}
                stop={stop}
                state={recorderState}
            />
            <DownloadList
                items={recordings}
                onItemDeleted={onRecordingDeleted}
            />
        </div>
    );
}

export { Recorder, RecorderProxy, RecorderState };

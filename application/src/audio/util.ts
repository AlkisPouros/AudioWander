/**
 * @fileoverview Defines global utility functions related to audio and the
 * ToneJS library.
 */

import * as Tone from 'tone';
import { RecorderProxy } from './Recorder'

/**
 * Converts a blob object containing audio data to an AudioBuffer which can be
 * played using the {@link playAudioBuffer} function.
 *
 * @param {Blob} blob the blob to convert to AudioBuffer
 *
 * @author Alex Mandelias
 *
 * @since v0.0.6
 */
const blobToBuffer = async (blob: Blob) => {
    let arrayBuffer = await blob.arrayBuffer();
    let audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
    return audioBuffer;
}

/**
 * Plays the contents of an AudioBuffer by creating a new Player object and
 * connecting it to destination.
 *
 * @param {AudioBuffer} audioBuffer the buffer to play
 *
 * @author Alex Mandelias
 *
 * @since v0.0.6
 */
const playAudioBuffer = (audioBuffer: AudioBuffer) => {
    const player = new Tone.Player(audioBuffer);

    RecorderProxy.connectToRecorder(player);

    player.toDestination().start();
}

export { blobToBuffer, playAudioBuffer };

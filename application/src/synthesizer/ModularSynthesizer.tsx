import React, { useRef, useState } from "react";
import * as Tone from "tone";

const player = new Tone.Player().toDestination();

const ModularSynthesizer = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	/*const autoFilter = new Tone.AutoFilter({
		frequency: 1, // Valid range: 0 to 1
		depth: 1,
		baseFrequency: 5000, // Valid range: 10 to 10000
		octaves: 4,
	  }).toDestination();
	  */
	//const distortion = new Tone.Distortion(2.5).toDestination();
	const delay = new Tone.FeedbackDelay(0.5, 0.8).toDestination();
	const filter = new Tone.Filter(200, "lowpass").toDestination();
	const oscillator = new Tone.Oscillator().toDestination();
	oscillator.connect(filter);
	
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;

		if (files && files.length > 0) {
			const file = files[0];
			player.dispose();

			// Load the selected file into the new player
			await player.load(URL.createObjectURL(file));
		}
	};
	const startPlayback = () => {
		// Start Tone.js and player within the same user-initiated event
		Tone.start();

		// Set the initial playback rate
		player.playbackRate = playbackRate;

		// Chain effects to the player
		player.chain(filter, delay);

		// Start playback when the user clicks "Play"
		player.start();
		
		setIsPlaying(true);
	};
	const stopPlayback = () => {
		player.stop();
    	setIsPlaying(false);
	}
	const changePlaybackRate = (speed: number) => {
		setPlaybackRate(speed);
		if (player) {
			player.playbackRate = speed;
		}
	};

	return (
		<div>
			<input
				type='file'
				accept='audio/*'
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			<button onClick={startPlayback}>Play</button>
			<button onClick={stopPlayback}>stop</button>
			<label>
				Playback Speed:
				<input
					type='number'
					step='0.1'
					value={playbackRate}
					onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
				/>
			</label>
		</div>
	);
};

export { ModularSynthesizer };

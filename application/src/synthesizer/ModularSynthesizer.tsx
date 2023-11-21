import React, { useRef, useState } from "react";
import * as Tone from "tone";
import { Decibels } from "tone/build/esm/core/type/Units";

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
	const dist = new Tone.Distortion(0.8).toDestination(); //distortion of the sound
	const delay = new Tone.FeedbackDelay(0.5, 0.8).toDestination();
	const filter = new Tone.Filter(350, "lowpass").toDestination();
	const oscillator = new Tone.Oscillator(440, "sine").toDestination(); // To be checked
	oscillator.connect(filter);

	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [distortion, setValue] = useState(0);
	const [volume, setVolume] = useState(0);
	const [frequency, setFrequency] = useState(350);
	const [isButtonClicked, setIsButtonClicked] = useState(false);

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

		// Set the initial distortion value
		dist.distortion = distortion;
		// Set the initial volume value
		setVolume(Math.max(Math.min(volume, 0), -40));

		// Chain effects to the player
		player.chain(filter, dist, delay);

		// Start playback when the user clicks "Play"
		player.start();

		setIsPlaying(true);
	};
	const stopPlayback = () => {
		if (isPlaying) {
			player.stop();
			setIsPlaying(false);
			setIsButtonClicked(true);
		}
	};
	const changePlaybackRate = (speed: number) => {
		setPlaybackRate(speed);
		if (player) {
			player.playbackRate = speed;
		}
	};
	const changeDistortionValue = (amount: number) => {
		setValue(amount);
		if (dist) {
			dist.distortion = amount;
		}
	};

	const changeVolume = (sound: Decibels) => {
		setVolume(sound);
		if (player) {
			player.volume.rampTo(sound, 0.1);
		}
	};
	const changeFrequency = (freq: number) => {
		setFrequency(freq);
		if (filter) {
			// Set the filter frequency to the new value

			filter.frequency.value = freq;

			console.log(filter.frequency.value);

			// Restart playback

			if (isPlaying) {
				player.stop();
				player.start();
			}
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
			<button onClick={stopPlayback}>Stop</button>
			<label>
				Playback Speed:
				<input
					type='range'
					step='0.1'
					min='0'
					max='2.0'
					value={playbackRate}
					onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
				/>
			</label>
			<label>
				Distortion:
				<input
					type='range'
					step='0.01'
					min='0'
					max='1'
					value={distortion}
					onChange={(e) => changeDistortionValue(parseFloat(e.target.value))}
				></input>
			</label>

			<label>
				Volume:
				<input
					type='range'
					step='1'
					min='-20'
					max='20'
					value={volume}
					onChange={(e) => changeVolume(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Filter Frequency (lowpass):
				<input
					type='range'
					step='2'
					min='10'
					max='20000'
					value={frequency}
					onChange={(e) => changeFrequency(parseFloat(e.target.value))}
				></input>
			</label>
		</div>
	);
};

export { ModularSynthesizer };

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
	const HighpassFilter = new Tone.Filter(1500,"highpass").toDestination();
	const oscillator = new Tone.Oscillator(440, "sine").toDestination(); // To be checked
	oscillator.connect(filter);

	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [distortion, setValue] = useState(0);
	const [volume, setVolume] = useState(0);
	const [frequency, setFrequency] = useState(350);
	const [high_frequency, setHighFrequency] = useState(1500);
	const [loop, setLoop] = useState(false);
	const [isButtonClicked, setIsButtonClicked] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [fileError, setFileError] = useState<string | null>(null);
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		
		const files = event.target.files;
	
		if (files && files.length > 0) {
		 
			const file = files[0];
			setSelectedFile(file);
			console.log(file);
			player.dispose();
	
			
			await player.load(URL.createObjectURL(file));
			
		}
		else {
			setFileError("No source audio file added");
		}
	};
	const startPlayback = () => {
		
		if(!fileInputRef.current?.value)
		{
			setFileError('Please select an audio file before starting');
			return;
		}
		if(!player.state || player.state !=='started')
		{
			// Start Tone.js and player within the same user-initiated event
			Tone.start();
			setFileError(null);
			console.log(player.buffer);
			// Set the initial playback rate
			player.playbackRate = playbackRate;
			
			// Set the initial distortion value
			dist.distortion = distortion;
			// Set the initial volume value
			setVolume(Math.max(Math.min(volume, 0), -40));

			// Chain effects to the player
			player.chain(filter, HighpassFilter, dist, delay);

			// Start playback when the user clicks "Play"
			player.start();

			setIsPlaying(true);
		}
	};
	const stopPlayback = () => {
		if(!fileInputRef.current?.value)
		{
			setFileError('Please select an audio file before stopping');
			return;
		}
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
		}
	};
	const changeFilterFrequency = (freq: number) => {
		setHighFrequency(freq);

		HighpassFilter.frequency.value = freq;
		
	}
	const toggleLoop = () => {
		const newLoopValue = !loop;
		setLoop(newLoopValue);
		
		if(player)
		{
			player.loop = !loop
		}
	}
	return (
		<div>
			{fileError && <p style= {{color:'red'}}>{fileError}</p>}
			<input
				type='file'
				accept='audio/*'
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			{selectedFile && (<><button onClick={startPlayback}>Play</button>
								<button onClick={stopPlayback}>Stop</button></>)}
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
					onChange={(e) => changeFilterFrequency(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Filter Frequency (highpass)
				<input
					type="range"
					step='2'
					min='10'
					max='20000'
					value={high_frequency}
					onChange={(e)=> changeFrequency(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Loop:
				<input type="checkbox" checked={loop} onChange={toggleLoop}/>
				
			</label>
		</div>
	);
};

export { ModularSynthesizer };

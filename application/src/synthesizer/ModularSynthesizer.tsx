import React, { useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import { Decibels } from "tone/build/esm/core/type/Units";

const sfx_players = new Tone.Players().toDestination();
const player = new Tone.Player().toDestination();
const dist = new Tone.Distortion().toDestination(); //distortion of the sound
const filter = new Tone.Filter(350, "lowpass").toDestination();
const HighpassFilter = new Tone.Filter(1500, "highpass").toDestination();
const destinationNode = new Tone.Gain().toDestination();
const reverb = new Tone.Reverb().toDestination();

const ModularSynthesizer = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const playersFileInputRef = useRef<HTMLInputElement>(null);
	/*const autoFilter = new Tone.AutoFilter({
		frequency: 1, // Valid range: 0 to 1
		depth: 1,
		baseFrequency: 5000, // Valid range: 10 to 10000
		octaves: 4,
	  }).toDestination();
	  */ // To be checked

	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [distortion, setValue] = useState(0);
	const [volume, setVolume] = useState(0);
	const [frequency, setFrequency] = useState(350);
	const [high_frequency, setHighFrequency] = useState(1500);
	const [loop, setLoop] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [decay_value, setDecayValue] = useState(0);
	const [wet_value, setWetValue] = useState(0);
	const [pre_delay, setPreDelay] = useState(0);
	const [fileError, setFileError] = useState<string | null>(null);
	const [arePlayersPlaying, setArePlayersPlaying] = useState(false);
	const [playersSelectedFile, setPlayersSelectedFile] = useState<File | null>(null);
	const [playersFileError, setPlayersFileError] = useState<string | null>(null);

	const playerKeys = [] as Array<String>;

	const addPlayer = (file : File, key : string) => {
		const player = new Tone.Player(URL.createObjectURL(file)).toDestination();
		sfx_players.add(key, player.name);
		playerKeys.push(key);
	};

	const handleSFXFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;

		if (files && files.length > 0) {
			const newFiles = Array.from(files);
			const validAudioFiles = newFiles.filter((file) =>
				file.type.startsWith("audio/")
			);
			if (validAudioFiles.length > 0) {
				setPlayersFileError(null);
				setPlayersSelectedFile(validAudioFiles[0]);

				// Dispose of previous players
				if (sfx_players) {
					sfx_players.dispose();
				}

				//upload files
				validAudioFiles.forEach((file, index) => {
					const player = new Tone.Player().toDestination();
					sfx_players.add(index.toString(), player.name); // Use the index as the key
				});
			}
		} else {
			setPlayersFileError("No source audio file added");
		}
	};

	const startPlayersPlayback = () => {
		if (!playersFileInputRef.current?.value) {
			setPlayersFileError("Please select an audio file before starting");
			return;
		}

		if (!arePlayersPlaying || !sfx_players) {
			// Start Tone.js and players within the same user-initiated event
			Tone.start();
			setPlayersFileError(null);
			// Start the players
			//The code is to be completed
      		
			
			setArePlayersPlaying(true);
		}
	};

	const stopPlayersPlayback = () => {
		if (arePlayersPlaying || sfx_players) {
			// Stop and disconnect the players
			sfx_players.stopAll();
			sfx_players.disconnect();

			setArePlayersPlaying(false);
		}
	};

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
		} else {
			setFileError("No source audio file added");
		}
	};
	const startPlayback = () => {
		if (!fileInputRef.current?.value) {
			setFileError("Please select an audio file before starting");
			return;
		}
		if (!player.state || player.state !== "started") {
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
			player.connect(filter);
			player.connect(HighpassFilter);
			filter.connect(dist);
			HighpassFilter.connect(dist);
			dist.connect(reverb);
			reverb.connect(destinationNode);
			//sfx_players.connect(destinationNode);

			// Start playback when the user clicks "Play"
			player.start();

			setIsPlaying(true);
		}
	};
	const stopPlayback = () => {
		if (!fileInputRef.current?.value) {
			setFileError("Please select an audio file before stopping");
			return;
		}
		if (isPlaying) {
			player.stop();
			setIsPlaying(false);
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
			filter.frequency.rampTo(freq, 0.1);

			console.log(filter.frequency.value);
		}
	};
	const changeFilterFrequency = (freq: number) => {
		setHighFrequency(freq);

		if (HighpassFilter) {
			HighpassFilter.frequency.rampTo(freq, 0, 1);
			console.log(HighpassFilter.frequency.value);
		}
	};
	const toggleLoop = () => {
		const newLoopValue = !loop;
		setLoop(newLoopValue);
		if (player) {
			player.loop = !loop;
		}
	};
	const changeDecayValue = (decay_value: number) => {
		setDecayValue(decay_value);
		if (reverb) {
			reverb.decay = decay_value;
		}
	};
	const changeWetValue = (wet_value: number) => {
		setWetValue(wet_value);
		if (reverb) {
			reverb.wet.value = wet_value;
		}
	};
	const preDelayValue = (pre_delay: number) => {
		setPreDelay(pre_delay);
		if (reverb) {
			reverb.preDelay = pre_delay;
		}
	};

	return (
		<div>
			{fileError && <p style={{ color: "red" }}>{fileError}</p>}
			<input
				type='file'
				accept='audio/*'
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			{selectedFile && (
				<>
					<button onClick={startPlayback}>Play</button>
					<button onClick={stopPlayback}>Stop</button>
				</>
			)}
			<label>
				Add SFX:
				{playersFileError && <p style={{ color: "red" }}>{playersFileError}</p>}
				<input
					type='file'
					accept='audio/*'
					multiple
					ref={playersFileInputRef}
					onChange={handleSFXFileChange}
				></input>
				{playersSelectedFile && (
					<>
						<button onClick={startPlayersPlayback}>Start sfx</button>
						<button onClick={stopPlayersPlayback}>Stop sfx</button>
					</>
				)}
			</label>

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
			<label>
				Filter Frequency (highpass)
				<input
					type='range'
					step='2'
					min='10'
					max='20000'
					value={high_frequency}
					onChange={(e) => changeFilterFrequency(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Loop:
				<input type='checkbox' checked={loop} onChange={toggleLoop} />
			</label>
			<label>
				Decay:
				<input
					type='range'
					min='0'
					step='0.1'
					max='10'
					value={decay_value}
					onChange={(e) => changeDecayValue(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Wetness:
				<input
					type='range'
					min='0'
					max='1'
					step='0.01'
					value={wet_value}
					onChange={(e) => changeWetValue(parseFloat(e.target.value))}
				></input>
			</label>
			<label>
				Pre Delay:
				<input
					type='range'
					min='0'
					max='1'
					step='0.01'
					value={pre_delay}
					onChange={(e) => preDelayValue(parseFloat(e.target.value))}
				></input>
			</label>
		</div>
	);
};

export { ModularSynthesizer };

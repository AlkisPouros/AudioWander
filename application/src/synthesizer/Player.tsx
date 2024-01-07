import React, { useRef, useState, useEffect } from "react";
import * as Tone from "tone";
import { Decibels, NormalRange } from "tone/build/esm/core/type/Units";
import Audio from "./Audio";
import { Toggle } from "./Toggle";
import "./Player.css";
import { RecorderProxy } from "../audio/Recorder";

/**
 * @author Alkis Pouros
 * Player component which renders all the elements and supports the all functionality for the main audio player
 */

// Initialize Tone globally
Tone.start();

interface PlayerProps {
	stopPlayersPlayback: () => void;
}

const transport = Tone.Transport;

const Player: React.FC<PlayerProps> = ({ stopPlayersPlayback }) => {
	/** We have all the necessary hook functions and state values needed for checking state and values
	 * of the nodes initialized and imported from the Audio component
	 * */

	const fileInputRef = useRef<HTMLInputElement>(null);
	const {player,dist,filter,HighpassFilter,reverb,ping_pong,analyser,stereoWidener,sfx_player1,sfx_player2,sfx_player3,sfx_player4,} = Audio;
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1);
	const [distortion, setValue] = useState(0);
	const [width, setWidth] = useState(0.5);
	const [volume, setVolume] = useState(0);
	const [frequency, setFrequency] = useState(350);
	const [high_frequency, setHighFrequency] = useState(1500);
	const [loop, setLoop] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	// if a file is selected then the start/stop button element are rendered
	// if a user decided afterwads to cancel any file upload action and clicks start/stop then an error msessage spawns
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [decay_value, setDecayValue] = useState(0);
	const [wet_value, setWetValue] = useState(0);
	const [pre_delay, setPreDelay] = useState(0);
	// if there is a file error (which means no audio selected) then a message spawns, otherwise everything is ok
	const [fileError, setFileError] = useState<string | null>(null);
	const [check, setCheck] = useState(false);
	const [scheduledEventId, setScheduledEventId] = useState<number | null>(null);

	// All functions from here and on are called by user from the UI as arrow functions for event handlers

	/**
	 *
	 * asynchronous function which handles input file upload events and inside desposes any previous player setups
	 * then you can load the file parsed as a url on the player
	 * This is done because of the need to handle file upload even when other functions are executing
	 */

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;

		if (files && files.length > 0) {
			const file = files[0];
			setSelectedFile(file);
			setFileError(null);
			console.log(file);

			player.dispose();
			await player.load(URL.createObjectURL(file));
			RecorderProxy.connectToRecorder(player);

			setCurrentTime(0); // Reset current time when loading a new file
		} else {
			setFileError("No source audio file added");
		}
	};

	// The startPlayback function is called when user clicks "Start"
	const startPlayback = async () => {
		// check if there is not a file in the buffer (file upload) right now, so user doen't have the right of any action given
		if (!fileInputRef.current?.value) {
			setFileError("Please select an audio file before starting");
			return;
		}
		if (!player.state || player.state !== "started") {
			// Start player within the user-initiated event

			setFileError(null);
			console.log(player.buffer);
			// Set the initial playback rate
			player.playbackRate = playbackRate;

			// Set the initial distortion value
			dist.distortion = distortion;

			// Set the initial width value

			stereoWidener.width.value = width;

			// Set the initial volume value
			setVolume(Math.max(Math.min(volume, 0), -40));

			// Chain effects to the player and destination Node
			// Connect the player to the effects chain

			player.connect(analyser);
			HighpassFilter.connect(analyser);
			filter.connect(analyser);
			stereoWidener.connect(analyser);
			dist.connect(analyser);
			reverb.connect(analyser);
			ping_pong.connect(analyser);

			sfx_player1.connect(analyser);
			sfx_player2.connect(analyser);
			sfx_player3.connect(analyser);
			sfx_player4.connect(analyser);

			//Start the player when the user clicks "play"
			player.start();

			setIsPlaying(true);
		}
	};

	// The stopPlayback function is called when user clicks "Stop"
	const stopPlayback = () => {
		// check if there is not a file in the buffer (file upload) right now, so user doen't have the right of any action given
		if (!fileInputRef.current?.value) {
			setFileError("Please select an audio file before stopping");
			return;
		}
		// If there is a source audio playing right, with the tone.js api we stop it, update the playing state and forcibly stop all sfx players as well
		if (isPlaying) {
			if (
				sfx_player1.state === "started" ||
				sfx_player2.state === "started" ||
				sfx_player3.state === "started" ||
				sfx_player4.state === "started"
			)
				stopPlayersPlayback();

			// Stop the player immediately
			player.stop();
			// Stop the Transport
			transport.stop();

			setIsPlaying(false);

			// Reset the slider to its original position
			setCurrentTime(0);
		}
	};

	const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const time = parseFloat(event.target.value);
		setCurrentTime(time);

		// Set the player's seek position
		if (player) {
			player.seek(time);

			// Start the player from the new position
			if (!isPlaying) {
				startPlayback();
			}
		}
	};

	useEffect(() => {
		const updateCurrentTime = (time: number) => {
			setCurrentTime(time);
		};

		const eventId = Tone.Transport.scheduleRepeat(updateCurrentTime, "0.01");
		setScheduledEventId(eventId);

		// Clear the scheduled event when the component is unmounted
		return () => {
			Tone.Transport.clear(eventId);
		};
	}, []);

	// The speed is being changed and updates the change
	const changePlaybackRate = (speed: number) => {
		try {
			setPlaybackRate(speed);
			if (player) {
				player.playbackRate = speed;
			}
		} catch (error) {
			console.log("error");
		}
	};
	// the distortion value is being changed
	// Usually a value between 0 and 1
	const changeDistortionValue = (amount: number) => {
		try {
			setValue(amount);
			if (dist) {
				dist.distortion = amount;
			}
			if (dist.distortion !== 0 && player.state === "started") {
				player.connect(dist);
			} else {
				player.disconnect(dist);
			}
		} catch (error) {
			console.log("error");
		}
	};
	// Change the volume using rampTo, which performs the increase/decrease of the in 0.1 secs.
	const changeVolume = (sound: Decibels) => {
		try {
			setVolume(sound);
			if (player) {
				player.volume.rampTo(sound, 0.1);
			}
		} catch (error) {
			console.log("error");
		}
	};
	// Apply change to lowpass frequency value
	const changeFrequency = (freq: number) => {
		try {
			setFrequency(freq);
			if (filter) {
				// Set the filter frequency to the new value
				filter.frequency.rampTo(freq, 0.1);

				console.log(filter.frequency.value);
			}
			if (filter.frequency.value !== 350 && player.state === "started") {
				player.connect(filter);
			} else {
				player.disconnect(filter);
			}
		} catch (error) {
			console.log("there was a runtime error!");
		}
	};
	// Apply change to Highfrequency value
	const changeFilterFrequency = (freq: number) => {
		try {
			setHighFrequency(freq);

			if (HighpassFilter) {
				HighpassFilter.frequency.rampTo(freq, 0, 1);
				console.log(HighpassFilter.frequency.value);
			}
			if (
				HighpassFilter.frequency.value !== 1500 &&
				player.state === "started"
			) {
				player.connect(HighpassFilter);
			} else {
				player.disconnect(HighpassFilter);
			}
		} catch (error) {
			console.log("error");
		}
	};
	// Apply Looped playback
	const toggleLoop = () => {
		try {
			const newLoopValue = !loop;
			setLoop(newLoopValue);
			if (player) {
				player.loop = !loop;
			}
		} catch (error) {
			console.log("error");
		}
	};
	// Change the decay value
	const changeDecayValue = (decay_value: number) => {
		try{

		
			setDecayValue(decay_value);
			if (reverb) {
				reverb.decay = decay_value;
			}
			if (reverb.decay !== 0 && player.state === "started") {
				player.connect(reverb);
			} else {
				player.disconnect(reverb);
			}
		}catch(error)
		{
			console.log("error");
		}
	};
	// change the decay value
	const changeWetValue = (wet_value: number) => {
		try {
			setWetValue(wet_value);
			if (reverb) {
				reverb.wet.value = wet_value;
			}
			if (reverb.preDelay !== 0) {
				console.log("nothing");
			} else if (reverb.decay !== 0) {
				console.log("nothing");
			} else if (reverb.wet.value !== 0 && player.state === "started") {
				player.connect(reverb);
			} else {
				player.disconnect(reverb);
			}
		} catch (error) {
			console.log("error");
		}
	};
	// change the predelay value
	const preDelayValue = (pre_delay: number) => {
		try {
			setPreDelay(pre_delay);
			if (reverb) {
				reverb.preDelay = pre_delay;
			}
			if (reverb.wet.value !== 0) {
				console.log("nothing");
			} else if (reverb.decay !== 0) {
				console.log("nothing");
			} else if (reverb.preDelay !== 0 && player.state === "started") {
				player.connect(reverb);
			} else {
				player.disconnect(reverb);
			}
		} catch (error) {
			console.log("error");
		}
	};
	// toggle on/off ping pong delay effect
	const isChecked = () => {
		try {
			const newValue = !check;
			setCheck(newValue);

			if (newValue === true && player.state === "started") {
				player.connect(ping_pong);
			} else {
				player.disconnect(ping_pong);
				ping_pong.dispose();
			}
		} catch (error) {
			console.log("error");
		}
	};
	const changeWidth = (width: NormalRange) => {
		try {
			if (stereoWidener) {
				setWidth(width);
				stereoWidener.width.value = width;
			}
			if (
				stereoWidener.width.value !== (0.5 as NormalRange) &&
				player.state === "started"
			) {
				console.log("we are changing width");
				player.connect(stereoWidener);
			} else {
				player.disconnect(stereoWidener);
			}
		} catch (error) {
			console.log("error");
		}
	};

	return (
		<div id='player'>
			<div id='audio-file-input' className='container'>
				<input
					type='file'
					accept='audio/*'
					ref={fileInputRef}
					onChange={handleFileChange}
				/>
				{fileError && <span className='error'>{fileError}</span>}
				{selectedFile && (
					<>
						<button onClick={startPlayback}>Play</button>
						<button onClick={stopPlayback}>Stop</button>
					</>
				)}
			</div>
			<div id='sliders' className='container'>
				<label>
					Playback Speed
					<input
						type='range'
						className="slider"
						step='0.1'
						min='0'
						max='2.0'
						value={playbackRate}
						onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
					/>
				</label>
				<label>
					Distortion
					<input
						type='range'
						className="slider"
						step='0.01'
						min='0'
						max='1'
						value={distortion}
						onChange={(e) => changeDistortionValue(parseFloat(e.target.value))}
					></input>
				</label>

				<label>
					Volume
					<input
						type='range'
						className="slider"
						step='1'
						min='-20'
						max='20'
						value={volume}
						onChange={(e) => changeVolume(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Lowpass
					<input
						type='range'
						className="slider"
						step='2'
						min='10'
						max='20000'
						value={frequency}
						onChange={(e) => changeFrequency(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Highpass
					<input
						type='range'
						className="slider"
						step='2'
						min='10'
						max='20000'
						value={high_frequency}
						onChange={(e) => changeFilterFrequency(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Loop
					<Toggle isChecked={check} toggleChecked={isChecked} />
				</label>
				<label>
					Decay
					<input
						type='range'
						className="slider"
						min='0'
						step='0.1'
						max='10'
						value={decay_value}
						onChange={(e) => changeDecayValue(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Wetness
					<input
						type='range'
						className="slider"
						min='0'
						max='1'
						step='0.01'
						value={wet_value}
						onChange={(e) => changeWetValue(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Pre Delay
					<input
						type='range'
						className="slider"
						min='0'
						max='1'
						step='0.01'
						value={pre_delay}
						onChange={(e) => preDelayValue(parseFloat(e.target.value))}
					></input>
				</label>
				<label>
					Ping Pong
					<Toggle isChecked={loop} toggleChecked={toggleLoop} />
				</label>
				<label>
					Stereo Widener
					<input
						type='range'
						className="slider"
						step='0.1'
						min='0.0'
						max='1.0'
						value={width}
						onChange={(e) => changeWidth(parseFloat(e.target.value))}
					/>
				</label>
				<label>
					Seek
					<input
						type='range'
						className="slider"
						step='0.1'
						min='0'
						max={player.loaded ? player.buffer.duration : 0}
						value={currentTime}
						onChange={handleSliderChange}
					/>
				</label>
			</div>
		</div>
	);
};
export { Player };

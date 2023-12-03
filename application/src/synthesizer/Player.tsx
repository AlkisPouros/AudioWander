import React, { useRef, useState } from 'react';
import * as Tone from "tone";
import { Decibels } from "tone/build/esm/core/type/Units";
import Audio from './Audio'

/**
 * @author Alkis Pouros
 * Player component which renders all the elements and supports the all functionality for the main audio player 
 */

const Player = () => {
        
        /** We have all the necessary hook functions and state values needed for checking state and values
         * of the nodes initialized and imported from the Audio component
         * */ 
    
        const fileInputRef = useRef<HTMLInputElement>(null);
        const {player,dist,filter,HighpassFilter,destinationNode,reverb,ping_pong,sfx_players} = Audio;
        const [isPlaying, setIsPlaying] = useState(false);
	    const [playbackRate, setPlaybackRate] = useState(1);
	    const [distortion, setValue] = useState(0);
	    const [volume, setVolume] = useState(0);
	    const [frequency, setFrequency] = useState(350);
	    const [high_frequency, setHighFrequency] = useState(1500);
	    const [loop, setLoop] = useState(false);
        // if a file is selected then the start/stop button element are rendered
        // if a user decided afterwads to cancel any file upload action and clicks start/stop then an error msessage spawns
	    const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [decay_value, setDecayValue] = useState(0);
	    const [wet_value, setWetValue] = useState(0);
	    const [pre_delay, setPreDelay] = useState(0);
        // if there is a file error (which means no audio selected) then a message spawns, otherwise everything is ok  
	    const [fileError, setFileError] = useState<string | null>(null); 
	    const [check, setCheck] = useState(false);

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
                console.log(file);
                player.dispose();
    
                await player.load(URL.createObjectURL(file));
            } else {
                setFileError("No source audio file added");
            }
        };

        // The startPlayback function is called when user clicks "Start"
        const startPlayback = () => {
            // check if there is not a file in the buffer (file upload) right now, so user doen't have the right of any action given
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
    
                // Chain effects to the player and destination
                // The effects are applied according with the following order
                player.connect(filter);
                player.connect(HighpassFilter);
                filter.connect(dist);
                HighpassFilter.connect(dist);
                dist.connect(reverb);
                reverb.connect(destinationNode);
                sfx_players.forEach((player)=>{
                    player.connect(destinationNode);
                })
                
    
                // Start playback when the user clicks "Play"
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
                sfx_players.forEach((player)=>{
                    player.stop();
                    player.disconnect();   
                })
                player.stop();
                setIsPlaying(false);
            }
        };
        // The speed is being changed and updates the change  
        const changePlaybackRate = (speed: number) => {
            setPlaybackRate(speed);
            if (player) {
                player.playbackRate = speed;
            }
        };
        // the distortion value is being changed
        // Usually a value between 0 and 1
        const changeDistortionValue = (amount: number) => {
            setValue(amount);
            if (dist) {
                dist.distortion = amount;
            }
        };
        // Change the volume using rampTo, which performs the increase/decrease of the in 0.1 secs.
        const changeVolume = (sound: Decibels) => {
            setVolume(sound);
            if (player) {
                player.volume.rampTo(sound, 0.1);
            }
        };
        // Apply change to lowpass frequency value
        const changeFrequency = (freq: number) => {
            setFrequency(freq);
            if (filter) {
                // Set the filter frequency to the new value
                filter.frequency.rampTo(freq, 0.1);
    
                console.log(filter.frequency.value);
            }
        };
        // Apply change to Highfrrequency value
        const changeFilterFrequency = (freq: number) => {
            setHighFrequency(freq);
    
            if (HighpassFilter) {
                HighpassFilter.frequency.rampTo(freq, 0, 1);
                console.log(HighpassFilter.frequency.value);
            }
        };
        // Check is player is looped
        const toggleLoop = () => {
            const newLoopValue = !loop;
            setLoop(newLoopValue);
            if (player) {
                player.loop = !loop;
            }
        };
        // Chnange the decay value
        const changeDecayValue = (decay_value: number) => {
            setDecayValue(decay_value);
            if (reverb) {
                reverb.decay = decay_value;
            }
        };
        // change the decay va;ue
        const changeWetValue = (wet_value: number) => {
            setWetValue(wet_value);
            if (reverb) {
                reverb.wet.value = wet_value;
            }
        };
        // change the predelay value
        const preDelayValue = (pre_delay: number) => {
            setPreDelay(pre_delay);
            if (reverb) {
                reverb.preDelay = pre_delay;
            }
        };
        // toggle on/off ping pong delay effect
        const isChecked = () => {
            const newValue = !check;
            setCheck(newValue);
            
            if(newValue === true && player.state === "started")
            {
                player.connect(ping_pong);
                
            } else {
                player.disconnect(ping_pong);
                ping_pong.dispose();
            }
            
            
        }
    return(
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
					onChange={(e) => preDelayValue(parseFloat(e.target.value))}></input>
			</label>
            <label>
				Ping Pong Delay:
				<input type='checkbox' checked={check} onChange={(e)=>isChecked()}></input>
			</label>
        </div>

    );
}
export {Player}
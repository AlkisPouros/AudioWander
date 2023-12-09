import React, { useRef, useState } from 'react';
import Audio from './Audio';
import { Analyser } from 'tone';


/**
 * 
 * @author Alkis Pouros 
 * sfx players component which renders all the elements and supports the all functionality for the secondary audio players
 */

const SFXPlayers = () => {

	/** We have all the necessary hook functions and state values needed for checking state and values
     *  of the nodes initialized and imported from the Audio component
	 *  Same as Players component 
    * */ 
    const playersFileInputRef = useRef<HTMLInputElement>(null);
    const {initializePlayers,createSFXPlayer,startPlayers,stopPlayers} = Audio;
  
    const [arePlayersPlaying, setArePlayersPlaying] = useState(false);
    const [playersSelectedFile, setPlayersSelectedFile] = useState<File[] | null>(null);
    const [playersFileError, setPlayersFileError] = useState<string | null>(null);
	
	/**
	 * 
	 * asynchronous function which handles input file upload events and inside desposes any previous player setups
     * then you can load the file parsed as a url on the player
     * This is done because of the need to handle file upload even when other functions are executing
	 */
    const handleSFXFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;

		if (files && files.length > 0) {
			const newFiles = Array.from(files);
			const validAudioFiles = newFiles.filter((file) =>
				// filter audio only files from file array into a new one, validAudioFiles
				file.type.startsWith("audio/")
			);
			if (validAudioFiles.length > 0) {
				// There is no error valid files are uploaded
				setPlayersFileError(null);
				

				// Dispose of previous players
				setPlayersFileError(null);

				// Dispose of previous players
				initializePlayers();
				
				
				//upload files
				createSFXPlayer(validAudioFiles);
				setPlayersSelectedFile(validAudioFiles);
			}
		} else {
			// Update the error state 
			setPlayersFileError("No source audio file added");
		}
	};
	/**
	 * 
	 * Start and stop players playback using sthe start players function from the Audio component 
	 * and passing all the state and function state parameters inside 
	 */
	const startPlayersPlayback = () => {
		startPlayers(playersFileInputRef, setPlayersFileError as React.Dispatch<React.SetStateAction<String | null>>, arePlayersPlaying, setArePlayersPlaying as React.Dispatch<React.SetStateAction<boolean | null>>);
	};

	const stopPlayersPlayback = () => {
		stopPlayers(arePlayersPlaying, setArePlayersPlaying as React.Dispatch<React.SetStateAction<boolean | null>>);
	};
	return(
		<div>
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
		</div>

	);

}
export {SFXPlayers};
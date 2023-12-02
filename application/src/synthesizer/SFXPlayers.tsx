import React, { useRef, useState } from 'react';
import Audio from './Audio';

const SFXPlayers = () => {
    const playersFileInputRef = useRef<HTMLInputElement>(null);
    const {initializePlayers,createSFXPlayer,startPlayers,stopPlayers} = Audio;
  
    const [arePlayersPlaying, setArePlayersPlaying] = useState(false);
    const [playersSelectedFile, setPlayersSelectedFile] = useState<File | null>(null);
    const [playersFileError, setPlayersFileError] = useState<string | null>(null);

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
				

				// Dispose of previous players
				setPlayersFileError(null);

				// Dispose of previous players
				initializePlayers();

				//upload files
				createSFXPlayer(validAudioFiles);
				setPlayersSelectedFile(validAudioFiles[0]);
			}
		} else {
			setPlayersFileError("No source audio file added");
		}
	};

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
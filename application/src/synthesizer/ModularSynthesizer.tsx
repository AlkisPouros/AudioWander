import React, { useRef, useState } from "react";
import Audio from "./Audio";
import { Player } from "./Player";
import * as Tone from "tone";

/**
 *
 * @author Alkis Pouros
 * sfx players component which renders all the elements and supports the all functionality for the secondary audio players
 */

const ModularSynthesizer = () => {
	/** We have all the necessary hook functions and state values needed for checking state and values
	 *  of the nodes initialized and imported from the Audio component
	 *  Same as Players component
	 * */
	const playersFileInputRef = useRef<HTMLInputElement>(null);
	const { createSFXPlayer, startPlayers, stopPlayers } = Audio;

	const [isPlayer1Playing, setPlayer1Playing] = useState(false);
	const [isPlayer2Playing, setPlayer2Playing] = useState(false);
	const [isPlayer3Playing, setPlayer3Playing] = useState(false);
	const [isPlayer4Playing, setPlayer4Playing] = useState(false);

	const [player1SelectedFile, setPlayer1SelectedFile] = useState<File | null>(
		null
	);
	const [player2SelectedFile, setPlayer2SelectedFile] = useState<File | null>(
		null
	);
	const [player3SelectedFile, setPlayer3SelectedFile] = useState<File | null>(
		null
	);
	const [player4SelectedFile, setPlayer4SelectedFile] = useState<File | null>(
		null
	);

	const [playerFileError, setPlayerFileError] = useState<string | null>(null);

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
			const file = files[0];
			const validfile = file.type.startsWith("audio/");
			if (validfile) {
				// There is no error valid files are uploaded
				setPlayerFileError(null);

				//upload files
				if (Audio.sfx_player1.state !== "started") {
					setPlayer1SelectedFile(file);
					try {
						// Wait for the player to be created and loaded
						Audio.sfx_player1 = await createSFXPlayer(Audio.sfx_player1, file);
					} catch (error) {
						console.error("Error creating/loading audio player", error);
					}
				}
				if (Audio.sfx_player1 && Audio.sfx_player2.state !== "started") {
					setPlayer2SelectedFile(file);

					try {
						// Wait for the player to be created and loaded
						Audio.sfx_player2 = await createSFXPlayer(Audio.sfx_player2, file);
					} catch (error) {
						console.error("Error creating/loading audio player", error);
					}
				}
				if (
					Audio.sfx_player1 &&
					Audio.sfx_player2 &&
					Audio.sfx_player3.state !== "started"
				) {
					setPlayer3SelectedFile(file);
					try {
						// Wait for the player to be created and loaded
						Audio.sfx_player3 = await createSFXPlayer(Audio.sfx_player3, file);
					} catch (error) {
						console.error("Error creating/loading audio player", error);
					}
				}
				if (
					Audio.sfx_player1 &&
					Audio.sfx_player2 &&
					Audio.sfx_player3 &&
					Audio.sfx_player4.state !== "started"
				) {
					console.log("hello");
					setPlayer4SelectedFile(file);
					try {
						// Wait for the player to be created and loaded
						Audio.sfx_player4 = await createSFXPlayer(Audio.sfx_player4, file);
					} catch (error) {
						console.error("Error creating/loading audio player", error);
					}
				}
			}
		} else {
			// Update the error state
			setPlayerFileError("No source audio file added");
		}
	};
	/**
	 *
	 * Start and stop players playback using sthe start players function from the Audio component
	 * and passing all the state and function state parameters inside
	 */
	const startPlayersPlayback = () => {
		startPlayers(
			playersFileInputRef,
			setPlayerFileError as React.Dispatch<React.SetStateAction<String | null>>,
			isPlayer1Playing,
			isPlayer2Playing,
			isPlayer3Playing,
			isPlayer4Playing,
			setPlayer1Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer2Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer3Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer3Playing as React.Dispatch<React.SetStateAction<boolean | null>>
		);
	};

	const stopPlayersPlayback = () => {
		stopPlayers(
			playersFileInputRef,
			setPlayerFileError as React.Dispatch<React.SetStateAction<String | null>>,
			isPlayer1Playing,
			isPlayer2Playing,
			isPlayer3Playing,
			isPlayer4Playing,
			setPlayer1Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer2Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer3Playing as React.Dispatch<React.SetStateAction<boolean | null>>,
			setPlayer4Playing as React.Dispatch<React.SetStateAction<boolean | null>>
		);
	};
	return (
		<div>
			<Player stopPlayersPlayback={stopPlayersPlayback} />
			<label>
				Add SFX:
				{playerFileError && <p style={{ color: "red" }}>{playerFileError}</p>}
				<input
					type='file'
					accept='audio/*'
					ref={playersFileInputRef}
					onChange={handleSFXFileChange}
				></input>
				{(player1SelectedFile ||
					player2SelectedFile ||
					player3SelectedFile ||
					player4SelectedFile) && (
					<>
						<button onClick={startPlayersPlayback}>Start sfx</button>
						<button onClick={stopPlayersPlayback}>Stop sfx</button>
					</>
				)}
			</label>
		</div>
	);
};
export { ModularSynthesizer };

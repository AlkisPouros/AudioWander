import * as Tone from "tone";
import { RecorderProxy } from "../audio/Recorder";

/**
 * @author Alkis Pouros
 * The Audio component is nessesary for the linking of the player and sfx player component
 * as its functionality is also used inside the player function. It also initializes all the neccessary node objects.
 * */

const Audio = {
	player: new Tone.Player().toDestination(), // Main player node
	dist: new Tone.Distortion().toDestination(), // Distortion node, it sets the amount of distortion the sound
	filter: new Tone.Filter(350, "lowpass").toDestination(), // Lowpass filter sets a lower limit for lower frequencies to pass through, the higher the value the more information will pass
	HighpassFilter: new Tone.Filter(1500, "highpass").toDestination(), // Highpass filter is the quite opposite of the lowpass filter
	reverb: new Tone.Reverb().toDestination(), // reverb node is an effect which applies as an echo/delay one from the web audio api as with the decay/predelay values it does exactly the same and with wet value it makes the sound more fluid enchancing the echo effect
	ping_pong: new Tone.PingPongDelay().toDestination(), //ping pong allows the source audio to be echoed left and right (with a certain amount of delay and wetness) like a ping pong ball.
	analyser: new Tone.Waveform(256).toDestination(),
	stereoWidener: new Tone.StereoWidener(0.5).toDestination(),
	sfx_player1: new Tone.Player().toDestination(),
	sfx_player2: new Tone.Player().toDestination(),
	sfx_player3: new Tone.Player().toDestination(),
	sfx_player4: new Tone.Player().toDestination(),

	/**
	 *
	 * asynchronous function which accepts an array of audio files and returns a promise object
	 * which uses the now filled file table to load the player into the sfx_player array after parsing
	 * the file name as a url
	 */
	createSFXPlayer: async (player: Tone.Player, file: File) => {
		try {
			player = new Tone.Player().toDestination();
			RecorderProxy.connectToRecorder(player);
			await player.load(URL.createObjectURL(file));
			console.log(URL.createObjectURL(file));
			return player; // Return the player after loading
		} catch (error) {
			console.error("error loading audio file");
			throw error; // Propagate the error
		}
	},
	// start players by using/updating the neccessary paremeters to check the state, following the Players.tsx logic
	startPlayers: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		isPlayer2Playing: boolean,
		isPlayer3Playing: boolean,
		isPlayer4Playing: boolean,
		setPlayer1Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer2Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer3Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer4Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		Tone.start();
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before starting");
			return;
		}

		if (!isPlayer1Playing && Audio.sfx_player1) {
			setPlayerFileError(null);
			// Start sfx_player1
			(Audio.sfx_player1 as Tone.Player).start();
			setPlayer1Playing(true);
		}
		if (
			isPlayer1Playing &&
			!isPlayer2Playing &&
			Audio.sfx_player2 &&
			Audio.sfx_player2.buffer !== null
		) {
			console.log("sneaked in");
			setPlayerFileError(null);
			// Start sfx_player2
			(Audio.sfx_player2 as Tone.Player).start();
			setPlayer2Playing(true);
		}
		if (
			isPlayer1Playing &&
			isPlayer2Playing &&
			!isPlayer3Playing &&
			Audio.sfx_player3 &&
			Audio.sfx_player3.buffer !== null
		) {
			console.log("sneaked in");
			setPlayerFileError(null);
			// Start sfx_player3
			(Audio.sfx_player3 as Tone.Player).start();
			setPlayer3Playing(true);
		}
		if (
			isPlayer1Playing &&
			isPlayer2Playing &&
			isPlayer3Playing &&
			!isPlayer4Playing &&
			Audio.sfx_player4 &&
			Audio.sfx_player4.buffer !== null
		) {
			setPlayerFileError(null);
			// Start sfx_player4
			(Audio.sfx_player4 as Tone.Player).start();
			setPlayer4Playing(true);
		}
	},
	stopPlayer1: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		setPlayer1Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before stopping");
			return;
		}

		if (isPlayer1Playing && Audio.sfx_player1) {
			(Audio.sfx_player1 as Tone.Player).stop();
			Audio.sfx_player1.disconnect();
			setPlayer1Playing(false);
		}
	},
	stopPlayer2: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		isPlayer2Playing: boolean,
		setPlayer2Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before stopping");
			return;
		}
		if (
			!isPlayer1Playing &&
			isPlayer2Playing &&
			Audio.sfx_player2 &&
			Audio.sfx_player2.buffer !== null
		) {
			(Audio.sfx_player2 as Tone.Player).stop();
			Audio.sfx_player2.disconnect();
			setPlayer2Playing(false);
		}
	},
	stopPlayer3: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		isPlayer2Playing: boolean,
		isPlayer3Playing: boolean,
		setPlayer3Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before stopping");
			return;
		}

		if (
			isPlayer1Playing &&
			isPlayer2Playing &&
			!isPlayer3Playing &&
			Audio.sfx_player3 &&
			Audio.sfx_player3.buffer !== null
		) {
			console.log("sneaked in");
			// Start sfx_player3
			(Audio.sfx_player3 as Tone.Player).stop();
			Audio.sfx_player3.disconnect();
			setPlayer3Playing(false);
		}
	},
	stopPlayer4: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		isPlayer2Playing: boolean,
		isPlayer3Playing: boolean,
		isPlayer4Playing: boolean,
		setPlayer4Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before stopping");
			return;
		}
		if (
			!isPlayer4Playing &&
			isPlayer1Playing &&
			isPlayer2Playing &&
			isPlayer3Playing
		)
			if (
				isPlayer1Playing &&
				isPlayer2Playing &&
				isPlayer3Playing &&
				!isPlayer4Playing &&
				Audio.sfx_player4 &&
				Audio.sfx_player4.buffer !== null
			) {
				// stop sfx_player4
				(Audio.sfx_player4 as Tone.Player).stop();
				Audio.sfx_player3.disconnect();
				setPlayer4Playing(false);
			}
	},

	// stop players by using/updating the neccessary paremeters to check the state, following the Players.tsx logic
	stopPlayers: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayerFileError: React.Dispatch<React.SetStateAction<String | null>>,
		isPlayer1Playing: boolean,
		isPlayer2Playing: boolean,
		isPlayer3Playing: boolean,
		isPlayer4Playing: boolean,
		setPlayer1Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer2Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer3Playing: React.Dispatch<React.SetStateAction<boolean | null>>,
		setPlayer4Playing: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayerFileError("Please select an audio file before stopping");
			return;
		}
		if (
			isPlayer1Playing ||
			isPlayer2Playing ||
			isPlayer3Playing ||
			isPlayer4Playing
		) {
			// Forcibly stop and disconnect the players
			Audio.sfx_player1?.stop();
			Audio.sfx_player2?.stop();
			Audio.sfx_player3?.stop();
			Audio.sfx_player4?.stop();

			Audio.sfx_player1?.disconnect();
			Audio.sfx_player2?.disconnect();
			Audio.sfx_player3?.disconnect();
			Audio.sfx_player4?.disconnect();

			setPlayer1Playing(false);
			setPlayer2Playing(false);
			setPlayer3Playing(false);
			setPlayer4Playing(false);
		}
	},
};

export default Audio;

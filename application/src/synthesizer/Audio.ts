import * as Tone from "tone";
import { SFXPlayers } from "./SFXPlayers";

/**
 * @author Alkis Pouros
 * The Audio component is nessesary for the linking of the player and sfx player component
 * as its functionality is also used inside the player function. It also initializes all the neccessary node objects.
 * */

const sfx_players: Tone.Player[] = []; //An array of independant players needed to upload other sound files (special sound effects) linked to the same destination as the main player

const Audio = {
	player: new Tone.Player().toDestination(), // Main player node
	dist: new Tone.Distortion().toDestination(), // Distortion node, it sets the amount of distortion the sound
	filter: new Tone.Filter(350, "lowpass").toDestination(), // Lowpass filter sets a lower limit for lower frequencies to pass through, the higher the value the more information will pass
	HighpassFilter: new Tone.Filter(1500, "highpass").toDestination(), // Highpass filter is the quite opposite of the lowpass filter
	destinationNode: new Tone.Gain().toDestination(), // Gain node serves as connection point to the output and destination node where upcoming audio signals are "coming together" at a certain volume.
	reverb: new Tone.Reverb().toDestination(), // reverb node is an effect which applies as an echo/delay one from the web audio api as with the decay/predelay values it does exactly the same and with wet value it makes the sound more fluid enchancing the echo effect
	ping_pong: new Tone.PingPongDelay().toDestination(), //ping pong allows the source audio to be echoed left and right (with a certain amount of delay and wetness) like a ping pong ball.
	analyser: new Tone.Waveform(256),
	mainAnalyser : new Tone.Analyser(),
	sfx_players,
	/**
	 * initialize the sfx players here
	 */
	initializePlayers: () => {
		Audio.sfx_players.forEach((player) => player.dispose());
		Audio.sfx_players.length = 0;
	},
	/**
	 *
	 * asynchronous function which accepts an array of audio files and returns a promise object
	 * which uses the now filled file table to load the players into the sfx_players array after parsing
	 * the file name as a url
	 */
	createSFXPlayer: async (file: File[]) => {
		await Promise.all(
			file.map(async (file, index) => {
				const player = new Tone.Player().toDestination();
				await player.load(URL.createObjectURL(file));
				Audio.sfx_players.push(player);
			})
		);
	},
	// start players by using/updating the neccessary paremeters to check the state, following the Players.tsx logic
	startPlayers: (
		playersFileInputRef: React.RefObject<HTMLInputElement>,
		setPlayersFileError: React.Dispatch<React.SetStateAction<String | null>>,
		arePlayersPlaying: boolean,
		setArePlayersPlaying: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (!playersFileInputRef.current?.value) {
			setPlayersFileError("Please select an audio file before starting");
			return;
		}

		if (!SFXPlayers || !arePlayersPlaying || !Audio.sfx_players) {
			// Start Tone.js and players within the same user-initiated event
			Tone.start();
			setPlayersFileError(null);
			// Start the players
			Audio.sfx_players.forEach((player) => {
				if (player.state !== "started" || !Audio.sfx_players) {
					console.log();
					player.start();
				}
			});

			setArePlayersPlaying(true);
		}
	},
	// stop players by using/updating the neccessary paremeters to check the state, following the Players.tsx logic
	stopPlayers: (
		arePlayersPlaying: boolean,
		setArePlayersPlaying: React.Dispatch<React.SetStateAction<boolean | null>>
	) => {
		if (sfx_players || arePlayersPlaying || Audio.sfx_players) {
			// Stop and disconnect the players
			Audio.sfx_players.forEach((player) => {
				player.stop();
				player.disconnect();
			});

			setArePlayersPlaying(false);
		}
	},
};

export default Audio;

import * as Tone from 'tone';

const sfx_players: Tone.Player[] = [];
const Audio = {
  player: new Tone.Player().toDestination(),
  dist: new Tone.Distortion().toDestination(),
  filter: new Tone.Filter(350, 'lowpass').toDestination(),
  HighpassFilter: new Tone.Filter(1500, 'highpass').toDestination(),
  destinationNode: new Tone.Gain().toDestination(),
  reverb: new Tone.Reverb().toDestination(),
  ping_pong : new Tone.PingPongDelay().toDestination(),

  sfx_players,

  initializePlayers: () => {
    Audio.sfx_players.forEach((player) => player.dispose());
    Audio.sfx_players.length = 0;
  },

  createSFXPlayer: async (file: File[]) => {

        await Promise.all(
            file.map(async (file, index) => {
            const player = new Tone.Player().toDestination();
            await player.load(URL.createObjectURL(file));
            Audio.sfx_players.push(player);
         }));
  },

  startPlayers: (playersFileInputRef: React.RefObject<HTMLInputElement>,setPlayersFileError: React.Dispatch<React.SetStateAction<String | null>>, arePlayersPlaying: boolean, setArePlayersPlaying: React.Dispatch<React.SetStateAction<boolean | null>>) => {
    //Tone.start();
    if (!playersFileInputRef.current?.value) {
        setPlayersFileError("Please select an audio file before starting");
        return;
    }

    if (!arePlayersPlaying || !Audio.sfx_players) {
        // Start Tone.js and players within the same user-initiated event
        Tone.start();
        setPlayersFileError(null);
        // Start the players
        //The code is to be completed
        Audio.sfx_players.forEach((player) => {
            if (player.state !== "started" || !Audio.sfx_players) {
                player.start();
            }
        });

        setArePlayersPlaying(true);
    }
  },

  stopPlayers: (arePlayersPlaying: boolean, setArePlayersPlaying : React.Dispatch<React.SetStateAction<boolean | null>>) => {
    if (arePlayersPlaying || Audio.sfx_players) {
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
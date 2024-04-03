# AudioWander

## Installation Instructions
### Before starting, make sure NodeJS is installed
* Go to https://nodejs.org/en.
* Click on “20.10.0 LTS”, or any other recent LTS (long term support) version.
* Follow the instructions to install the NodeJS runtime.
* Ensure that the executing the `npm -v` command in a terminal correctly prints the version
number (e.g. “8.19.3”) and does not print an error message.
o If an error occurs add the `npm` executable to path or copy full path to the `npm`
executable and run it this way.

### Development Environment
1. Install any text editor or IDE:
   - To install Visual Studio Code, go to https://code.visualstudio.com/ and follow the
instructions on the website.
   - Other alternatives include:
          - Notepad++ (free usage): https://notepad-plus-plus.org/
          - Webstorm (paid usage): https://www.jetbrains.com/webstorm

### Execution Environment
1.  Download the source code and unzip it if necessary
2.  Open a terminal in the application directory inside the AudioWander directory.
3.  Execute the `npm install` command.
4.  Execute the `npm start` command. A chrome tab with the application should open.

## Use Cases

* Recording
  * Record Audio
    * Click `Start Recording`
    * Play some music either from the drumkit, the synthesizer, or both.
    * Click `Stop Recording`.
  * Delete a recording
    * Click `X`.
  * Rename a recording:
    * Click `Rename`.
    * Type the desired name.
    * Click `Rename` again.
  * Download a recording:
    * Click the link (visible when not renaming). The download should start
      immediately.

* Drumkit:
  * Adding an instrument:
    * Type an instrument name.
    * Choose an audio file.
  * Preview selected audio file:
    * Click `Preview`.
  * Resolve any errors which may arise (invalid name and/or invalid file).
    * Click `Submit`.
  * Specify when an (already added) instrument will play:
    * Click in a purple box in the instrument’s row.
    * The box will become Bordeaux, indicating that the instrument will play on that
      beat.
    * Click again to change back to purple, indicating that the instrument will not play
on that beat.
  * Change bar structure:
    * Click `+` or `-` under each of the `Bars`, `Beats` or `Subs` labels.
    * Alternatively, click the existing value and type a new value.
  * Change BPM:
    * Click `+` or `-` under the “BPM” label.
    * Alternatively, click the existing value and type a new value.
  * Drumkit Playback:
    * Start
      * Click `Start Drumkit`.
      * Performing any of the above actions will take effect immediately, without
the need to stop and restart the drumkit.
    * Stop
      * Click `Stop Drumkit`.
* Synthesizer:
  * Audio playback:
    * Upload audio:
      * Click `Choose File`.
    * Start Playback:
      * Once audio file is uploaded click `start` to start playback.
      * If you want to upload another file and click `start` or `stop`, an error
message will appear.
   * Apply effects:
     * Once audio has started select one or more effects through the respective sliders.
  * Apply Special Sound Effects:
     * Upload audio Files:
       * Click `Choose File` just beside the `Add SFX` label.
     * Start Playback:
       * Once the audio file is uploaded click `start` to start playback for each
player.
  * Stop Playback:
    * Stop each player using one of the 4 stop buttons rendered in accordance
      to the sequence in which the files are uploaded. A numbered list will
      appear on the left displaying the audio files which are playing.
    * If the main player is stopped, all sfx players will stop as well.
   
* Visualization:
  * Once the main player starts, a canvas will be rendered, and the waveform
    visualisation will start. Any effects or special effects applied will have an impact
    on the visualization.
  * If the playback ends or stops which means that the analyzer node will stop
    receiving any frequency data, the waveform will stop immediately.
    
## High Level Documentation
The Drumkit component consists of four different components:
* The InstrumentForm, which allows the user to upload audio files to create new instruments,
* The MetadataController, which allows the user to change the Loop data (the bpm and the bar
  structure),
* The Drumkit itself, which allows the user to specify at which points in time each instrument will
  play, and
* The DrumkitController, which allows the user to start and stop the Drumkit.
  
The Drumkit component aggregates the rest, and passes to each of them the required dependencies, and
functions to update the Drumkit’s state. The Drumkit’s state consists of:
* The instruments the user has added,
* The metadata of the drum loop (bpm, bar structure),
* The data of the drum loop (when each instrument will play), and
* The state of the drum kit (playing or stopped).
  
The Recorder component consists of three different components:
* The DownloadList, which allows the user to download and manage their recordings,
* The RecorderController, which allows the user to start and stop the Recorder, and
* The Recorder itself, which allows the user to record the output of the application and then
download as an audio file.

The Recorder component aggregates the rest, and passes to each of them the required dependencies, and
functions to update the Recorder’s state. The Recorder’s state consists of:
* The collection of the user’s recordings, and
* The state of the recorder (recording or stopped).

The synthesizer part of the project does exactly what a digital web synth is supposed to. It accepts an audio
sample (audio file) as an audio source, applies frequency filters (lowpass and highpass), as well as other
effects offered by the Tone.js library and passes the data to the destination node which is the output for
our audio. An analyzer node is also used for the visualization of the sound (frequency based).

## Software and Technologies used

Software used during development:
* Chrome browser + dev tools, Brave browser + dev tools
* Visual Studio Code + extensions
* Git and Github
  
Technologies used to create the application:
* Programming Languages: Typescript, JSX, CSS
* JavaScript framework: React.js
* Libraries: WebAudio, ToneJS

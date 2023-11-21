import React from 'react';
import {useRef, useState} from 'react';

let animationController; //to be changed

function App() {
  const [file, setFile] = useState<File | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const source = React.useRef<MediaElementAudioSourceNode | null>(null);
  const analyser = React.useRef<AnalyserNode | null>(null);
  


  const handleAudioPlay = () => {
    
    let audioContext;
    if(!audioContext && audioRef.current && !source.current)
    {
      audioContext = new AudioContext();
      source.current = audioContext.createMediaElementSource(audioRef.current);
      analyser.current = audioContext.createAnalyser();
      source.current.connect(analyser.current);
      source.current.connect(audioContext.destination);
    }
    visualizeData();
  };
  
  const visualizeData = () => {
    animationController = window.requestAnimationFrame(visualizeData);
    
    if (!audioRef.current || audioRef.current.paused   || audioRef.current.ended)
    {
      cancelAnimationFrame(animationController);
      return;
    }
    const songData = new Uint8Array(140);
    if (!analyser.current) return; else analyser.current.getByteFrequencyData(songData);
    const bar_width = 3;
    let start = 0;
    if(!canvasRef.current) {return;} 
    const ctx = canvasRef.current?.getContext("2d");
    if(!ctx) {return;}
    ctx?.clearRect(0,0, canvasRef.current?.width, canvasRef.current?.height);
    for (let i = 0; i < songData.length; i++)
    {
      start = i*4;
      let gradient = ctx.createLinearGradient(0,0,canvasRef.current?.width,canvasRef.current?.height);
      gradient.addColorStop(0.2, "#2392f5");
      gradient.addColorStop(0.5, "#fe0095");
      gradient.addColorStop(1.0, "purple");
      ctx.fillStyle = gradient;
      ctx.fillRect(start,canvasRef.current?.height, bar_width, -songData[i]);
    }
    
  };

  return (
    
    <div className = "App">
      <input type = "file" onChange={({ target: { files }}) => {if (!files) return; files[0] && setFile(files[0])}}/>
      
      {file ? ( <><audio ref = {audioRef} onPlay = {handleAudioPlay} src = {window.URL.createObjectURL(file)} controls/> 
                <canvas ref = {canvasRef} width = {500} height = {400}/></>) : (<p>Select a file to start</p>)}
    </div>  
    
  );
}

export default App;
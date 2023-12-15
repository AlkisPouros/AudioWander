import { useRef, useEffect } from 'react';
import * as Tone from 'tone';


interface WaveformProps {
	analyser: Tone.Waveform;
    isPlaying: boolean;
    player: Tone.Player;
}

const WaveformVisualizer: React.FC< WaveformProps > = ({ analyser, isPlaying,player }) => {
    const waveformCanvasRef = useRef<HTMLElement | any>(null);

   

    
    const clearWaveformCanvas = () => {
            // Clear the waveform canvas
            const canvas = waveformCanvasRef.current;
            if (canvas) {
                const canvasContext = canvas.getContext("2d");
                if (canvasContext) {
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            
    };
    // clearing the canvas after user-triggered audio pause
    useEffect(() => {
      if (!isPlaying || player.state === 'stopped') {
          clearWaveformCanvas();
          console.log('Canvas cleared!');
      }
  }, [isPlaying,player]);

    useEffect(() => {
        
      const drawWaveform = () => {
        const canvas = waveformCanvasRef.current;
        if (!canvas) return;
  
        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) return;
  
        const waveform = analyser.getValue();
  
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.lineWidth = 2;
  
        const barWidth = canvas.width / waveform.length;
  
        const gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0.2, "#2392f5");
        gradient.addColorStop(0.5, "#fe0095");
        gradient.addColorStop(1.0, "purple");
        canvasContext.fillStyle = gradient;
  
        for (let i = 0; i < waveform.length; i++) {
          const x = i * barWidth;
          const bar_height = (waveform[i] + 1) / 2 * canvas.height;
  
          // Draw the bar with gradient color
          canvasContext.fillRect(x, canvas.height - bar_height, barWidth, bar_height);
        }
      };
      

      if (isPlaying) {
        const drawInterval = setInterval(drawWaveform, 30);
        
        return () => {
          clearInterval(drawInterval);
        };
      }
    }, [isPlaying, analyser]);
  
    return  <canvas ref={waveformCanvasRef} width={400} height={200}></canvas> 
            

};

export { WaveformVisualizer };  

import { useRef, useEffect } from "react";
import * as Tone from "tone";

import './WaveformVisualizer.css'

interface WaveformProps {
	analyser: Tone.Waveform;
	player: Tone.Player;
}

const WaveformVisualizer: React.FC<WaveformProps> = ({analyser,player}) => {
	const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		

		const drawWaveform = () => {
			const canvas = waveformCanvasRef.current;
			if (!canvas) return;
			if (player.state === "started") {
				const canvasContext = canvas.getContext("2d");
				if (!canvasContext) return;

				const waveform = analyser.getValue();
				canvasContext.clearRect(0, 0, canvas.width, canvas.height);
				canvasContext.lineWidth = 2;
				const barWidth = canvas.width / waveform.length;

				const gradient = canvasContext.createLinearGradient(0,0,0,canvas.height);
				gradient.addColorStop(0.2, "#2392f5");
				gradient.addColorStop(0.5, "#fe0095");
				gradient.addColorStop(1.0, "purple");
				canvasContext.fillStyle = gradient;

				for (let i = 0; i < waveform.length; i++) {
					const x = i * barWidth;
					const bar_height = ((waveform[i] + 1) / 2) * canvas.height;

					// Draw the bar with gradient color
					canvasContext.fillRect(x,canvas.height - bar_height,barWidth,bar_height);
				}
			}
		};
		
		const drawInterval = setInterval(drawWaveform, 30);

		return () => {
			clearInterval(drawInterval);
		};
	}, [player.state, analyser]);

	useEffect(() => {
		console.log(player.state);
	
		const clearWaveformCanvas = () => {
					
			const canvas = waveformCanvasRef.current;
				
			if (canvas && player.state === "stopped") {
				const canvasContext = canvas.getContext("2d");
				if (canvasContext) {
					canvasContext.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
				
		};
		const drawInterval = setInterval(clearWaveformCanvas, 30);
		return () => {
			clearInterval(drawInterval);
		};
	
	
	},[player.state])
	

	return (
		<div id="waveform-visualiser">
			<canvas ref={waveformCanvasRef}></canvas>
		</div>
	);
};

export { WaveformVisualizer };

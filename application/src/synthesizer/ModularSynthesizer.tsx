import AudioVisualizer from "./AudioVisualizer";
import { Player } from "./Player"
import { SFXPlayers } from "./SFXPlayers";

import React, { useState } from 'react'
/**
 * @author Alkis Pouros
 * Main Synthesizer component for everything regarding the main player, sfx players and visualizetion canvas 
 */

const ModularSynthesizer = () =>  { 
	

	
	return (
		<div>
			<Player/>
      		<SFXPlayers />
		</div>
	);
};

export { ModularSynthesizer };

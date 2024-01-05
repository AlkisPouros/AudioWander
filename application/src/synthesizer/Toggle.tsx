import React from "react";
import "./Toggle.css";

interface ToggleProps {
	loop: boolean;
	toggleLoop: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ loop, toggleLoop }) => {
	return (
		<div className='Toggle-Container' onClick={toggleLoop}>
			<div className={`toggle-btn ${!loop ? 'disabled' : ''}`}>
				{loop ? "ON" : "OFF"}
			</div>
		</div>
	);
};

export { Toggle };

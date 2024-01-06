import React from "react";
import "./Toggle.css";

interface ToggleProps {
	isChecked: boolean;
	toggleChecked: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isChecked, toggleChecked }) => {
	return (
		<div className='Toggle-Container' onClick={toggleChecked}>
			<div className={`toggle-btn ${!isChecked ? 'disabled' : ''}`}>
				{isChecked ? "ON" : "OFF"}
			</div>
		</div>
	);
};

export { Toggle };

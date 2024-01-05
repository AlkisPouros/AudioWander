import React from "react";
import "./Toggle2.css";

interface ToggleProps {
	check: boolean;
	isChecked: () => void;
}

const Toggle2: React.FC<ToggleProps> = ({ check, isChecked }) => {
	return (
		<div className='Toggle-Container' onClick={isChecked}>
			<div className={`toggle-btn ${!check ? 'disabled' : ''}`}>
				{check ? "ON" : "OFF"}
			</div>
		</div>
	);
};

export { Toggle2 };

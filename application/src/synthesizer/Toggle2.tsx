import React from "react";
import "./Toggle.css";

interface Toggle2Props {
	isChecked: boolean;
	toggleChecked: () => void;
}

const Toggle2: React.FC<Toggle2Props> = ({ isChecked, toggleChecked }) => {
	return (
		<div className='Toggle-Container' onClick={toggleChecked}>
			<div className={`toggle-btn ${!isChecked ? "disabled" : ""}`}>
				{isChecked ? "ON" : "OFF"}
			</div>
		</div>
	);
};

export { Toggle2 };

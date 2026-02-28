import React from 'react';
import './Toggle.css';

const Toggle = ({ options, activeOption, onChange, label }) => {
    return (
        <div className="toggle-wrapper">
            {label && <span className="toggle-label">{label}</span>}
            <div className="toggle-container">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`toggle-btn ${activeOption === option.value ? 'active' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
                <div
                    className="toggle-glider"
                    style={{
                        width: `${100 / options.length}%`,
                        left: `${Math.max(0, options.findIndex((opt) => opt.value === activeOption)) * (100 / options.length)}%`
                    }}
                />
            </div>
        </div>
    );
};

export default Toggle;

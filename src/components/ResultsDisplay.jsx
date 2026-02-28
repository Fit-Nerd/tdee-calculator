import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ bmr, tdee }) => {
    const isCalculated = bmr > 0 && tdee > 0;

    return (
        <div className={`results-panel ${isCalculated ? 'calculated' : ''}`}>
            <div className="results-header">
                <h2>Your Results</h2>
            </div>

            <div className="results-content">
                <div className="result-card primary">
                    <span className="result-label">Total Daily Energy Expenditure (TDEE)</span>
                    <div className="result-value-wrapper">
                        <span className="result-value glow-text">
                            {isCalculated ? Math.round(tdee).toLocaleString() : '---'}
                        </span>
                        <span className="result-unit">kcal/day</span>
                    </div>
                    <p className="result-desc">The amount of calories you burn per day based on your activity level.</p>
                </div>

                <div className="result-card secondary">
                    <span className="result-label">Basal Metabolic Rate (BMR)</span>
                    <div className="result-value-wrapper">
                        <span className="result-value">
                            {isCalculated ? Math.round(bmr).toLocaleString() : '---'}
                        </span>
                        <span className="result-unit">kcal/day</span>
                    </div>
                    <p className="result-desc">The calories your body burns at rest to maintain vital functions.</p>
                </div>
            </div>

            {isCalculated && (
                <div className="macros-hint">
                    <p>This is your maintenance level. To lose weight, subtract 300-500 kcal. To gain muscle, add 300-500 kcal.</p>
                </div>
            )}
        </div>
    );
};

export default ResultsDisplay;

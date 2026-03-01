import React, { useState, useEffect } from 'react';
import './CaloricAdjustment.css';

const CaloricAdjustment = ({ data, tdee }) => {
    const [adjustment, setAdjustment] = useState(0);

    useEffect(() => {
        const cur = Number(data.weight);
        const goal = Number(data.goalWeight);
        if (!cur || !goal || cur === goal) {
            setAdjustment(0);
        } else if (cur > goal) {
            setAdjustment(-500);
        } else {
            setAdjustment(500);
        }
    }, [data.weight, data.goalWeight]);

    if (!tdee || tdee === 0) return null;

    const curWeight = Number(data.weight);
    const goalWeight = Number(data.goalWeight);
    if (!curWeight || !goalWeight) return null;

    const isDeficit = curWeight > goalWeight;
    const isSurplus = curWeight < goalWeight;

    const halfPercent = curWeight * 0.005;
    const onePercent = curWeight * 0.01;
    const unitLabel = data.unit === 'metric' ? 'kg' : 'lbs';

    const targetTdee = Math.round(tdee + adjustment);

    return (
        <div className="adjustment-panel animate-enter">
            <div className="adjustment-header">
                <h2>Your Caloric Goal</h2>
                {isDeficit && (
                    <div className="recommendation-box">
                        <p>
                            For sustainable weight loss and to protect your metabolism (HPA axis), we recommend aiming to lose <strong>{halfPercent.toFixed(1)} - {onePercent.toFixed(1)} {unitLabel}</strong> per week (0.5% - 1.0% of your body weight).
                        </p>
                    </div>
                )}
            </div>

            <div className="adjustment-controls form-row">
                <div className="form-group full-width">
                    <label>Select your daily caloric adjustment</label>
                    <div className="custom-select-wrapper">
                        <select
                            value={adjustment}
                            onChange={(e) => setAdjustment(Number(e.target.value))}
                            className="activity-select"
                        >
                            <option value={0}>Maintain Current Weight (0 kcal)</option>
                            {isDeficit && (
                                <>
                                    <option value={-250}>Mild Deficit (-250 kcal/day)</option>
                                    <option value={-500}>Moderate Deficit (-500 kcal/day)</option>
                                    <option value={-750}>Aggressive Deficit (-750 kcal/day)</option>
                                    <option value={-1000}>Very Aggressive (-1000 kcal/day)</option>
                                </>
                            )}
                            {isSurplus && (
                                <>
                                    <option value={250}>Lean Bulk (+250 kcal/day)</option>
                                    <option value={500}>Moderate Bulk (+500 kcal/day)</option>
                                    <option value={750}>Aggressive Bulk (+750 kcal/day)</option>
                                </>
                            )}
                        </select>
                        <span className="select-arrow">▼</span>
                    </div>
                </div>
            </div>

            <div className="target-result-card relative-glow">
                <span className="result-label">Target Daily Intake</span>
                <div className="result-value-wrapper">
                    <span className="result-value highlight-purple">
                        {targetTdee.toLocaleString()}
                    </span>
                    <span className="result-unit">kcal/day</span>
                </div>
            </div>
        </div>
    );
};

export default CaloricAdjustment;

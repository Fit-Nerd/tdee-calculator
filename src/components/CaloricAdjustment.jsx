import React, { useState, useEffect } from 'react';
import './CaloricAdjustment.css';

const CaloricAdjustment = ({ data, tdee }) => {
    const [adjustment, setAdjustment] = useState(0);
    const [proteinLevel, setProteinLevel] = useState(1.0);
    const [metabolicProfile, setMetabolicProfile] = useState('standard');
    const [customCarbPct, setCustomCarbPct] = useState(50);

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

    // --- MACRO CALCULATIONS ---
    const goalWeightLbs = data.unit === 'metric' ? goalWeight * 2.20462 : goalWeight;
    const proteinGrams = Math.round(goalWeightLbs * proteinLevel);
    const proteinCals = proteinGrams * 4;

    const remainingCals = targetTdee - proteinCals;

    let carbGrams = 0;
    let fatGrams = 0;
    let recommendedSupplement = null;

    if (metabolicProfile === 'standard') {
        carbGrams = Math.round((remainingCals * 0.5) / 4);
        fatGrams = Math.round((remainingCals * 0.5) / 9);
    } else if (metabolicProfile === 'performance') {
        carbGrams = Math.round((remainingCals * 0.7) / 4);
        fatGrams = Math.round((remainingCals * 0.3) / 9);
    } else if (metabolicProfile === 'insulin_resistant') {
        carbGrams = 125; // Strict cap
        const maxCarbCals = carbGrams * 4;
        fatGrams = Math.max(0, Math.round((remainingCals - maxCarbCals) / 9));
        recommendedSupplement = "Nutridyn Berberine Pro";
    } else if (metabolicProfile === 'liver_support') {
        const maxFatCals = targetTdee * 0.25; // 25% of total TDEE
        fatGrams = Math.round(maxFatCals / 9);
        carbGrams = Math.max(0, Math.round((remainingCals - maxFatCals) / 4));
        recommendedSupplement = "Nutridyn Lipo-Flow";
    } else if (metabolicProfile === 'custom') {
        const safeCarbPct = Math.min(100, Math.max(0, customCarbPct));
        const fatPct = 100 - safeCarbPct;
        carbGrams = Math.round((remainingCals * (safeCarbPct / 100)) / 4);
        fatGrams = Math.round((remainingCals * (fatPct / 100)) / 9);
    }

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

            <div className="macros-section">
                <h3 className="macros-title">Macronutrient Profile</h3>

                <div className="macro-controls form-row">
                    <div className="form-group">
                        <label>Protein Comfort Level</label>
                        <div className="custom-select-wrapper">
                            <select value={proteinLevel} onChange={(e) => setProteinLevel(Number(e.target.value))} className="activity-select">
                                <option value={0.7}>Level 1: Introductory (0.7g/lb)</option>
                                <option value={1.0}>Level 2: Nutrient Standard (1.0g/lb)</option>
                                <option value={1.25}>Level 3: Aggressive (1.25g/lb)</option>
                            </select>
                            <span className="select-arrow">▼</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Metabolic Profile</label>
                        <div className="custom-select-wrapper">
                            <select value={metabolicProfile} onChange={(e) => setMetabolicProfile(e.target.value)} className="activity-select">
                                <option value="standard">Standard (50c/50f)</option>
                                <option value="performance">High Performance (70c/30f)</option>
                                <option value="insulin_resistant">Insulin Resistant (Hard Cap Carbs)</option>
                                <option value="liver_support">Liver & Gallbladder Support (Hard Cap Fats)</option>
                                <option value="custom">Custom Split</option>
                            </select>
                            <span className="select-arrow">▼</span>
                        </div>
                    </div>
                </div>

                {metabolicProfile === 'custom' && (
                    <div className="custom-slider-group">
                        <label>Custom Carb/Fat Split of remaining calories</label>
                        <div className="slider-container">
                            <span>{customCarbPct}% Carbs</span>
                            <input
                                type="range"
                                min="0" max="100"
                                value={customCarbPct}
                                onChange={(e) => setCustomCarbPct(Number(e.target.value))}
                                className="custom-range"
                            />
                            <span>{100 - customCarbPct}% Fats</span>
                        </div>
                    </div>
                )}

                <div className="macro-cards-container">
                    <div className="macro-card protein-card">
                        <span className="macro-name">Protein</span>
                        <span className="macro-grams">{proteinGrams}g</span>
                        <span className="macro-cals">{proteinCals} kcal</span>
                    </div>
                    <div className="macro-card carbs-card">
                        <span className="macro-name">Carbs</span>
                        <span className="macro-grams">{carbGrams}g</span>
                        <span className="macro-cals">{carbGrams * 4} kcal</span>
                    </div>
                    <div className="macro-card fats-card">
                        <span className="macro-name">Fats</span>
                        <span className="macro-grams">{fatGrams}g</span>
                        <span className="macro-cals">{fatGrams * 9} kcal</span>
                    </div>
                </div>

                {recommendedSupplement && (
                    <div className="supplement-recommendation">
                        <span className="supplement-icon">✨</span>
                        <p><strong>Suggested Supplement:</strong> {recommendedSupplement}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CaloricAdjustment;

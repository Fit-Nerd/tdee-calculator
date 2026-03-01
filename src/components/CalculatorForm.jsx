import React from 'react';
import './CalculatorForm.css';

const CalculatorForm = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleNumberInput = (e, field) => {
        const val = parseFloat(e.target.value);
        handleChange(field, isNaN(val) ? '' : val);
    };

    return (
        <div className="calc-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Gender</label>
                    <div className="gender-toggles">
                        <button
                            type="button"
                            className={`gender-btn ${data.gender === 'male' ? 'active' : ''}`}
                            onClick={() => handleChange('gender', 'male')}
                        >Male</button>
                        <button
                            type="button"
                            className={`gender-btn ${data.gender === 'female' ? 'active' : ''}`}
                            onClick={() => handleChange('gender', 'female')}
                        >Female</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <div className="input-with-suffix">
                        <input type="number" id="age" value={data.age} onChange={(e) => handleNumberInput(e, 'age')} placeholder="e.g. 30" />
                        <span className="suffix">years</span>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Current Weight</label>
                    <div className="input-with-suffix">
                        <input type="number" value={data.weight} onChange={(e) => handleNumberInput(e, 'weight')} placeholder={data.unit === 'metric' ? '75' : '165'} />
                        <span className="suffix">{data.unit === 'metric' ? 'kg' : 'lbs'}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Goal Weight</label>
                    <div className="input-with-suffix">
                        <input type="number" value={data.goalWeight} onChange={(e) => handleNumberInput(e, 'goalWeight')} placeholder={data.unit === 'metric' ? '70' : '150'} />
                        <span className="suffix">{data.unit === 'metric' ? 'kg' : 'lbs'}</span>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group full-width">
                    <label>Height</label>
                    {data.unit === 'metric' ? (
                        <div className="input-with-suffix">
                            <input type="number" value={data.heightCm} onChange={(e) => handleNumberInput(e, 'heightCm')} placeholder="175" />
                            <span className="suffix">cm</span>
                        </div>
                    ) : (
                        <div className="imperial-height">
                            <div className="input-with-suffix">
                                <input type="number" value={data.heightFt} onChange={(e) => handleNumberInput(e, 'heightFt')} placeholder="5" />
                                <span className="suffix">ft</span>
                            </div>
                            <div className="input-with-suffix">
                                <input type="number" value={data.heightIn} onChange={(e) => handleNumberInput(e, 'heightIn')} placeholder="9" />
                                <span className="suffix">in</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {data.formula === 'cunningham' && (
                <div className="form-row animate-enter">
                    <div className="form-group full-width">
                        <label>Body Fat % <span>(Required for Cunningham)</span></label>
                        <div className="input-with-suffix">
                            <input type="number" value={data.bodyFat} onChange={(e) => handleNumberInput(e, 'bodyFat')} placeholder="e.g. 15" />
                            <span className="suffix">%</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-row">
                <div className="form-group full-width">
                    <label>Activity Level</label>
                    <div className="custom-select-wrapper">
                        <select value={data.activity} onChange={(e) => handleChange('activity', e.target.value)} className="activity-select">
                            <option value="sedentary">Sedentary (office job, little to no exercise)</option>
                            <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
                            <option value="moderate">Moderately Active (moderate exercise 3-5 days/week)</option>
                            <option value="active">Very Active (hard exercise 6-7 days/week)</option>
                            <option value="very_active">Extra Active (very hard exercise & physical job)</option>
                        </select>
                        <span className="select-arrow">▼</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorForm;

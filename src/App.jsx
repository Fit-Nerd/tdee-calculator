import React, { useState, useMemo } from 'react';
import './App.css';
import Toggle from './components/Toggle';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import CaloricAdjustment from './components/CaloricAdjustment';

function App() {
  const [data, setData] = useState({
    unit: 'imperial',
    formula: 'mifflin',
    gender: 'male',
    age: '',
    weight: '',
    goalWeight: '',
    heightCm: '',
    heightFt: '',
    heightIn: '',
    bodyFat: '',
    activity: 'sedentary'
  });

  const { bmr, tdee } = useMemo(() => {
    let weightKg = data.unit === 'metric' ? Number(data.weight) : Number(data.weight) / 2.20462;
    let heightCm = 0;

    if (data.unit === 'metric') {
      heightCm = Number(data.heightCm);
    } else {
      const ft = Number(data.heightFt) || 0;
      const inch = Number(data.heightIn) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
    }

    if (!weightKg) return { bmr: 0, tdee: 0 };

    let calculatedBmr = 0;

    if (data.formula === 'mifflin') {
      const age = Number(data.age);
      if (!age || !heightCm) return { bmr: 0, tdee: 0 };

      calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
      calculatedBmr += data.gender === 'male' ? 5 : -161;
    } else {
      const bf = Number(data.bodyFat);
      if (!bf) return { bmr: 0, tdee: 0 };

      const lbm = weightKg * (1 - (bf / 100));
      calculatedBmr = 500 + (22 * lbm);
    }

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const calculatedTdee = calculatedBmr * multipliers[data.activity];

    return { bmr: calculatedBmr, tdee: calculatedTdee };
  }, [data]);

  return (
    <div className="app-container">
      <header>
        <h1>TDEE Calculator</h1>
        <p className="subtitle">Discover your Total Daily Energy Expenditure</p>
      </header>

      <main className="calculator-card">
        <div className="toggles-row">
          <Toggle
            label="System of Measurement"
            options={[
              { label: 'Imperial', value: 'imperial' },
              { label: 'Metric', value: 'metric' }
            ]}
            activeOption={data.unit}
            onChange={(val) => setData(prev => ({ ...prev, unit: val }))}
          />
          <Toggle
            label="BMR Formula"
            options={[
              { label: 'Mifflin-St Jeor', value: 'mifflin' },
              { label: 'Cunningham', value: 'cunningham' }
            ]}
            activeOption={data.formula}
            onChange={(val) => setData(prev => ({ ...prev, formula: val }))}
          />
        </div>

        <CalculatorForm data={data} onChange={setData} />

        <ResultsDisplay bmr={bmr} tdee={tdee} />

        <CaloricAdjustment data={data} tdee={tdee} />
      </main>
    </div>
  );
}

export default App;

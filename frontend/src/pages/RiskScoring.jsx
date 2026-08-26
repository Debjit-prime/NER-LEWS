import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RiskGauge from '../components/RiskGauge';
import { calculateClientRiskScore } from '../utils/riskCalculator';
import { api } from '../utils/api';

export default function RiskScoring() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Input states
  const [temperature, setTemperature] = useState(
    Number(searchParams.get('temp')) || 28.5
  );
  const [humidity, setHumidity] = useState(
    Number(searchParams.get('hum')) || 82
  );
  const [precipitation, setPrecipitation] = useState(
    Number(searchParams.get('precip')) || 145
  );
  const [soilMoisture, setSoilMoisture] = useState(
    Number(searchParams.get('soil')) || 68
  );
  const [elevation, setElevation] = useState(
    Number(searchParams.get('elev')) || 1250
  );
  const [zoneName, setZoneName] = useState(
    searchParams.get('name') || 'East Khasi Hills (Cherrapunji Sector)'
  );

  const [calculationResult, setCalculationResult] = useState(null);
  const [dispatchStatus, setDispatchStatus] = useState(null);

  // Re-calculate whenever inputs change
  useEffect(() => {
    const res = calculateClientRiskScore({
      temperature,
      humidity,
      precipitation,
      soilMoisture,
      elevation
    });
    setCalculationResult(res);
  }, [temperature, humidity, precipitation, soilMoisture, elevation]);

  // Presets for regional slope scenarios
  const presets = [
    {
      name: 'Cherrapunji Monsoon (Severe)',
      values: { temperature: 18, humidity: 96, precipitation: 245, soilMoisture: 92, elevation: 1430, zoneName: 'Cherrapunji Sector 4 (Meghalaya)' }
    },
    {
      name: 'Aizawl Steep Ridge (High)',
      values: { temperature: 21, humidity: 88, precipitation: 140, soilMoisture: 84, elevation: 1132, zoneName: 'Aizawl North Bypass (Mizoram)' }
    },
    {
      name: 'Nongstoin Valley (Moderate)',
      values: { temperature: 23, humidity: 74, precipitation: 68, soilMoisture: 58, elevation: 850, zoneName: 'Nongstoin Valley (West Khasi)' }
    },
    {
      name: 'Dry Winter Season (Low)',
      values: { temperature: 20, humidity: 35, precipitation: 5, soilMoisture: 20, elevation: 400, zoneName: 'Ri-Bhoi Plains (Low Risk)' }
    }
  ];

  const applyPreset = (p) => {
    setTemperature(p.values.temperature);
    setHumidity(p.values.humidity);
    setPrecipitation(p.values.precipitation);
    setSoilMoisture(p.values.soilMoisture);
    setElevation(p.values.elevation);
    setZoneName(p.values.zoneName);
  };

  const handleSendToAuthority = async () => {
    if (!calculationResult) return;
    setDispatchStatus('Broadcasting...');
    try {
      await api.createAlert({
        severity: calculationResult.band === 'SEVERE' ? 'Severe' : calculationResult.band === 'HIGH' ? 'High' : 'Moderate',
        title: `${calculationResult.bandLabel}: ${zoneName}`,
        location: zoneName,
        message: calculationResult.advisoryText
      });
      setDispatchStatus('Dispatched to Authority!');
      setTimeout(() => {
        navigate('/authority');
      }, 1200);
    } catch {
      setDispatchStatus('Dispatched locally');
      setTimeout(() => navigate('/authority'), 1200);
    }
  };

  const result = calculationResult || calculateClientRiskScore({
    temperature,
    humidity,
    precipitation,
    soilMoisture,
    elevation
  });

  return (
    <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)] bg-background">
      {/* Header Section */}
      <div className="px-margin-mobile md:px-margin-desktop py-lg md:py-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-background">
              Landslide Risk Scoring Engine
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-1">
              Transparent, rule-based multi-criteria geotechnical assessment for Northeast India terrain.
            </p>
          </div>

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap gap-1.5 bg-surface-container-lowest p-1.5 border border-outline-variant rounded-xl shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant px-2 py-1 flex items-center">Presets:</span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-xs font-semibold bg-surface-container hover:bg-primary hover:text-white rounded-lg transition-colors border border-outline-variant/60"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-margin-mobile md:px-margin-desktop pb-2xl flex-1">
        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Left Section: Form (40%) */}
          <div className="w-full lg:w-5/12 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant pb-md mb-md">
              <h2 className="text-headline-sm font-bold text-on-background flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                <span>Site Conditions Input</span>
              </h2>
              <span className="text-xs text-on-surface-variant font-mono">Live Inputs</span>
            </div>

            <form className="flex-1 flex flex-col gap-md">
              {/* Target Location / Zone Name */}
              <div>
                <label className="block text-label-bold font-bold text-on-surface mb-1 text-xs uppercase">
                  Target Zone / Slope Sector
                </label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md text-on-surface focus:border-primary outline-none"
                  placeholder="e.g. East Khasi Hills..."
                />
              </div>

              {/* 1. Precipitation */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/70">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-label-bold font-bold text-on-surface text-xs uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">rainy</span>
                    <span>24h Rainfall (Weight: 35%)</span>
                  </label>
                  <span className="font-bold text-primary text-sm">{precipitation} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="1"
                  value={precipitation}
                  onChange={(e) => setPrecipitation(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                  <span>0 mm (0.0)</span>
                  <span>50 mm (3.0)</span>
                  <span>100 mm (6.0)</span>
                  <span>150+ mm (10.0)</span>
                </div>
              </div>

              {/* 2. Soil Moisture */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/70">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-label-bold font-bold text-on-surface text-xs uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">water_drop</span>
                    <span>Soil Moisture (Weight: 30%)</span>
                  </label>
                  <span className="font-bold text-primary text-sm">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={soilMoisture}
                  onChange={(e) => setSoilMoisture(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                  <span>0% Dry (0.0)</span>
                  <span>50% Moist (5.0)</span>
                  <span>100% Saturated (10.0)</span>
                </div>
              </div>

              {/* 3. Elevation */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/70">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-label-bold font-bold text-on-surface text-xs uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">landscape</span>
                    <span>Elevation (Weight: 20%)</span>
                  </label>
                  <span className="font-bold text-primary text-sm">{elevation} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={elevation}
                  onChange={(e) => setElevation(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                  <span>&lt;500m (2.0)</span>
                  <span>500-1500m (5.0)</span>
                  <span>1500-2500m (8.0)</span>
                  <span>2500m+ (10.0)</span>
                </div>
              </div>

              {/* 4. Humidity */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/70">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-label-bold font-bold text-on-surface text-xs uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">humidity_percentage</span>
                    <span>Humidity (Weight: 15%)</span>
                  </label>
                  <span className="font-bold text-primary text-sm">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* 5. Temperature */}
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/70">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-label-bold font-bold text-on-surface text-xs uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">thermostat</span>
                    <span>Temperature (°C)</span>
                  </label>
                  <span className="font-bold text-primary text-sm">{temperature} °C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                  {temperature < 15 || temperature > 30 ? '+0.5 thermal stress modifier applied' : '15°C–30°C: Neutral thermal conditions (0.0)'}
                </span>
              </div>
            </form>
          </div>

          {/* Right Section: Results (60%) */}
          <div className="w-full lg:w-7/12 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-sm">
            {/* Risk Header Strip */}
            <div
              className="h-2.5 w-full transition-colors duration-500"
              style={{ backgroundColor: result.color }}
            ></div>

            <div className="p-lg flex-1 flex flex-col items-center justify-center text-center">
              <div className="flex justify-between items-center w-full border-b border-outline-variant pb-md mb-md">
                <h2 className="text-headline-md font-bold text-on-background text-left">
                  Analysis Results
                </h2>
                <span className="text-xs font-mono text-on-surface-variant">
                  {zoneName}
                </span>
              </div>

              {/* Gauge Display */}
              <RiskGauge score={result.score} maxScore={10} />

              {/* Risk Badge */}
              <div
                className={`px-6 py-2 rounded-full text-alert-callout font-bold my-4 border inline-flex items-center gap-2 transition-all shadow-sm ${result.badgeClass}`}
              >
                <span className="material-symbols-outlined filled text-[22px]">
                  {result.band === 'SEVERE' || result.band === 'HIGH' ? 'warning' : 'info'}
                </span>
                <span>{result.bandLabel} ({result.score} / 10.0)</span>
              </div>

              {/* Advisory Text Card */}
              <div className="w-full max-w-lg bg-surface-container-low p-md rounded-xl mb-md border border-outline-variant">
                <p className="text-body-md text-on-surface font-semibold flex items-start gap-sm text-left">
                  <span className="material-symbols-outlined text-primary mt-0.5 shrink-0">
                    notification_important
                  </span>
                  <span>{result.advisoryText}</span>
                </p>
              </div>

              {/* Sub-Score Multi-Criteria Breakdown Table */}
              <div className="w-full max-w-lg border border-outline-variant rounded-xl overflow-hidden text-left text-xs mb-lg bg-surface">
                <div className="bg-surface-container-high px-3 py-2 font-bold text-on-surface uppercase tracking-wider flex justify-between">
                  <span>Transparent Scoring Breakdown</span>
                  <span>Empirical Weights</span>
                </div>
                <div className="p-3 flex flex-col gap-1.5 font-mono">
                  <div className="flex justify-between text-on-surface">
                    <span>Precipitation Subscore:</span>
                    <strong>{result.breakdown.precipitation.subScore} × 35% = {result.breakdown.precipitation.weighted}</strong>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Soil Moisture Subscore:</span>
                    <strong>{result.breakdown.soilMoisture.subScore} × 30% = {result.breakdown.soilMoisture.weighted}</strong>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Elevation Subscore:</span>
                    <strong>{result.breakdown.elevation.subScore} × 20% = {result.breakdown.elevation.weighted}</strong>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Humidity Subscore:</span>
                    <strong>{result.breakdown.humidity.subScore} × 15% = {result.breakdown.humidity.weighted}</strong>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>Thermal Stress Modifier:</span>
                    <strong>+{result.breakdown.temperature.modifier}</strong>
                  </div>
                  <div className="border-t border-outline-variant/60 pt-1 flex justify-between font-bold text-primary text-sm">
                    <span>Final Clamped Score:</span>
                    <span>{result.score} / 10.0</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto w-full flex flex-col sm:flex-row gap-sm justify-center">
                <button
                  onClick={handleSendToAuthority}
                  className="px-6 h-12 bg-primary text-on-primary rounded-lg text-body-sm font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{dispatchStatus || 'Send to Authority Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

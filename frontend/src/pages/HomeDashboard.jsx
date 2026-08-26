import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AvatarGuide from '../components/AvatarGuide';
import { getTranslation } from '../utils/i18n';
import { api } from '../utils/api';

export default function HomeDashboard({ currentLang = 'en' }) {
  const t = getTranslation(currentLang);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getZones();
        setZones(data);
        // Default to high-risk zone (e.g. East Khasi Hills)
        const primary = data.find(z => z.riskBand === 'HIGH' || z.riskBand === 'SEVERE') || data[0];
        setSelectedZone(primary);
      } catch (err) {
        console.error('Error loading zones:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeZone = selectedZone || {
    name: 'East Khasi Hills',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    rainfall24h: 120,
    soilMoisture: 85,
    roadStatus: 'Partially Blocked',
    roadAffected: 'NH-6 / Shillong Bypass',
    riskBand: 'HIGH',
    riskScore: 7.8,
    advisoryText: 'Heavy rainfall anticipated. Evacuation protocols recommended for vulnerable areas.'
  };

  const getRiskStyles = (band) => {
    switch (band) {
      case 'SEVERE':
        return {
          strip: 'bg-error',
          text: 'text-error',
          badgeBg: 'bg-error-container text-on-error-container',
          icon: 'warning'
        };
      case 'HIGH':
        return {
          strip: 'bg-risk-high',
          text: 'text-risk-high',
          badgeBg: 'bg-risk-high-container text-[#9a3412]',
          icon: 'warning'
        };
      case 'MODERATE':
        return {
          strip: 'bg-[#eab308]',
          text: 'text-[#854d0e]',
          badgeBg: 'bg-[#fef9c3] text-[#854d0e]',
          icon: 'info'
        };
      default:
        return {
          strip: 'bg-[#22c55e]',
          text: 'text-[#15803d]',
          badgeBg: 'bg-[#dcfce7] text-[#15803d]',
          icon: 'check_circle'
        };
    }
  };

  const riskStyle = getRiskStyles(activeZone.riskBand);

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl flex flex-col gap-xl">
      {/* System Telemetry Network Banner */}
      <div className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">sensors</span>
          <span>
            <strong>NER Telemetry Network:</strong> Multi-station real-time slope monitoring active across 8 North Eastern states.
          </span>
        </div>
        <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
          Live Monitoring
        </span>
      </div>

      {/* Greeting Section with Humanoid Avatar & Multilingual Audio */}
      <AvatarGuide
        currentLang={currentLang}
        activeAlertMessage={`${activeZone.riskBand} risk detected in ${activeZone.name}. ${activeZone.advisoryText || 'Please exercise extreme caution.'}`}
      />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Risk Status Column (Primary Focus - 8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h2 className="text-headline-sm font-bold text-on-surface">
              {t.home.todayRisk}
            </h2>
            {/* Zone Selector for Demo */}
            {zones.length > 0 && (
              <select
                value={activeZone.id || ''}
                onChange={(e) => {
                  const found = zones.find(z => z.id === e.target.value);
                  if (found) setSelectedZone(found);
                }}
                className="text-xs bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1.5 font-semibold text-primary outline-none focus:border-primary"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.riskBand})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Primary Risk Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${riskStyle.strip}`}></div>
            <div className="p-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-xs">
                  <span className={`material-symbols-outlined ${riskStyle.text} filled text-[22px]`}>
                    {riskStyle.icon}
                  </span>
                  <span className={`text-label-bold font-bold uppercase tracking-wider ${riskStyle.text}`}>
                    {activeZone.riskBand} RISK (Score: {activeZone.riskScore || '7.8'}/10)
                  </span>
                </div>
                <h3 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
                  {activeZone.name}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-xs">
                  {activeZone.advisoryText || 'Heavy rainfall anticipated. Evacuation protocols recommended for vulnerable areas.'}
                </p>
                <p className="text-xs text-on-surface-variant/80 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span>{activeZone.district}, {activeZone.state} • Road: {activeZone.roadAffected || 'NH-6'}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-sm w-full md:w-auto shrink-0">
                <Link
                  to="/map"
                  className="bg-primary text-on-primary text-label-bold font-bold py-md px-lg rounded-lg flex items-center justify-center gap-sm min-h-[48px] hover:bg-primary-container transition-colors w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">map</span>
                  <span>{t.home.viewMap}</span>
                </Link>
                <Link
                  to="/report"
                  className="bg-surface text-primary border border-primary text-label-bold font-bold py-md px-lg rounded-lg flex items-center justify-center gap-sm min-h-[48px] hover:bg-surface-container-low transition-colors w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">report_problem</span>
                  <span>{t.home.reportAnIssue}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-2">
            <Link
              to="/risk-scoring"
              className="p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-all flex items-center gap-md group"
            >
              <div className="p-3 bg-secondary-fixed rounded-lg text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">speed</span>
              </div>
              <div>
                <h4 className="text-label-bold font-bold text-on-surface">Rule-Based Risk Scoring</h4>
                <p className="text-xs text-on-surface-variant">Compute custom site risk using 5 geotechnical inputs</p>
              </div>
            </Link>

            <Link
              to="/alerts"
              className="p-md bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary transition-all flex items-center gap-md group"
            >
              <div className="p-3 bg-error-container rounded-lg text-error group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">campaign</span>
              </div>
              <div>
                <h4 className="text-label-bold font-bold text-on-surface">Active Alert Broadcasts</h4>
                <p className="text-xs text-on-surface-variant">Listen to multi-lingual emergency advisories</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Stats Column (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-md">
          <h2 className="text-headline-sm font-bold text-on-surface">
            {t.home.metrics}
          </h2>
          <div className="flex flex-col gap-md">
            {/* Stat 1: 24h Rainfall */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex items-center gap-md shadow-sm">
              <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">rainy</span>
              </div>
              <div>
                <p className="text-label-bold font-semibold text-on-surface-variant">{t.home.rainfall24h}</p>
                <p className="text-headline-sm font-bold text-on-surface">
                  {activeZone.rainfall24h || 120} mm
                </p>
                <span className="text-[11px] text-on-surface-variant/80">Threshold limit: 150 mm/24h</span>
              </div>
            </div>

            {/* Stat 2: Soil Moisture */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex items-center gap-md shadow-sm">
              <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px]">water_drop</span>
              </div>
              <div>
                <p className="text-label-bold font-semibold text-on-surface-variant">{t.home.soilMoisture}</p>
                <p className="text-headline-sm font-bold text-on-surface">
                  {activeZone.soilMoisture || 85}%
                </p>
                <span className="text-[11px] text-error font-semibold">High saturation level</span>
              </div>
            </div>

            {/* Stat 3: Road Status */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex items-center gap-md shadow-sm">
              <div className={`p-3 rounded-lg flex items-center justify-center ${
                activeZone.roadStatus === 'Blocked' || activeZone.roadStatus === 'Partially Blocked'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-secondary-container text-on-secondary-container'
              }`}>
                <span className="material-symbols-outlined text-[26px]">edit_road</span>
              </div>
              <div>
                <p className="text-label-bold font-semibold text-on-surface-variant">{t.home.roadStatus}</p>
                <p className={`text-body-lg font-bold ${
                  activeZone.roadStatus === 'Blocked' || activeZone.roadStatus === 'Partially Blocked'
                    ? 'text-error'
                    : 'text-on-surface'
                }`}>
                  {activeZone.roadStatus || 'Partially Blocked'}
                </p>
                <span className="text-[11px] text-on-surface-variant/80">{activeZone.roadAffected || 'NH-6 Transit Route'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

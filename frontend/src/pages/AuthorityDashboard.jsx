import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import SmsSimulationModal from '../components/SmsSimulationModal';
import { initialZones, initialReports } from '../data/seedData';

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'zones' | 'reports' | 'settings'
  const [zones, setZones] = useState(initialZones);
  const [reports, setReports] = useState(initialReports);
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [riskFilter, setRiskFilter] = useState('All Risks');
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [selectedZoneForSms, setSelectedZoneForSms] = useState(null);
  const [smsHistory, setSmsHistory] = useState([]);
  const [demoMode, setDemoMode] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [zonesData, reportsData, smsData] = await Promise.all([
          api.getZones(),
          api.getReports(),
          api.getSmsHistory()
        ]);
        if (zonesData) setZones(zonesData);
        if (reportsData) setReports(reportsData);
        if (smsData) setSmsHistory(smsData);
      } catch (err) {
        console.error('Error loading authority dashboard data:', err);
      }
    }
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenSmsModal = (zone, defaultMsg) => {
    setSelectedZoneForSms(zone);
    setSmsModalOpen(true);
  };

  const handleSmsSent = (log) => {
    setSmsHistory(prev => [log, ...prev]);
    showToast(`SMS Alert successfully broadcasted for ${log.zoneName}!`);
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
        showToast(`Report ${reportId} marked as "${newStatus}"`);
      } else {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      }
    } catch {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      showToast(`Report updated to ${newStatus}`);
    }
  };

  // Filtered zones
  const filteredZones = zones.filter((z) => {
    const districtMatch = districtFilter === 'All Districts' || z.district.toLowerCase() === districtFilter.toLowerCase();
    let riskMatch = true;
    if (riskFilter === 'Severe Risk Only') riskMatch = z.riskBand === 'SEVERE';
    else if (riskFilter === 'High Risk +') riskMatch = z.riskBand === 'SEVERE' || z.riskBand === 'HIGH';
    return districtMatch && riskMatch;
  });

  return (
    <div className="flex flex-1 overflow-hidden min-h-[calc(100vh-64px)] bg-background">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[#22c55e]">check_circle</span>
          <span className="text-body-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* SideNav (Admin Specific) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant bg-surface-container-lowest p-md gap-sm shrink-0">
        <div className="px-3 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          Authority Controls
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-sm p-3 rounded-lg font-label-bold text-sm transition-colors text-left ${
            activeTab === 'overview'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('zones')}
          className={`flex items-center gap-sm p-3 rounded-lg font-label-bold text-sm transition-colors text-left ${
            activeTab === 'zones'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">map</span>
          <span>Hazard Zones ({zones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-sm p-3 rounded-lg font-label-bold text-sm transition-colors text-left ${
            activeTab === 'reports'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">analytics</span>
          <span>Citizen Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-sm p-3 rounded-lg font-label-bold text-sm transition-colors text-left mt-auto ${
            activeTab === 'settings'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings & SMS</span>
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop flex flex-col gap-lg">
        {/* Mobile Tab Pills */}
        <div className="flex md:hidden gap-1 overflow-x-auto pb-1 border-b border-outline-variant">
          {['overview', 'zones', 'reports', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-lg animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div>
                <h1 className="text-headline-lg font-bold text-primary">
                  High-Risk Zones Overview
                </h1>
                <p className="text-body-md text-on-surface-variant mt-0.5">
                  Monitor critical Northeast sectors, verify road closures, and trigger emergency advisories.
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-sm flex-wrap">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-body-sm font-semibold text-primary outline-none focus:border-primary"
                >
                  <option>All Districts</option>
                  <option>East Khasi Hills</option>
                  <option>West Khasi Hills</option>
                  <option>Ri-Bhoi</option>
                  <option>Aizawl</option>
                  <option>Tawang</option>
                  <option>Dima Hasao</option>
                  <option>East Sikkim</option>
                </select>

                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-body-sm font-semibold text-primary outline-none focus:border-primary"
                >
                  <option>All Risks</option>
                  <option>Severe Risk Only</option>
                  <option>High Risk +</option>
                </select>
              </div>
            </div>

            {/* Zone Bento Cards Grid */}
            <div className="grid grid-cols-1 gap-md">
              {filteredZones.map((zone) => {
                const isSevere = zone.riskBand === 'SEVERE';
                const isHigh = zone.riskBand === 'HIGH';
                const isModerate = zone.riskBand === 'MODERATE';

                const borderTopClass = isSevere
                  ? 'border-t-error'
                  : isHigh
                  ? 'border-t-[#ea580c]'
                  : isModerate
                  ? 'border-t-[#eab308]'
                  : 'border-t-[#22c55e]';

                const badgeBgClass = isSevere
                  ? 'bg-error-container text-on-error-container'
                  : isHigh
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                  : isModerate
                  ? 'bg-[#fef9c3] text-[#854d0e]'
                  : 'bg-[#dcfce7] text-[#15803d]';

                return (
                  <div
                    key={zone.id}
                    className={`bg-surface-container-lowest border-t-4 ${borderTopClass} border-x border-b border-outline-variant rounded-xl p-lg flex flex-col xl:flex-row gap-lg justify-between items-start xl:items-center shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md w-full">
                      {/* Identity */}
                      <div className="flex flex-col gap-1">
                        <span className="text-label-bold font-bold text-on-surface-variant uppercase tracking-wider text-xs">
                          Zone ID: {zone.id}
                        </span>
                        <h2 className="text-headline-sm font-bold text-primary">
                          {zone.name}
                        </h2>
                        <p className="text-body-sm text-on-surface-variant">
                          {zone.district}, {zone.state}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col gap-1 justify-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${badgeBgClass} rounded-full font-bold text-xs w-fit`}>
                          <span className="material-symbols-outlined text-[16px] filled">
                            {isSevere ? 'warning' : isHigh ? 'error' : 'info'}
                          </span>
                          <span>{zone.riskBand} RISK ({zone.riskScore}/10)</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">Updated: {zone.lastUpdated}</span>
                      </div>

                      {/* Data Points */}
                      <div className="flex flex-col gap-1 justify-center">
                        <span className="text-label-bold font-bold text-on-surface-variant text-xs">
                          24h Rainfall / Soil
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-headline-md font-bold text-on-surface">
                            {zone.rainfall24h}
                          </span>
                          <span className="text-body-sm text-on-surface-variant">mm</span>
                          <span className="text-body-sm font-semibold text-on-surface ml-2">
                            • {zone.soilMoisture}% Sat.
                          </span>
                        </div>
                      </div>

                      {/* Road Infrastructure */}
                      <div className="flex flex-col gap-1 justify-center">
                        <span className="text-label-bold font-bold text-on-surface-variant text-xs">
                          {zone.roadAffected || 'Highway Transit'}
                        </span>
                        <div className={`flex items-center gap-1.5 font-bold text-sm ${
                          zone.roadStatus === 'Blocked' || zone.roadStatus === 'Severely Damaged'
                            ? 'text-error'
                            : zone.roadStatus === 'Partially Blocked'
                            ? 'text-[#ea580c]'
                            : 'text-[#059669]'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {zone.roadStatus === 'Blocked' ? 'block' : zone.roadStatus === 'Partially Blocked' ? 'warning' : 'check_circle'}
                          </span>
                          <span>{zone.roadStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 w-full xl:w-auto flex flex-row xl:flex-col gap-sm border-t xl:border-t-0 xl:border-l border-outline-variant pt-4 xl:pt-0 xl:pl-4 mt-2 xl:mt-0">
                      <button
                        onClick={() => handleOpenSmsModal(zone)}
                        className={`px-5 py-2.5 rounded-lg font-bold text-body-sm flex items-center justify-center gap-1.5 text-white transition-opacity w-full min-h-[44px] shadow-sm ${
                          isSevere ? 'bg-error hover:opacity-90' : 'bg-[#ea580c] hover:opacity-90'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">campaign</span>
                        <span>{isSevere ? 'Send Emergency Alert' : 'Send Advisory'}</span>
                      </button>

                      <a
                        href={`/risk-scoring?precip=${zone.rainfall24h}&soil=${zone.soilMoisture}&hum=${zone.humidity}&temp=${zone.temperature}&elev=${zone.elevation}&name=${encodeURIComponent(zone.name)}`}
                        className="border border-outline-variant px-5 py-2.5 rounded-lg font-bold text-body-sm text-on-surface hover:bg-surface-container-low transition-colors w-full min-h-[44px] flex justify-center items-center gap-1 text-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">speed</span>
                        <span>Calibrate Score</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ZONES */}
        {activeTab === 'zones' && (
          <div className="flex flex-col gap-md animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-headline-sm font-bold text-primary">All NER Hazard Stations ({zones.length})</h2>
              <span className="text-xs text-on-surface-variant">Live Real-Time Telemetry</span>
            </div>

            <div className="overflow-x-auto border border-outline-variant rounded-xl bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left text-body-sm">
                <thead className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase border-b border-outline-variant">
                  <tr>
                    <th className="p-3">Zone / Station</th>
                    <th className="p-3">District & State</th>
                    <th className="p-3">Elevation</th>
                    <th className="p-3">24h Rain</th>
                    <th className="p-3">Soil Moisture</th>
                    <th className="p-3">Road Affected</th>
                    <th className="p-3">Risk Band</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {zones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-3 font-bold text-primary">{zone.name}</td>
                      <td className="p-3 text-on-surface-variant">{zone.district}, {zone.state}</td>
                      <td className="p-3 font-mono">{zone.elevation} m</td>
                      <td className="p-3 font-semibold">{zone.rainfall24h} mm</td>
                      <td className="p-3 font-semibold">{zone.soilMoisture}%</td>
                      <td className="p-3">
                        <span className="font-semibold text-xs">{zone.roadAffected}</span>
                        <span className="block text-[11px] text-on-surface-variant">{zone.roadStatus}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          zone.riskBand === 'SEVERE' ? 'bg-error-container text-on-error-container' :
                          zone.riskBand === 'HIGH' ? 'bg-risk-high-container text-[#9a3412]' :
                          zone.riskBand === 'MODERATE' ? 'bg-[#fef9c3] text-[#854d0e]' : 'bg-[#dcfce7] text-[#15803d]'
                        }`}>
                          {zone.riskBand} ({zone.riskScore})
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenSmsModal(zone)}
                          className="px-2.5 py-1 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container"
                        >
                          Alert
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CITIZEN REPORTS */}
        {activeTab === 'reports' && (
          <div className="flex flex-col gap-md animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-headline-sm font-bold text-primary">Citizen Geotagged Hazard Reports</h2>
                <p className="text-xs text-on-surface-variant">Real-time incident reports submitted by local residents and travelers</p>
              </div>
              <span className="px-3 py-1 bg-secondary-fixed text-primary rounded-full text-xs font-bold">
                {reports.length} Active Submissions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {reports.map((report) => (
                <div key={report.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-col gap-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">{report.id}</span>
                      <h3 className="font-bold text-on-surface text-base">{report.locationName}</h3>
                      <p className="text-xs text-on-surface-variant font-mono">
                        GPS: {report.lat}, {report.lng} • {report.district}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      report.status === 'Verified' ? 'bg-[#dcfce7] text-[#15803d]' :
                      report.status === 'Action Dispatched' ? 'bg-error-container text-on-error-container' :
                      'bg-secondary-fixed text-primary'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  {/* Photo Evidence */}
                  {report.imageUrl && (
                    <div className="rounded-lg overflow-hidden max-h-[160px] bg-surface-container border border-outline-variant">
                      <img src={report.imageUrl} alt="Hazard evidence" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-body-sm text-on-surface bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/60">
                    "{report.description}"
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {(report.tags || []).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-container text-xs rounded text-on-surface-variant font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Review Actions */}
                  <div className="flex gap-2 pt-2 border-t border-outline-variant mt-auto">
                    <button
                      onClick={() => handleUpdateReportStatus(report.id, 'Verified')}
                      className="flex-1 py-1.5 bg-[#22c55e] text-white rounded-lg text-xs font-bold hover:bg-[#16a34a] transition-colors"
                    >
                      Verify Incident
                    </button>
                    <button
                      onClick={() => handleUpdateReportStatus(report.id, 'Action Dispatched')}
                      className="flex-1 py-1.5 bg-error text-white rounded-lg text-xs font-bold hover:bg-error/90 transition-colors"
                    >
                      Dispatch SDRF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS & SMS GATEWAY */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-lg animate-fadeIn max-w-3xl">
            <div>
              <h2 className="text-headline-sm font-bold text-primary">Authority & SMS Gateway Settings</h2>
              <p className="text-body-sm text-on-surface-variant">Configure SMS gateway simulation, trigger thresholds, and system health.</p>
            </div>

            {/* SMS Simulator Mode Toggle Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-label-bold font-bold text-on-surface text-base">SMS Broadcast Sandbox Mode</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    When enabled, emergency SMS alerts are simulated in-app without requiring paid telecom keys.
                  </p>
                </div>
                <button
                  onClick={() => setDemoMode(!demoMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    demoMode ? 'bg-primary' : 'bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      demoMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 bg-secondary-fixed/50 rounded-lg text-xs font-mono text-primary">
                Current Gateway: {demoMode ? 'In-App Telecom Simulator (Zero Cost Hackathon Tier)' : 'Twilio / Fast2SMS API Gateway'}
              </div>
            </div>

            {/* Dispatched SMS Logs Terminal */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h3 className="text-label-bold font-bold text-on-surface text-base">Recent SMS Broadcast Log ({smsHistory.length})</h3>
                <button
                  onClick={() => setSmsHistory([])}
                  className="text-xs text-on-surface-variant hover:text-error underline"
                >
                  Clear Logs
                </button>
              </div>

              <div className="bg-[#091426] text-white p-3 rounded-xl font-mono text-xs max-h-60 overflow-y-auto flex flex-col gap-2 border border-outline-variant">
                {smsHistory.length === 0 ? (
                  <p className="text-on-surface-variant italic">No SMS broadcasts sent during this session. Trigger one from the Overview tab.</p>
                ) : (
                  smsHistory.map((s, i) => (
                    <div key={i} className="border-b border-white/10 pb-2">
                      <span className="text-[#22c55e] font-bold">[{s.timestamp || 'LOG'}] {s.id || 'SMS-BROADCAST'}:</span>
                      <p className="text-white/90 mt-0.5">{s.message}</p>
                      <span className="text-[10px] text-[#bcc7de] block mt-0.5">Status: {s.status || s.deliveryStatus} • Target: {s.zoneName || 'Regional'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SMS Simulation Modal Popup */}
      <SmsSimulationModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        zone={selectedZoneForSms}
        onSendSuccess={handleSmsSent}
      />
    </div>
  );
}

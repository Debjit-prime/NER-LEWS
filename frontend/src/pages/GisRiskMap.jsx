import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { initialZones } from '../data/seedData';

// Fix Leaflet default icon issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to programmatic fly to center and invalidate size on mount
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate map size so Leaflet recalculates viewport container instantly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 9, { duration: 1.2 });
    }
  }, [center, zoom, map]);

  return null;
}

// Custom Leaflet DivIcon Generator matching Stitch Design
function createCustomPin(zone) {
  const isSevere = zone.riskBand === 'SEVERE';
  const isHigh = zone.riskBand === 'HIGH';
  const isModerate = zone.riskBand === 'MODERATE';

  let color = '#22c55e'; // Green
  let iconName = 'check';
  let size = 28;

  if (isSevere) {
    color = '#ba1a1a'; // Red
    iconName = 'priority_high';
    size = 36;
  } else if (isHigh) {
    color = '#ea580c'; // Orange
    iconName = 'warning';
    size = 32;
  } else if (isModerate) {
    color = '#eab308'; // Yellow
    iconName = 'info';
    size = 28;
  }

  const pingEffect = (isSevere || isHigh) 
    ? `<div style="position: absolute; inset: -6px; background-color: ${color}; border-radius: 9999px; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
    : '';

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
      ${pingEffect}
      <div style="position: relative; width: ${size}px; height: ${size}px; background-color: ${color}; color: white; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2.5px solid #ffffff; cursor: pointer; transition: transform 0.2s;">
        <span class="material-symbols-outlined" style="font-size: ${size - 12}px; font-variation-settings: 'FILL' 1;">${iconName}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

export default function GisRiskMap() {
  const [zones, setZones] = useState(initialZones);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [activeRiskFilters, setActiveRiskFilters] = useState({
    SEVERE: true,
    HIGH: true,
    MODERATE: true,
    LOW: true
  });
  const [mapCenter, setMapCenter] = useState([25.5788, 91.8933]); // Shillong / Central NER
  const [mapZoom, setMapZoom] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(true);

  useEffect(() => {
    async function fetchZones() {
      const data = await api.getZones();
      if (data && data.length > 0) setZones(data);
    }
    fetchZones();
  }, []);

  // Filter logic
  const filteredZones = zones.filter((z) => {
    const districtMatch = selectedDistrict === 'all' || z.district.toLowerCase() === selectedDistrict.toLowerCase();
    const bandMatch = activeRiskFilters[z.riskBand];
    const queryMatch = searchQuery === '' || 
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      z.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.state.toLowerCase().includes(searchQuery.toLowerCase());

    return districtMatch && bandMatch && queryMatch;
  });

  const toggleRiskFilter = (band) => {
    setActiveRiskFilters(prev => ({ ...prev, [band]: !prev[band] }));
  };

  const handleDistrictChange = (districtVal) => {
    setSelectedDistrict(districtVal);
    if (districtVal === 'East Khasi Hills') setMapCenter([25.5788, 91.8933]);
    else if (districtVal === 'Aizawl') setMapCenter([23.7307, 92.7173]);
    else if (districtVal === 'Tawang') setMapCenter([27.5861, 91.8667]);
    else if (districtVal === 'Dima Hasao') setMapCenter([25.1764, 93.0238]);
    else if (districtVal === 'East Sikkim') setMapCenter([27.3389, 88.6065]);
    else setMapCenter([25.5788, 91.8933]);
  };

  return (
    <main className="flex-1 relative w-full h-[calc(100vh-64px)] min-h-[550px] overflow-hidden bg-surface-container-lowest">
      {/* Floating Filter Panel */}
      <div className={`absolute left-margin-mobile md:left-margin-desktop top-4 w-full max-w-[320px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-[1000] overflow-hidden flex flex-col transition-all duration-300 ${
        filterPanelOpen ? 'max-h-[calc(100vh-100px)]' : 'max-h-[56px]'
      }`}>
        <div 
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h2 className="text-headline-sm font-bold text-primary text-base">GIS Map Filters</h2>
          </div>
          <button className="text-outline hover:text-primary p-1">
            <span className="material-symbols-outlined">{filterPanelOpen ? 'expand_less' : 'expand_more'}</span>
          </button>
        </div>

        {filterPanelOpen && (
          <div className="p-md overflow-y-auto flex-1 flex flex-col gap-md">
            {/* Search location bar */}
            <div>
              <label className="text-label-bold font-bold text-on-surface-variant text-xs uppercase mb-1 block">
                Search Zone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Cherrapunji, Aizawl..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-8 pr-3 text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <span className="material-symbols-outlined absolute left-2 top-2.5 text-outline text-[18px]">search</span>
              </div>
            </div>

            {/* District Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-label-bold font-bold text-on-surface-variant text-xs uppercase">
                District / Region
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface py-2 px-3 pr-8 rounded-lg focus:outline-none focus:border-primary text-body-sm font-semibold"
                >
                  <option value="all">All NER Districts (All 8 States)</option>
                  <option value="East Khasi Hills">East Khasi Hills (Meghalaya)</option>
                  <option value="West Khasi Hills">West Khasi Hills (Meghalaya)</option>
                  <option value="Ri-Bhoi">Ri-Bhoi (Meghalaya)</option>
                  <option value="Aizawl">Aizawl (Mizoram)</option>
                  <option value="Tawang">Tawang (Arunachal Pradesh)</option>
                  <option value="Dima Hasao">Dima Hasao (Assam)</option>
                  <option value="East Sikkim">East Sikkim (Sikkim)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Risk Level Toggles */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-bold font-bold text-on-surface-variant text-xs uppercase mb-1">
                Risk Classification
              </label>

              {/* Severe */}
              <label className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-error"></span>
                  <span className="text-body-sm font-semibold text-on-surface">Severe (8.1 - 10.0)</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeRiskFilters.SEVERE}
                  onChange={() => toggleRiskFilter('SEVERE')}
                  className="rounded text-error focus:ring-error w-4 h-4"
                />
              </label>

              {/* High */}
              <label className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#ea580c]"></span>
                  <span className="text-body-sm font-semibold text-on-surface">High (6.1 - 8.0)</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeRiskFilters.HIGH}
                  onChange={() => toggleRiskFilter('HIGH')}
                  className="rounded text-[#ea580c] focus:ring-[#ea580c] w-4 h-4"
                />
              </label>

              {/* Moderate */}
              <label className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#eab308]"></span>
                  <span className="text-body-sm font-semibold text-on-surface">Moderate (3.1 - 6.0)</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeRiskFilters.MODERATE}
                  onChange={() => toggleRiskFilter('MODERATE')}
                  className="rounded text-[#eab308] focus:ring-[#eab308] w-4 h-4"
                />
              </label>

              {/* Low */}
              <label className="flex items-center justify-between p-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors border border-transparent hover:border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e]"></span>
                  <span className="text-body-sm font-semibold text-on-surface">Low (0.0 - 3.0)</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeRiskFilters.LOW}
                  onChange={() => toggleRiskFilter('LOW')}
                  className="rounded text-[#22c55e] focus:ring-[#22c55e] w-4 h-4"
                />
              </label>
            </div>

            {/* Quick Status Stats */}
            <div className="p-2.5 bg-surface-container rounded-lg border border-outline-variant text-xs text-on-surface-variant">
              <span className="font-bold text-primary">{filteredZones.length}</span> of {zones.length} hazard monitoring stations visible
            </div>
          </div>
        )}
      </div>

      {/* Floating Map Action Buttons */}
      <div className="absolute right-margin-mobile md:right-margin-desktop top-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={() => {
            setMapCenter([25.5788, 91.8933]);
            setMapZoom(8);
          }}
          className="bg-surface-container-lowest border border-outline-variant shadow-md w-11 h-11 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-primary"
          title="Reset View to Central NER"
        >
          <span className="material-symbols-outlined">center_focus_strong</span>
        </button>

        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                  setMapZoom(11);
                },
                () => alert('Could not retrieve current location')
              );
            }
          }}
          className="bg-surface-container-lowest border border-outline-variant shadow-md w-11 h-11 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors text-primary"
          title="My Location"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="w-full h-full min-h-[550px] relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: '550px', background: '#f2f4f6' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | North Eastern Council'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Hazard Zone Markers */}
          {filteredZones.map((zone) => {
            const pinIcon = createCustomPin(zone);
            return (
              <Marker
                key={zone.id}
                position={[zone.lat, zone.lng]}
                icon={pinIcon}
              >
                <Popup className="custom-popup" minWidth={280} maxWidth={320}>
                  <div className="p-1">
                    {/* Top color indicator bar */}
                    <div
                      className="h-1.5 w-full rounded-t -mt-2 -mx-1 mb-2"
                      style={{
                        backgroundColor:
                          zone.riskBand === 'SEVERE'
                            ? '#ba1a1a'
                            : zone.riskBand === 'HIGH'
                            ? '#ea580c'
                            : zone.riskBand === 'MODERATE'
                            ? '#eab308'
                            : '#22c55e'
                      }}
                    ></div>

                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base text-primary m-0">
                        {zone.name}
                      </h3>
                    </div>

                    <div className="text-xs text-on-surface-variant mb-2">
                      {zone.district}, {zone.state}
                    </div>

                    {/* Risk Badge */}
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold mb-2"
                      style={{
                        backgroundColor:
                          zone.riskBand === 'SEVERE'
                            ? '#ffdad6'
                            : zone.riskBand === 'HIGH'
                            ? '#ffedd5'
                            : zone.riskBand === 'MODERATE'
                            ? '#fef9c3'
                            : '#dcfce7',
                        color:
                          zone.riskBand === 'SEVERE'
                            ? '#93000a'
                            : zone.riskBand === 'HIGH'
                            ? '#9a3412'
                            : zone.riskBand === 'MODERATE'
                            ? '#854d0e'
                            : '#15803d'
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {zone.riskBand === 'SEVERE' ? 'warning' : 'info'}
                      </span>
                      <span>{zone.riskBand} RISK (Score: {zone.riskScore}/10)</span>
                    </div>

                    {/* Telemetry Stats Grid */}
                    <div className="grid grid-cols-2 gap-1.5 bg-surface-container p-2 rounded-lg text-xs mb-2.5">
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">24h Rainfall</span>
                        <strong className="text-on-surface">{zone.rainfall24h} mm</strong>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">Soil Saturation</span>
                        <strong className="text-on-surface">{zone.soilMoisture}%</strong>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">Elevation</span>
                        <strong className="text-on-surface">{zone.elevation} m</strong>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block text-[10px]">Road Transit</span>
                        <strong className="text-on-surface text-[11px] truncate block">{zone.roadStatus}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>Updated: {zone.lastUpdated}</span>
                      </span>
                      <span className="text-[#22c55e] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                        <span>Sensor {zone.stationStatus}</span>
                      </span>
                    </div>

                    <Link
                      to={`/risk-scoring?precip=${zone.rainfall24h}&soil=${zone.soilMoisture}&hum=${zone.humidity}&temp=${zone.temperature}&elev=${zone.elevation}&name=${encodeURIComponent(zone.name)}`}
                      className="w-full bg-primary text-on-primary py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors no-underline block text-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">speed</span>
                      <span>Analyze in Risk Calculator</span>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </main>
  );
}

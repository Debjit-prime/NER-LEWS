# NER-LEWS: North Eastern Region Landslide Early Warning System 🏔️🚨

**Smart India Hackathon (SIH 2026) Prototype**  
*A full-stack, AI and rule-based multi-hazard landslide early warning and decision-support platform designed for the 8 North Eastern Region (NER) states of India.*

---

## 🌟 Key Features

1. **Exact Visual Fidelity to Stitch UI/UX Design System**: Implemented strictly using modern institutional tokens (Dark Navy `#091426`, Slate White `#f7f9fb`, and the 4-tier risk semantic palette).
2. **Transparent, Explainable Risk Scoring Engine**: An empirical multi-criteria decision algorithm (Precipitation 35%, Soil Moisture 30%, Elevation 20%, Humidity 15%, and Thermal Stress modifier) that the non-technical team can explain line-by-line to SIH judges.
3. **Interactive GIS Risk Map**: Leaflet.js with OpenStreetMap (100% free, no API keys needed), featuring animated radar pulses for severe/high-risk zones, district filters, and station popups.
4. **Humanoid AI Assistant Guide & Multilingual Speech Synthesis**: Interactive avatar on the dashboard with browser-native Web Speech API narration in **English, Assamese (অসমীয়া), Hindi (हिन्दी), and Bengali (বাংলা)**.
5. **Citizen Hazard Field Reporting**: Geotagged camera/photo upload form with auto GPS capture that automatically syncs with the Authority Admin Dashboard.
6. **Authority Admin Dashboard & SMS Simulator**: 4 tabbed sections (Overview, Zones, Citizen Reports, and Settings) with an emergency SMS broadcast simulator and carrier log terminal.
7. **Offline-First & Zero-Cost Architecture**: Runs reliably on any laptop without needing paid API keys or cloud databases.

---

## 💻 Tech Stack (100% Free Tier Friendly)

| Layer | Technology | Cost / Key Requirement |
|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS | Free, zero-config build |
| **Backend** | Node.js + Express REST API | Free |
| **Maps** | Leaflet.js + OpenStreetMap Tiles | Free (No Google Maps API key required) |
| **Voice TTS** | Browser-Native Web Speech API | Free (No external cloud speech API required) |
| **SMS Alerts** | Telecom Sandbox + In-App Demo Mode Simulator | Free (Twilio optional) |
| **Database** | In-Memory / Local Pre-Seeded JSON Storage | Zero setup needed |

---

## 🚀 Step-by-Step Quickstart Guide (For Non-Technical Team)

Follow these simple steps in your terminal to run the complete app locally on your laptop:

### Step 1: Open Terminal in the project folder
```bash
cd /path/to/Landslide
```

### Step 2: Install dependencies (one-time setup)
```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### Step 3: Run the Development Server
```bash
npm run dev
```

Your terminal will display:
- **Frontend URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:5001`

Open your web browser and navigate to **`http://localhost:5173`** to test the live app!

---

## 🧠 Risk Scoring Formula (How to Explain to Judges)

The core risk engine is isolated in [`backend/riskScoring.js`](file:///Users/the_gruesome_knight/Documents/Projects/Landslide/backend/riskScoring.js).

### Step 1: Normalize 5 inputs to 0–10 sub-scores
- **24h Precipitation (Rainfall)**:
  - `0 mm` → `0.0`
  - `50 mm` → `3.0`
  - `100 mm` → `6.0`
  - `150+ mm` → `10.0` (Capped at 10)
- **Soil Moisture**: Linear scale `0%` → `0.0`, `100%` → `10.0` (`soilMoisture / 10`)
- **Humidity**: Linear scale `0%` → `0.0`, `100%` → `10.0` (`humidity / 10`)
- **Elevation**: Banded terrain hazard scale:
  - `0–500 m` (Valleys) → `2.0`
  - `500–1500 m` (Foothills/Plateaus) → `5.0`
  - `1500–2500 m` (Steep Slopes) → `8.0`
  - `2500+ m` (Alpine Ridge) → `10.0`
- **Temperature Modifier**:
  - `15°C to 30°C` → `0.0` (Stable thermal state)
  - `<15°C` or `>30°C` → `+0.5` (Thermal expansion/frost fracturing stress on rock joints)

### Step 2: Calculate Weighted Final Score
$$\text{Final Score} = (\text{Precipitation} \times 0.35) + (\text{Soil Moisture} \times 0.30) + (\text{Humidity} \times 0.15) + (\text{Elevation} \times 0.20) + \text{Temperature Modifier}$$

*Clamped between `0.0` and `10.0`.*

### Step 3: Map to Risk Bands & Advisories
- **`0.0 – 3.0` → LOW RISK (Green `#22c55e`)**: *"Conditions stable. Continue routine monitoring."*
- **`3.1 – 6.0` → MODERATE RISK (Amber `#eab308`)**: *"Increased risk detected. Notify local field officers for inspection."*
- **`6.1 – 8.0` → HIGH RISK (Orange `#ea580c`)**: *"High risk conditions. Recommend road advisory and resident alert."*
- **`8.1 – 10.0` → SEVERE RISK (Red `#ba1a1a`)**: *"Critical risk. Recommend immediate evacuation advisory and road closure."*

---

## 🗺️ Application Pages

1. **Home / Risk Dashboard (`/`)**: Humanoid avatar guide with audio narration, primary East Khasi Hills status card, 24h rainfall, soil moisture, and road transit status.
2. **GIS Risk Map (`/map`)**: Full-screen interactive Leaflet map covering all 8 NER states with color-coded radar markers, district filters, and popup cards.
3. **Citizen Report Upload (`/report`)**: Photo capture dropzone with live GPS geolocation detection, condition tags, and instant sync to SDMA authority.
4. **Active Alerts Feed (`/alerts`)**: Severity-colored cards with multilingual translation (`EN`, `AS`, `HI`, `BN`) and one-click Web Speech API audio playback.
5. **Authority Portal (`/authority`)**: High-risk zones bento grid, live sensor table, citizen submissions review (with SDRF dispatch actions), and SMS gateway settings.
6. **Risk Scoring Engine (`/risk-scoring`)**: Real-time slider calibrator with animated semi-circle gauge, presets (Cherrapunji, Aizawl, Nongstoin), and direct dispatch to authority.

---

## ☁️ Free Cloud Deployment Guide

### Deploy Frontend (Vercel / Netlify)
1. Push this repository to GitHub.
2. Connect repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set **Root Directory** to `frontend`.
4. Build command: `npm run build`, Output directory: `dist`.

### Deploy Backend (Render / Railway)
1. Connect repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`, Start command: `node server.js`.

---

## ⚖️ Hackathon Transparency Note (Real vs. Simulated Data)
- **Topography & Coordinates**: Real georeferenced coordinates across 10+ North Eastern hazard zones (Cherrapunji, Mawsynram, Aizawl, Tawang, Haflong, Gangtok, Kohima, Senapati).
- **Sensor Telemetry**: Pre-calibrated sample dataset modeled after real IMD monsoon patterns.
- **SMS Alerts**: Includes a clearly labeled Demo Mode toggle that simulates telecom carrier transmission in real time.

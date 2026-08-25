# NER-LEWS: North Eastern Region Landslide Early Warning System 🏔️🚨

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://ner-lews.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Backend-Live%20on%20Render-informational?style=for-the-badge&logo=render)](https://ner-lews.onrender.com/api/health)
[![Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%202026-blue?style=for-the-badge)](https://sih.gov.in/)
[![AI-Assisted](https://img.shields.io/badge/Development-AI--Assisted%20Prototyping-orange?style=for-the-badge)](https://github.com)

**NER-LEWS** is a full-stack, rule-based multi-hazard Landslide Early Warning System (LEWS) and decision-support platform engineered specifically for the 8 North Eastern Region (NER) states of India (*Meghalaya, Mizoram, Assam, Arunachal Pradesh, Sikkim, Nagaland, Manipur, Tripura*).

---

## 🌐 Live Production Links

- 🖥️ **Live Frontend Web Application**: [https://ner-lews.vercel.app/](https://ner-lews.vercel.app/)
- ⚙️ **Live Backend REST API**: [https://ner-lews.onrender.com/](https://ner-lews.onrender.com/)
- 🩺 **API Health Check**: [https://ner-lews.onrender.com/api/health](https://ner-lews.onrender.com/api/health)

---

## 🤖 Full Transparency & AI Attribution Disclosure

> **Transparency Statement for Smart India Hackathon (SIH 2026) Judges & Reviewers:**  
> This project was developed through **AI-assisted rapid prototyping**:
> 
> - **UI/UX Design & Layout**: Conceptualized and generated using **Stitch** (exporting modern institutional disaster management design tokens).
> - **Full-Stack Implementation & Codebase**: Engineered in collaboration with **Google Antigravity AI** (AI pair programmer for React, Leaflet, Express, and Web Speech API integration).
> - **Domain Problem Definition & Architectural Direction**: Formulated by the student team (identifying Eastern Himalayan slope vulnerability, specifying the 5-parameter geotechnical risk formula, and defining zero-cost public deployment requirements).

---

## 🌟 Key Capabilities

1. **🎨 Exact Stitch UI/UX Design System**: High-contrast institutional dark navy (`#091426`) and slate surface (`#f7f9fb`) theme with 4-tier risk semantic color indicators.
2. **🧠 Transparent, Explainable Risk Scoring Engine**: Pure mathematical Multi-Criteria Decision Analysis (MCDA) model that runs transparently without black-box machine learning.
3. **🗺️ Interactive GIS Hazard Map**: Built with **Leaflet.js + OpenStreetMap** (100% free, no Google Maps API keys needed) with animated radar pulse markers and district filters.
4. **🗣️ Humanoid Avatar Guide & Multilingual Web Speech API**: Text-to-speech audio advisories synthesized directly in the browser across **English, Assamese (অসমীয়া), Hindi (हिन्दी), and Bengali (বাংলা)**.
5. **📸 Citizen Geotagged Field Reports**: Auto-captures browser GPS coordinates and visual evidence (photos/videos) with instant synchronization to the Authority Admin Dashboard.
6. **🛡️ Authority Dashboard & SMS Broadcast Simulator**: Admin oversight across 4 tabs (*Overview, Hazard Zones, Citizen Reports, and Settings*) with a live telecom SMS broadcast simulator.
7. **🔌 100% Free Tier & Offline-First**: Operates seamlessly on local laptops and cloud hosting without requiring paid third-party APIs.

---

## 📐 The Risk Scoring Formula (How to Explain to Judges)

The core risk engine is isolated in [`backend/riskScoring.js`](./backend/riskScoring.js) with line-by-line comments.

### Step 1: Normalizing 5 Inputs to 0–10 Sub-Scores
1. **Precipitation (24h Rainfall in mm)**:
   - `0 mm` → `0.0`
   - `50 mm` → `3.0`
   - `100 mm` → `6.0`
   - `150+ mm` → `10.0` (Linear interpolation, capped at 10)
2. **Soil Moisture (%)**: `0%` → `0.0`, `100%` → `10.0` (Linear scale: `soilMoisture / 10`)
3. **Humidity (%)**: `0%` → `0.0`, `100%` → `10.0` (Linear scale: `humidity / 10`)
4. **Elevation (Terrain Altitude in meters)**:
   - `0–500 m` (Valleys/Plains) → `2.0`
   - `500–1500 m` (Foothills/Plateaus) → `5.0`
   - `1500–2500 m` (Steep Slopes) → `8.0`
   - `2500+ m` (Alpine Ridge Lines) → `10.0`
5. **Temperature Modifier**:
   - `15°C to 30°C` → `0.0` (Neutral thermal slope equilibrium)
   - `<15°C` or `>30°C` → `+0.5` (Thermal expansion / frost fracturing on rock joints)

### Step 2: Weighted Final Calculation
$$\text{Final Score} = (\text{Precipitation} \times 0.35) + (\text{Soil Moisture} \times 0.30) + (\text{Elevation} \times 0.20) + (\text{Humidity} \times 0.15) + \text{Temperature Modifier}$$

*Clamped between `0.0` and `10.0`.*

### Step 3: Risk Classification Bands & Advisories
- 🟢 **`0.0 – 3.0` → LOW RISK**: *"Conditions stable. Continue routine monitoring."*
- 🟡 **`3.1 – 6.0` → MODERATE RISK**: *"Increased risk detected. Notify local field officers for inspection."*
- 🟠 **`6.1 – 8.0` → HIGH RISK**: *"High risk conditions. Recommend road advisory and resident alert."*
- 🔴 **`8.1 – 10.0` → SEVERE RISK**: *"Critical risk. Recommend immediate evacuation advisory and road closure."*

---

## 🧭 Application Pages

| Route | Page | Description |
|---|---|---|
| **`/`** | **Home / Risk Dashboard** | Humanoid avatar guide with audio narration, primary East Khasi Hills status card, and live telemetry metrics. |
| **`/map`** | **GIS Risk Map** | Interactive Leaflet map with animated radar pulse pins for high/severe risk zones and district filters. |
| **`/risk-scoring`** | **Risk Scoring Engine** | Real-time 5-parameter calculator with animated gauge and preset scenario calibration (*Cherrapunji, Aizawl, Nongstoin*). |
| **`/alerts`** | **Active Alerts Feed** | Real-time emergency cards with one-click multilingual voice playback (**EN, AS, HI, BN**). |
| **`/report`** | **Citizen Hazard Report** | Photo upload dropzone with auto GPS location detection and instant sync to SDMA. |
| **`/authority`** | **Authority Portal** | High-risk zones bento grid, live sensor table, citizen reports review queue, and SMS broadcast simulation. |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Quick Start Commands
```bash
# 1. Clone or open the repository
git clone https://github.com/YOUR_USERNAME/NER-LEWS.git
cd NER-LEWS

# 2. Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Start development environment
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5001`

---

## 📜 License & Acknowledgments

- **Hackathon**: Developed for the **Smart India Hackathon (SIH 2026)**.
- **Design Credits**: Conceptual design and tokens exported from **Stitch**.
- **Engineering Partner**: Full-stack codebase and mathematical implementation generated with **Google Antigravity AI**.

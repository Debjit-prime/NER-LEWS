# NER-LEWS: North Eastern Region Landslide Early Warning System 🏔️🚨

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://ner-lews.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Backend-Live%20on%20Render-informational?style=for-the-badge&logo=render)](https://ner-lews.onrender.com/api/health)
[![System Status](https://img.shields.io/badge/Status-Production%20v1.0-blue?style=for-the-badge)](https://ner-lews.vercel.app/)
[![Open Source](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com)

**NER-LEWS** is a full-stack, rule-based multi-hazard Landslide Early Warning System (LEWS) and decision-support web platform engineered specifically for the 8 North Eastern Region (NER) states of India (*Meghalaya, Mizoram, Assam, Arunachal Pradesh, Sikkim, Nagaland, Manipur, Tripura*).

It combines real-time geotechnical multi-criteria decision analysis (MCDA), interactive GIS mapping, browser-native multilingual voice synthesis, and crowdsourced citizen hazard reporting to deliver life-saving early warnings before slope failures occur.

---

## 🌐 Live Production Deployments

- 🖥️ **Live Web Application**: [https://ner-lews.vercel.app/](https://ner-lews.vercel.app/)
- ⚙️ **Live Backend REST API**: [https://ner-lews.onrender.com/](https://ner-lews.onrender.com/)
- 🩺 **API Health Check**: [https://ner-lews.onrender.com/api/health](https://ner-lews.onrender.com/api/health)

---

## 🌟 Core System Features

1. **🧠 Explainable Geotechnical Risk Scoring Engine**: Pure mathematical Multi-Criteria Decision Analysis (MCDA) model evaluating 5 physical parameters (*Precipitation, Soil Saturation, Elevation, Relative Humidity, Thermal Stress*) with 100% transparent decision rules.
2. **🗺️ Interactive GIS Hazard Mapping**: Built on **Leaflet.js + OpenStreetMap** (100% free, zero third-party API dependencies) featuring dynamic radar pulse pins for severe/high risk sectors and district filtering across all 8 NER states.
3. **🗣️ Multilingual Humanoid AI Assistant Guide**: Browser-native **Web Speech API** synthesizing live voice advisories in **English, Assamese (অসমীয়া), Hindi (हिन्दी), and Bengali (বাংলা)**.
4. **📸 Citizen Geotagged Field Reports**: Auto-captures browser GPS coordinates and visual evidence (photos/videos) with instant synchronization to the Authority Admin Dashboard.
5. **🛡️ SDMA Authority Management Portal**: Admin oversight across 4 operational modules (*Overview, Hazard Zones, Citizen Reports, and SMS Broadcast Simulator*).
6. **🔌 100% Free-Tier & Zero-Cost Architecture**: Engineered using open-source tools with offline-first capabilities, requiring zero paid external API subscriptions.

---

## 💻 Architecture & Tech Stack

| Layer | Technology | Role / Benefit |
|---|---|---|
| **Frontend UI** | React 18 + Vite + Tailwind CSS | Responsive, high-contrast disaster intelligence interface |
| **GIS Mapping** | Leaflet.js + OpenStreetMap Tiles | Zero-cost interactive geospatial visualization |
| **Voice Synthesis** | Web Speech API | Client-side, browser-native multilingual speech synthesis |
| **Backend API** | Node.js + Express REST API | Modular telemetry ingestion and risk calculation service |
| **Database** | Local JSON File Store / Extensible SQL | Pre-seeded with 10 Northeast monitoring stations |
| **Deployment** | Vercel (Frontend) + Render (Backend) | Global edge CDN and serverless cloud execution |

---

## 📐 The Geotechnical Risk Scoring Model

The core risk calculation algorithm is isolated in [`backend/riskScoring.js`](./backend/riskScoring.js).

### 1. Normalization (0–10 Sub-Scores)
- **Precipitation (24h Rainfall in mm)**:
  - `0 mm` → `0.0`
  - `50 mm` → `3.0`
  - `100 mm` → `6.0`
  - `150+ mm` → `10.0` (Piecewise linear, capped at 10.0)
- **Soil Moisture (%)**: `0%` → `0.0`, `100%` → `10.0` (Linear scale)
- **Relative Humidity (%)**: `0%` → `0.0`, `100%` → `10.0` (Linear scale)
- **Elevation (Terrain Altitude in meters)**:
  - `0–500 m` (Valleys/Plains) → `2.0`
  - `500–1500 m` (Foothills/Plateaus) → `5.0`
  - `1500–2500 m` (Steep Slopes) → `8.0`
  - `2500+ m` (Alpine Ridge Lines) → `10.0`
- **Temperature Thermal Modifier**:
  - `15°C to 30°C` → `0.0` (Equilibrium)
  - `<15°C` or `>30°C` → `+0.5` (Thermal joint expansion / freeze-thaw penalty)

### 2. Weighted Sum Formula
$$\text{Final Risk Score} = (\text{Precipitation} \times 0.35) + (\text{Soil Moisture} \times 0.30) + (\text{Elevation} \times 0.20) + (\text{Humidity} \times 0.15) + \text{Temperature Modifier}$$

*Clamped to $[0.0, 10.0]$.*

### 3. Severity Classification & Standard Operating Procedures
- 🟢 **`0.0 – 3.0` → LOW RISK**: Stable slope equilibrium. Routine automated sensor monitoring.
- 🟡 **`3.1 – 6.0` → MODERATE RISK**: Increased pore pressure. Dispatch local field officers for culvert and slope inspection.
- 🟠 **`6.1 – 8.0` → HIGH RISK**: Near-saturation threshold. Issue highway transit advisories and alert hillside residents.
- 🔴 **`8.1 – 10.0` → SEVERE RISK**: Imminent failure. Recommend immediate evacuation advisory and proactive road closure.

---

## 🧭 Application Modules

| Route | Module | Purpose |
|---|---|---|
| **`/`** | **Home Dashboard** | Regional risk status, avatar audio guide, and East Khasi Hills live telemetry. |
| **`/map`** | **GIS Risk Map** | Leaflet geospatial map with live hazard pins and district filters. |
| **`/risk-scoring`** | **Risk Calculator** | Interactive 5-parameter simulator with animated gauge and preset scenarios. |
| **`/alerts`** | **Active Alerts Feed** | Emergency alert cards with one-click multilingual voice playback. |
| **`/report`** | **Citizen Portal** | Geotagged camera/photo upload for real-time field observations. |
| **`/authority`** | **Authority Portal** | Administrative oversight, hazard table, citizen report moderation, and SMS simulation. |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/[YOUR_USERNAME]/NER-LEWS.git
cd NER-LEWS

# 2. Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Start local development servers
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

---

## 🤖 Development Disclosure

This platform was created using modern AI-assisted rapid engineering workflows:
- **UI/UX System**: Concept design and layout structured with **Stitch**.
- **Full-Stack Implementation**: Codebase, REST endpoints, and Web Speech integration engineered in collaboration with **Google Antigravity AI**.
- **Domain Architecture & Mathematical Modeling**: Formulated and maintained independently as an open-source Disaster Risk Reduction (DRR) initiative.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

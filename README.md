# 🌍 World Atlas — Geographic Portal

A high-performance, modern cartographic intelligence dashboard built with **React**, **Vite**, and styled with the **Liquid Glass Design System** (Apple-inspired translucent frosted surfaces, deep space canvas, and radial ambient light).

World Atlas connects multiple live open APIs to deliver comprehensive demographic, climatic, economic, and cultural insights for every sovereign nation and territory.

---

## 🚀 Live Public API Integrations

1. **REST Countries API v5**: Primary catalog providing demographic data, capital coordinates, geopolitical treaties, driving sides, and SVG national flags.
2. **Open-Meteo Weather API**: Live meteorology for capital cities featuring current temperature, apparent "feels like", humidity, wind velocity, and 3-day weather forecasts.
3. **Open Exchange Rates API**: Real-time foreign exchange rates backing an interactive multi-currency conversion widget (USD, EUR, GBP, JPY).
4. **Wikipedia REST API**: Cultural extracts, historical synopses, and encyclopedic summaries fetched on demand.
5. **Nager.Date API**: National public holidays and cultural festivals for the current calendar year.
6. **Leaflet.js + CartoDB Maps**: In-app interactive coordinates map centered on capital cities and territorial boundaries with custom glowing pins.

---

## ✨ Features & Capabilities

### 🗺️ Atlas Explorer
- **Real-Time Search**: Substring scanning across all country records with zero layout shift.
- **Dynamic Sorting & Filtering**: Order by Name (A–Z), Population mass, or Surface area. Filter by continent / geographic region.
- **Saved Bookmarks**: Star / bookmark countries to save them locally. Filter the home grid with the "Saved Only" toggle chip.

### 🔍 Deep Territorial Inspection (`/country/:name`)
- **Dynamic Flag Banner**: Ambient blurred flag backdrop with high saturation and depth.
- **Live Capital Clock**: Real-time digital clock tracking the capital city's local time, UTC offset, and astronomical day/night indicator.
- **Live Meteorology Module**: Live temperature, weather condition, humidity, wind, and 3-day outlook.
- **Embedded Leaflet Map**: Interactive map with zoom/pan controls and custom coordinates pin.
- **Live Currency Converter**: Convert from local currency into major global currencies with real-time rates.
- **Culture & History**: Encyclopedic context powered by Wikipedia.
- **Upcoming Public Holidays**: National calendar holidays and cultural celebrations.
- **Geopolitical Alliances**: Badges for international organizations (UN, EU, NATO, G20, BRICS, ASEAN, etc.).

### ⚖️ Side-by-Side Country Compare (`/compare`)
- Select any two nations from searchable pickers.
- Visual comparative percentage bars for Population, Surface Area, and Population Density.
- Direct parameter matrix comparing currencies, driving sides, border counts, internet domains, and live weather.

### 🧭 Atlas Quest Geo Quiz (`/quiz`)
- 10 randomized geography questions generated dynamically from the loaded dataset (Flag identification, Capital challenge, Regional taxonomy).
- Instant visual feedback, streak bonus counters, and dynamic cartographic ranking.

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 18, React Router v6, Vite 5
- **Design System**: Liquid Glass Design System (`--background: 248 50% 6%`, Space Grotesk + Inter + JetBrains Mono)
- **Styling**: Tailwind CSS + Custom Glassmorphism tokens (`glass-card`, `glass-panel`, `glass-hover`, `glass-shimmer`)
- **Icons**: Lucide React
- **Mapping**: Leaflet.js with CartoDB Voyager tiles
- **Persistence**: LocalStorage with cross-component event subscription

---

## 💻 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Tahsin005/country-rest-api.git
cd country-rest-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Run Lint & Build
```bash
npm run lint
npm run build
```

# 🌍 World Explorer Navigator

A high-performance, modern cartographic dashboard built with **React** and the **REST Countries API**. This application provides a comprehensive geographic registry with technical data modules, visual identifiers, and optimized orbital scanning (search).

## 🚀 Key Features

### 🗺️ 'Modern Geographer' Design
- **Cartographic Interface**: A sleek UI built with a coordinate grid background and technical "Map Module" components.
- **Glassmorphism Aesthetic**: Vibrant dark/light themes with premium glass effects and modern typography (**Outfit**).
- **Lucide Iconography**: Professional, high-quality vector icons for all geographic datasets.

### ⚡ Technical Optimizations
- **Efficient Data Fetching**: Utilizes API **field filtering** to reduce payload size by up to 70%.
- **Batch Border Resolution**: Resolves neighboring countries in a single batch request using `/alpha?codes=...`.
- **Persistent Themes**: Full support for Dark and Light modes, remembered across browser sessions.

### 🔍 Intelligence & Navigation
- **Sector Navigator**: Combine multi-region filtering with real-time sector scanning (search).
- **Advanced Sorting**: Organize registries by Name, Population Mass, or Surface Area.
- **Enriched Records**: Accessible data for Native Names, Coat of Arms, Google Maps integration, and Socio-economic indicators.

## 🛠️ Tech Stack
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React
- **API**: [REST Countries v3.1](https://restcountries.com/)

---

## 💻 Getting Started

Follow these steps to deploy the World Explorer on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Tahsin005/country-rest-api.git
cd country-rest-api
```

### 2. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 3. Launch Development Console
Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 4. Build for Production
To generate a production-ready bundle:
```bash
npm run build
```

---

## 🔗 Live Registry
Visit the live deployment: [World Explorer Navigator](https://country-rest-api-react.vercel.app/)

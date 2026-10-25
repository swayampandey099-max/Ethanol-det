# Petrol Vehicle Ethanol Suitability & Fuel Analysis System

An automotive fuel compatibility and powertrain diagnostic platform designed for Indian petrol vehicles (cars, motorcycles, and scooters). Analyzes the effects of ethanol blending (E0 through E85) on engines, fuel delivery components, fuel economy, and long-term maintenance.

---

## Features

- **116+ Indian Petrol Vehicles**: Comprehensive database covering top Indian manufacturers:
  - **Cars & SUVs**: Maruti Suzuki, Hyundai, Tata Motors, Mahindra, Honda, Toyota, Kia, Volkswagen, Škoda, Renault, Nissan, MG.
  - **Two-Wheelers**: Hero MotoCorp, Bajaj Auto, TVS Motor, Royal Enfield, Honda (HMSI), Yamaha, Suzuki 2-Wheelers, KTM, Jawa / Yezdi.
  - Emission standard classifications: BS3 / BS4, BS6 Phase 1 (E10 compliant), and BS6 Phase 2 (E20 material compliant).
- **Interactive Fuel Formulation Selector**:
  - Continuous slider from 0% to 85% ethanol.
  - Quick-select presets for common blends: **E0** (Pure Petrol), **E5**, **E10** (BS6 Phase 1 standard), **E12**, **E15**, **E20** (Current India Rollout), **E25**, and **E85** (Flex-Fuel).
  - Built-in engine health tooltip detailing consequences across all blend levels.
- **Powertrain & Material Analysis**:
  - OEM compatibility verdict (Factory Certified, Marginal Caution, or Incompatible Hazard).
  - Real-world mileage degradation calculations based on volumetric energy density formulas.
  - Component-by-component material wear assessment (Fuel pump, injector seals, nitrile rubber lines, metallic tank sender units).
  - Cold-start vaporization and phase-separation moisture risks.
- **Easy Language Report**:
  - Full-screen, plain-language breakdown answering straightforward consumer questions:
    - *Can I fill this fuel?*
    - *How will my mileage drop in km/L?*
    - *Will it damage my engine pipes or pump?*
    - *Water in petrol warning (phase separation).*
    - *What to do at the petrol pump.*
- **Zero-Flicker Architecture**:
  - Instant client-side powertrain calculations for responsive UI interaction.
  - Background diagnostic verification without skeleton flickering or DOM unmounting.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, tsx.
- **Build Tool**: Vite.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/swayampandey099-max/Ethanol-det.git
   cd Ethanol-det
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── AppleVehicleSection.tsx    # Indian vehicle selection & filtering
│   │   ├── AppleEthanolSection.tsx    # Ethanol blend slider & health info
│   │   ├── AppleResultsSection.tsx    # Powertrain diagnostics display
│   │   ├── EasyReportModal.tsx        # Plain-language full-screen report
│   │   └── BlendComparisonModal.tsx   # Multi-blend side-by-side comparison
│   ├── data/
│   │   └── vehicles.ts                # 116+ Indian petrol vehicle specs & OEM ratings
│   ├── App.tsx                        # Main application orchestrator
│   ├── main.tsx                       # React application entry
│   └── index.css                      # Global styles & typography
├── server.ts                          # Express backend with Vite middleware
├── package.json
└── vite.config.ts
```

---

## Standards & Compliance

Aligned with Indian automotive and fuel standards:
- **IS 2796**: Motor Gasoline specification (Bureau of Indian Standards).
- **BS6 Phase 2 (April 2023 onwards)**: Material compliance for E20 fuel.
- **ARAI**: Automotive Research Association of India testing benchmarks.

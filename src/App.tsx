import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppleVehicleSection } from './components/AppleVehicleSection';
import { AppleEthanolSection } from './components/AppleEthanolSection';
import { AppleResultsSection } from './components/AppleResultsSection';
import { BlendComparisonModal } from './components/BlendComparisonModal';
import { EasyReportModal } from './components/EasyReportModal';
import { PETROL_VEHICLES, PetrolVehicle } from './data/vehicles';
import { AnalysisData } from './components/AiAnalysisResults';
import { Fuel, Activity, Layers, RotateCcw, FileText } from 'lucide-react';

// Client-side instant evaluation to prevent ANY visual flicker or screen jump
function getLocalPowertrainEvaluation(vehicle: PetrolVehicle, ethanolPct: number): AnalysisData {
  const oemCeiling = vehicle.oemEthanolCeilingPct ?? 10;
  const isOemApproved = ethanolPct <= oemCeiling;
  const isFlexFuel = oemCeiling >= 85;
  const isClassicOrPreBs6 = vehicle.category === 'Classic' || vehicle.fuelInjection.includes('Carbureted') || vehicle.fuelInjection.includes('Pre-BS6');

  let verdict: 'FULLY_COMPATIBLE' | 'CONDITIONAL_CAUTION' | 'INCOMPATIBLE_HAZARD';
  let verdictLabel: string;
  let score: number;

  if (isFlexFuel || (isOemApproved && !isClassicOrPreBs6)) {
    verdict = 'FULLY_COMPATIBLE';
    verdictLabel = `Factory Certified (Safe up to ${vehicle.oemMaxEthanolRating})`;
    score = Math.max(80, 95 - Math.round(ethanolPct * 0.1));
  } else if (isClassicOrPreBs6 && ethanolPct > 5) {
    verdict = 'INCOMPATIBLE_HAZARD';
    verdictLabel = `Severe Hazard for Carburetor & Older Rubber Lines`;
    score = Math.max(10, 40 - Math.round(ethanolPct * 0.4));
  } else if (ethanolPct <= oemCeiling + 5) {
    verdict = 'CONDITIONAL_CAUTION';
    verdictLabel = `Marginal Tolerance (${ethanolPct}% slightly exceeds ${vehicle.oemMaxEthanolRating} limit)`;
    score = 65;
  } else {
    verdict = 'INCOMPATIBLE_HAZARD';
    verdictLabel = `Non-Compliant (Exceeds factory limit by +${ethanolPct - oemCeiling}%)`;
    score = Math.max(15, 50 - (ethanolPct - oemCeiling));
  }

  const dropPct = ethanolPct <= 10
    ? '2.5% to 4.0%'
    : ethanolPct <= 20
    ? '4.5% to 6.8%'
    : ethanolPct <= 50
    ? '12% to 17%'
    : '24% to 29%';

  return {
    suitabilityVerdict: verdict,
    verdictLabel,
    headlineSummary: isOemApproved
      ? `${vehicle.make} ${vehicle.model} (${vehicle.variant}) is factory designed to run smoothly on E${ethanolPct} fuel with full component reliability.`
      : `Operating ${vehicle.model} on E${ethanolPct} exceeds factory design limits (${vehicle.oemMaxEthanolRating}). Risk of fuel pump wear, lean engine codes, and hose hardening.`,
    engineSafetyRecommendations: [
      ethanolPct > oemCeiling
        ? 'Dilute the tank with pure petrol (E0/E5) or certified low-blend fuel at your next refill.'
        : `Use recommended fuel grade (${vehicle.oemOctaneRecommendation}) from high-volume verified pumps.`,
      isClassicOrPreBs6
        ? 'Upgrade old rubber fuel hoses to ethanol-rated fluoroelastomer lines (SAE J30 R9 spec) and clean carburetor needle seats regularly.'
        : 'Avoid letting fuel sit unused in the tank for longer than 3-4 weeks due to atmospheric moisture absorption.',
      'Maintain timely engine oil changes to prevent unburned ethanol blow-by from thinning the crankcase oil.',
      'Check the fuel filter and fuel tank cap seal during regular service.'
    ],
    fuelDeliveryAndMaterialsIssues: [
      {
        component: 'Fuel Pump & Injectors',
        riskLevel: ethanolPct > oemCeiling ? 'High' : 'Low',
        explanation: ethanolPct > oemCeiling
          ? 'Ethanol has lower lubricating viscosity than petrol; prolonged high-blend use increases friction on pump plungers.'
          : 'Fuel pump components and injector seals are rated for this blend without damage.'
      },
      {
        component: 'Rubber Lines & Gaskets',
        riskLevel: isClassicOrPreBs6 && ethanolPct > 5 ? 'Critical' : ethanolPct > oemCeiling ? 'Moderate' : 'Low',
        explanation: isClassicOrPreBs6
          ? 'Older pre-2020 nitrile rubber lines stiffen and crack in presence of alcohol, presenting fuel leak risk.'
          : 'Modern synthetic elastomer lines prevent fuel permeation and swelling.'
      },
      {
        component: 'Fuel Tank & Sender Unit',
        riskLevel: ethanolPct > oemCeiling ? 'Moderate' : 'Negligible',
        explanation: 'Ethanol is conductive; moisture absorption can cause surface oxidation on metallic float sensors in older tanks.'
      }
    ],
    combustionAndEcuIssues: [
      {
        parameter: 'Air-Fuel Mixture & Fuel Trims',
        consequence: `E${ethanolPct} requires extra fuel volume to maintain stoichiometric balance. Modern ECU trims adapt within ±15% range.`
      },
      {
        parameter: 'Exhaust & Catalytic Converter',
        consequence: isOemApproved
          ? 'Exhaust gas temperatures remain within standard factory thermal thresholds.'
          : 'Excessive lean operation can elevate exhaust manifold temperatures under heavy throttle load.'
      }
    ],
    mileageAndEconomyConsequences: {
      estimatedMileageChangePct: `-${dropPct}`,
      energyDensityDrop: `Approx ${((32.4 - ((1 - ethanolPct/100)*32.4 + (ethanolPct/100)*21.2))/32.4 * 100).toFixed(1)}% reduction in fuel energy density compared to pure petrol.`,
      realWorldImpactSummary: `Expect ${dropPct} fewer kilometers per liter. The engine burns slightly more volume to match standard petrol output.`
    },
    coldStartAndVaporConcerns: ethanolPct >= 20
      ? 'Ethanol requires more heat to vaporize (904 kJ/kg). In cold winter mornings below 12°C, expect a slightly longer crank time.'
      : 'Cold morning ignition and throttle response remain within standard factory operating limits.',
    longTermMaintenanceWarnings: [
      'Moisture absorption: Water separates from ethanol if left parked for extended periods.',
      'Engine oil dilution: Cold running unburned fuel can wash cylinder walls over time.',
      'Fuel filter sediment: High alcohol cleans old tank deposits into the fuel filter.'
    ],
    phaseSeparationAndStorage: ethanolPct > 10
      ? 'Water absorption risk: Do not store fuel in tank for over 30 days without running the engine.'
      : 'Stable tank storage up to 60-90 days under normal atmospheric conditions.',
    technicalGradeScore: score,
    recommendedAction: isOemApproved
      ? 'Safe to refuel. No adjustments needed. Follow your normal scheduled maintenance.'
      : `Avoid continuous use of E${ethanolPct}. If filled by mistake, drive gently and top off with standard petrol when tank reaches half-empty.`
  };
}

export default function App() {
  const [vehicles] = useState<PetrolVehicle[]>(PETROL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<PetrolVehicle>(PETROL_VEHICLES[0]); // Maruti Swift 2024
  const [ethanolPct, setEthanolPct] = useState<number>(15);
  const [analysis, setAnalysis] = useState<AnalysisData>(() =>
    getLocalPowertrainEvaluation(PETROL_VEHICLES[0], 15)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isEasyReportOpen, setIsEasyReportOpen] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Background evaluation that enriches without flickering the screen
  const runBackgroundEvaluation = useCallback(
    async (vehicleToAnalyze: PetrolVehicle, pct: number) => {
      // 1. Immediately update client-side analysis so UI is instantly accurate with ZERO flicker
      const instantData = getLocalPowertrainEvaluation(vehicleToAnalyze, pct);
      setAnalysis(instantData);

      // 2. Smooth background call to server
      setIsLoading(true);
      try {
        const response = await fetch('/api/analyze-ethanol', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicle: vehicleToAnalyze,
            ethanolPct: pct,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.analysis?.suitabilityVerdict) {
            setAnalysis(data.analysis);
          }
        }
      } catch (error) {
        // Fallback already active; smooth silent recovery
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSelectVehicle = (vehicle: PetrolVehicle) => {
    setSelectedVehicle(vehicle);
    runBackgroundEvaluation(vehicle, ethanolPct);
  };

  const handleChangeEthanol = (pct: number) => {
    setEthanolPct(pct);
    // Instant local update to prevent flicker
    setAnalysis(getLocalPowertrainEvaluation(selectedVehicle, pct));

    // Debounce server call for smooth slider interaction
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      runBackgroundEvaluation(selectedVehicle, pct);
    }, 400);
  };

  const handleTriggerAnalysis = () => {
    runBackgroundEvaluation(selectedVehicle, ethanolPct);
  };

  const handleReset = () => {
    setSelectedVehicle(PETROL_VEHICLES[0]);
    setEthanolPct(15);
    runBackgroundEvaluation(PETROL_VEHICLES[0], 15);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative selection:bg-blue-600 selection:text-white pb-16">
      {/* Ambient background subtle lighting */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Top Navbar */}
      <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-full px-5 py-3 flex items-center justify-between shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Petrol Vehicle Ethanol Suitability System
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Indian Cars & Bikes Fuel Compatibility and Mileage Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEasyReportOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Easy Report</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all hidden sm:flex"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Multi-Blend Matrix</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
              title="Reset selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: 3 Clean Sequential Sections */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        {/* SECTION 1: Select Indian Car or Bike */}
        <AppleVehicleSection
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleSelectVehicle}
        />

        {/* SECTION 2: Select Fuel Formulation */}
        <AppleEthanolSection
          ethanolPct={ethanolPct}
          onChangeEthanol={handleChangeEthanol}
          selectedVehicle={selectedVehicle}
        />

        {/* Action Trigger Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 pb-1">
          <button
            type="button"
            onClick={handleTriggerAnalysis}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Testing Fuel Compatibility...' : 'Test Compatibility & Mileage'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEasyReportOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>View Easy Language Report</span>
          </button>
        </div>

        {/* SECTION 3: Diagnostic Results */}
        <AppleResultsSection
          analysis={analysis}
          loading={isLoading}
          vehicle={selectedVehicle}
          ethanolPct={ethanolPct}
          onRefresh={handleTriggerAnalysis}
          onOpenEasyReport={() => setIsEasyReportOpen(true)}
        />
      </main>

      {/* Easy Language Full Screen Report Modal */}
      <EasyReportModal
        isOpen={isEasyReportOpen}
        onClose={() => setIsEasyReportOpen(false)}
        vehicle={selectedVehicle}
        ethanolPct={ethanolPct}
        analysis={analysis}
      />

      {/* Multi-Blend Matrix Modal */}
      <BlendComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        vehicle={selectedVehicle}
        currentEthanolPct={ethanolPct}
      />

      {/* Clean Footer without AI or morphism jargon */}
      <footer className="mt-16 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4">
          <p>
            Automotive Petrol Vehicle Fuel Compatibility System · Compliant with IS 2796 & BS6 Phase 2 Standards
          </p>
        </div>
      </footer>
    </div>
  );
}

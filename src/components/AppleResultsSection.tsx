import React, { useState } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { AnalysisData } from './AiAnalysisResults';
import { calculateDedicatedVehicleFuelMetrics } from '../utils/fuelPhysics';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Gauge,
  Wrench,
  Fuel,
  Droplets,
  ThermometerSnowflake,
  ChevronDown,
  CheckCircle2,
  Printer,
  RotateCw,
  FileText,
  Flame,
  Zap,
  TrendingDown,
  Coins,
} from 'lucide-react';

interface AppleResultsSectionProps {
  analysis: AnalysisData | null;
  loading: boolean;
  vehicle: PetrolVehicle;
  ethanolPct: number;
  onRefresh: () => void;
  onOpenEasyReport: () => void;
}

export const AppleResultsSection: React.FC<AppleResultsSectionProps> = ({
  analysis,
  loading,
  vehicle,
  ethanolPct,
  onRefresh,
  onOpenEasyReport,
}) => {
  const [showTechnicalSpecs, setShowTechnicalSpecs] = useState(false);

  if (!analysis) return null;

  const isCompatible = analysis.suitabilityVerdict === 'FULLY_COMPATIBLE';
  const isCaution = analysis.suitabilityVerdict === 'CONDITIONAL_CAUTION';
  const isHazard = analysis.suitabilityVerdict === 'INCOMPATIBLE_HAZARD';

  // Dedicated exact metrics for the chosen ethanol level
  const dedicated = analysis.dedicatedMetrics || calculateDedicatedVehicleFuelMetrics(vehicle, ethanolPct);

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 transition-all relative overflow-hidden space-y-6">
      {/* Smooth non-flicker subtle loading bar when testing updates */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 overflow-hidden z-20">
          <div className="h-full bg-blue-600 animate-[move_1.2s_ease-in-out_infinite] w-1/3" />
        </div>
      )}

      {/* Background ambient light */}
      <div
        className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isCompatible
            ? 'bg-emerald-400'
            : isCaution
            ? 'bg-amber-400'
            : 'bg-rose-400'
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-5 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Dedicated E{ethanolPct} Result
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-700 font-semibold">
              {ethanolPct}% Ethanol + {100 - ethanolPct}% Petrol
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              {vehicle.make} {vehicle.model}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Engine Health & Dedicated Fuel Compatibility
          </h2>
        </div>

        {/* Action Buttons: Easy Language Report & Export */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenEasyReport}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Easy Language Report</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Print report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            title="Re-run test"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Verdict Card */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border backdrop-blur-xl relative overflow-hidden shadow-xs ${
          isCompatible
            ? 'bg-gradient-to-r from-emerald-500/10 via-white/80 to-teal-500/10 border-emerald-300'
            : isCaution
            ? 'bg-gradient-to-r from-amber-500/10 via-white/80 to-yellow-500/10 border-amber-300'
            : 'bg-gradient-to-r from-rose-500/10 via-white/80 to-red-500/10 border-rose-300'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isCompatible
                    ? 'bg-emerald-100 text-emerald-800'
                    : isCaution
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCompatible ? `Safe for E${ethanolPct}` : isCaution ? `Use E${ethanolPct} with Caution` : `E${ethanolPct} Not Recommended`}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                {dedicated.statusLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isCompatible ? (
                <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              ) : isCaution ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              ) : (
                <AlertOctagon className="w-8 h-8 text-rose-600 flex-shrink-0" />
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {analysis.verdictLabel}
              </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {analysis.headlineSummary}
            </p>
          </div>

          {/* Compatibility Score */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 text-center min-w-[130px] shadow-xs self-start md:self-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Match Index
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 mt-0.5">
              {analysis.technicalGradeScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span
              className={`text-[10px] font-bold block mt-0.5 ${
                isCompatible
                  ? 'text-emerald-600'
                  : isCaution
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {analysis.technicalGradeScore >= 80
                ? 'High Tolerance'
                : analysis.technicalGradeScore >= 50
                ? 'Borderline'
                : 'High Hazard'}
            </span>
          </div>
        </div>

        {/* Immediate Driver Directive Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-white/80 border border-slate-200/80 backdrop-blur-md text-xs flex items-start gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">
              Driver Recommendation for E{ethanolPct}:
            </span>
            <p className="text-slate-600 mt-0.5 leading-relaxed font-medium">
              {analysis.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* DEDICATED EXACT METRICS DASHBOARD (6 EXACT VALUES, NO RANGES) */}
      <div className="glass-panel-subtle rounded-2xl p-6 border border-white/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Dedicated E{ethanolPct} Performance & Mileage Diagnostics
              </h4>
              <p className="text-xs text-slate-500">
                Exact physics calculations specifically for {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Dedicated Readout
          </span>
        </div>

        {/* 6 Exact Dedicated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1: Exact Mileage Drop */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Exact Mileage Change</span>
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {dedicated.exactMileageDropPct}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Exact drop vs pure E0 petrol
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Pure petrol has 32.4 MJ/L vs {dedicated.exactEnergyDensityMjL} MJ/L
            </div>
          </div>

          {/* Card 2: Real-World Mileage in km/L */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Real-World Efficiency</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-blue-600">
                {dedicated.exactMileageOnBlendKmpl} <span className="text-base font-bold text-slate-600">km/L</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                Drops from <span className="font-bold">{dedicated.baselineMileageKmpl} km/L</span> (-{dedicated.exactKmDropPerLiter} km/L)
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Calibrated to {vehicle.model} factory rating
            </div>
          </div>

          {/* Card 3: Full Tank Driving Range */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Full Tank Range</span>
              <Fuel className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {dedicated.exactRangeOnBlendKm} <span className="text-base font-bold text-slate-600">km</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                Range loss of <strong className="text-rose-600">-{dedicated.exactRangeLossKm} km</strong> per full tank
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Based on {vehicle.tankCapacityLiters}L fuel tank capacity
            </div>
          </div>

          {/* Card 4: Dedicated Blended Octane (RON) */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Octane Rating (RON)</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {dedicated.exactOctaneRatingRon} <span className="text-base font-bold text-slate-600">RON</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                Anti-knock resistance vs base 91 RON
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Higher octane prevents pre-ignition knock
            </div>
          </div>

          {/* Card 5: Stoichiometric Air-Fuel Ratio (AFR) */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Air-Fuel Ratio (AFR)</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {dedicated.exactStoichiometricAfr}:1
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                Demands <strong className="text-blue-700">+{dedicated.exactFuelMassIncreasePct}%</strong> extra fuel injection
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Stoichiometric balance for closed-loop ECU
            </div>
          </div>

          {/* Card 6: Estimated Fuel Spend Impact */}
          <div className="bg-white/95 p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Extra Spend / 1,000 km</span>
              <Coins className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-1">
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                +₹{dedicated.estimatedExtraCostPer1000km}
              </div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                From fuel energy density reduction
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
              Calculated at average ₹96.72 / litre petrol
            </div>
          </div>
        </div>

        {/* Real-world driving explanation */}
        <div className="bg-white/90 p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Real-World Road Impact for E{ethanolPct}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {analysis.mileageAndEconomyConsequences.realWorldImpactSummary}
          </p>
        </div>
      </div>

      {/* Safety Recommendations for the Engine */}
      <div className="glass-panel-subtle rounded-2xl p-6 border border-white/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Engine Safety & Operational Guidelines
            </h4>
            <p className="text-xs text-slate-500">
              Proactive measures to protect fuel injectors and combustion chambers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.engineSafetyRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/90 border border-slate-200 shadow-xs flex items-start gap-3 text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Component Compatibility & Long-Term Maintenance */}
      <div className="glass-panel-subtle rounded-2xl p-6 border border-white/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Component Wear & Long-Term Concerns
            </h4>
            <p className="text-xs text-slate-500">
              Material degradation across fuel lines, pumps, and water absorption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analysis.fuelDeliveryAndMaterialsIssues.map((item, idx) => {
            const isHigh = item.riskLevel.toLowerCase().includes('high') || item.riskLevel.toLowerCase().includes('critical');
            const isMod = item.riskLevel.toLowerCase().includes('moderate');

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/90 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {item.component}
                    </h5>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700'
                          : isMod
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Moisture & Cold Weather Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-white/90 border border-slate-200 shadow-xs text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold mb-1">
              <Droplets className="w-4 h-4" />
              <span>Water Absorption & Phase Separation</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {analysis.phaseSeparationAndStorage}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-slate-200 shadow-xs text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-sky-600 font-bold mb-1">
              <ThermometerSnowflake className="w-4 h-4" />
              <span>Cold Weather Starting</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {analysis.coldStartAndVaporConcerns}
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible Engineering Parameters */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowTechnicalSpecs(!showTechnicalSpecs)}
          className="w-full py-3 px-5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-between transition-all shadow-xs"
        >
          <span>{showTechnicalSpecs ? 'Hide Technical Engineering Parameters' : 'Show Technical Engineering Parameters (ECU, Stoichiometry, Trims)'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showTechnicalSpecs ? 'rotate-180' : ''}`} />
        </button>

        {showTechnicalSpecs && (
          <div className="mt-3 p-5 rounded-2xl bg-white/90 border border-slate-200 space-y-4 text-xs">
            <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              Combustion Dynamics & ECU Long-Term Fuel Trims
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.combustionAndEcuIssues.map((issue, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">{issue.parameter}</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">{issue.consequence}</p>
                </div>
              ))}
            </div>

            <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px] pt-1">
              Preventive Maintenance Checklist
            </h5>
            <ul className="space-y-1.5 text-slate-600">
              {analysis.longTermMaintenanceWarnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

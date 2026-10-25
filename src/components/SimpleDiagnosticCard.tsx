import React, { useState } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { AnalysisData } from './AiAnalysisResults';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Gauge,
  Wrench,
  Fuel,
  Droplets,
  ChevronDown,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface SimpleDiagnosticCardProps {
  analysis: AnalysisData | null;
  loading: boolean;
  vehicle: PetrolVehicle;
  ethanolPct: number;
  source?: string;
  onRefresh: () => void;
}

export const SimpleDiagnosticCard: React.FC<SimpleDiagnosticCardProps> = ({
  analysis,
  loading,
  vehicle,
  ethanolPct,
  source,
  onRefresh,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (loading) {
    return (
      <div className="bg-white border border-zinc-300 p-8 sm:p-12 text-center space-y-4">
        <div className="inline-flex p-3 bg-zinc-100 border border-zinc-300 animate-pulse">
          <Activity className="w-6 h-6 text-zinc-950" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-950">
            Checking fuel compatibility...
          </h3>
          <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
            Analyzing {vehicle.year} {vehicle.make} {vehicle.model} on E{ethanolPct} fuel.
          </p>
        </div>
        <div className="w-40 h-1 bg-zinc-200 mx-auto overflow-hidden">
          <div className="w-1/2 h-full bg-zinc-950 animate-[move_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const isCompatible = analysis.suitabilityVerdict === 'FULLY_COMPATIBLE';
  const isCaution = analysis.suitabilityVerdict === 'CONDITIONAL_CAUTION';
  const isHazard = analysis.suitabilityVerdict === 'INCOMPATIBLE_HAZARD';

  return (
    <div className="bg-white border border-zinc-300 space-y-6">
      {/* 1. Clear Verdict Card */}
      <div
        className={`p-6 border-b ${
          isCompatible
            ? 'bg-zinc-950 text-white'
            : isCaution
            ? 'bg-amber-950 text-white'
            : 'bg-zinc-950 text-white border-b-4 border-b-red-600'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-75">
                Compatibility Result
              </span>
              <span className="opacity-40">·</span>
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 border border-white/20">
                {source === 'groq-ai'
                  ? 'AI Verified (Groq)'
                  : source === 'gemini-ai'
                  ? 'AI Verified (Gemini)'
                  : 'Powertrain Model'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              {isCompatible ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              ) : isCaution ? (
                <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {analysis.verdictLabel}
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 mt-2 leading-relaxed max-w-2xl">
              {analysis.headlineSummary}
            </p>
          </div>

          {/* Quick Score */}
          <div className="bg-white/10 p-3.5 border border-white/20 min-w-[120px] text-center self-start sm:self-auto">
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 block">
              Match Score
            </span>
            <div className="text-2xl font-mono font-bold mt-0.5">
              {analysis.technicalGradeScore}/100
            </div>
            <span className="text-[10px] opacity-80 block mt-0.5">
              {isCompatible ? 'Approved' : isCaution ? 'Caution' : 'Not Advised'}
            </span>
          </div>
        </div>

        {/* Clear Action For Driver */}
        <div className="mt-5 p-3 bg-black/40 border border-white/15 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              What you should do:
            </span>
            <p className="text-zinc-200 mt-0.5 leading-relaxed font-medium">
              {analysis.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 2. Mileage & Fuel Economy (In Simple Terms) */}
        <div className="bg-zinc-50 border border-zinc-300 p-5">
          <div className="flex items-center gap-2 mb-2 text-zinc-950">
            <Gauge className="w-5 h-5 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Mileage & Fuel Consumption Impact
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="bg-white p-4 border border-zinc-200">
              <span className="text-xs text-zinc-500 font-semibold block uppercase font-mono">
                Mileage Drop
              </span>
              <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                {analysis.mileageAndEconomyConsequences.estimatedMileageChangePct}
              </div>
              <span className="text-xs text-zinc-500 mt-0.5 block">
                Compared to pure petrol
              </span>
            </div>

            <div className="bg-white p-4 border border-zinc-200 md:col-span-2">
              <span className="text-xs text-zinc-500 font-semibold block uppercase font-mono">
                Real-World Consequence
              </span>
              <p className="text-xs text-zinc-800 mt-1.5 leading-relaxed font-medium">
                {analysis.mileageAndEconomyConsequences.realWorldImpactSummary}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {analysis.mileageAndEconomyConsequences.energyDensityDrop}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Safety Recommendations for Engine */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-zinc-950">
            <Wrench className="w-5 h-5 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Safety Recommendations for Your Engine
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.engineSafetyRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-zinc-50 border border-zinc-200 flex items-start gap-3 text-xs"
              >
                <span className="w-5 h-5 bg-zinc-950 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-zinc-800 leading-relaxed font-medium">
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Component Compatibility (Fuel lines, Pump, Water) */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-zinc-950">
            <Fuel className="w-5 h-5 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Long-Term Parts Wear & Concerns
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.fuelDeliveryAndMaterialsIssues.map((item, idx) => {
              const isHigh = item.riskLevel.toLowerCase().includes('high') || item.riskLevel.toLowerCase().includes('critical');
              const isMod = item.riskLevel.toLowerCase().includes('moderate');

              return (
                <div key={idx} className="p-4 bg-white border border-zinc-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <h4 className="text-xs font-bold text-zinc-950 truncate">{item.component}</h4>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                          isHigh
                            ? 'bg-red-50 text-red-900 border-red-300'
                            : isMod
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Water & Cold Start Concerns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 text-xs">
              <span className="font-bold text-zinc-950 block mb-1">
                💧 Water in Fuel Tank (Moisture)
              </span>
              <p className="text-zinc-600 leading-relaxed">
                {analysis.phaseSeparationAndStorage}
              </p>
            </div>
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 text-xs">
              <span className="font-bold text-zinc-950 block mb-1">
                ❄️ Cold Morning Starts
              </span>
              <p className="text-zinc-600 leading-relaxed">
                {analysis.coldStartAndVaporConcerns}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Optional Collapsible Technical Engineering Details */}
        <div className="border-t border-zinc-200 pt-4">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <span>{showTechnicalDetails ? 'Hide Detailed Engineering Specs' : 'View Detailed Engineering Specs (ECU, Trims, AFR)'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-4 bg-zinc-50 border border-zinc-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-zinc-900 text-[11px]">
                ECU Fuel Trims & Engine Management
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.combustionAndEcuIssues.map((issue, idx) => (
                  <div key={idx} className="bg-white p-3 border border-zinc-200">
                    <span className="font-bold text-zinc-950 block">{issue.parameter}</span>
                    <p className="text-zinc-600 mt-1 leading-relaxed">{issue.consequence}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-bold uppercase tracking-wider text-zinc-900 text-[11px] pt-2">
                Long-Term Warnings
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-zinc-700">
                {analysis.longTermMaintenanceWarnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Refresh */}
        <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
          <span>Results customized for {vehicle.year} {vehicle.make} {vehicle.model}</span>
          <button
            onClick={onRefresh}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors"
          >
            Re-run Check
          </button>
        </div>
      </div>
    </div>
  );
};

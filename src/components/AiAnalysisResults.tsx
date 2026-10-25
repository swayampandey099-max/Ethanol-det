import React from 'react';
import { PetrolVehicle } from '../data/vehicles';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Wrench,
  Fuel,
  Gauge,
  ThermometerSnowflake,
  Clock,
  Activity,
  Droplets,
  CheckCircle2,
  FileText,
  AlertOctagon,
} from 'lucide-react';
import { DedicatedVehicleFuelMetrics } from '../utils/fuelPhysics';

export interface AnalysisData {
  suitabilityVerdict: 'FULLY_COMPATIBLE' | 'CONDITIONAL_CAUTION' | 'INCOMPATIBLE_HAZARD';
  verdictLabel: string;
  headlineSummary: string;
  engineSafetyRecommendations: string[];
  fuelDeliveryAndMaterialsIssues: Array<{
    component: string;
    riskLevel: string;
    explanation: string;
  }>;
  combustionAndEcuIssues: Array<{
    parameter: string;
    consequence: string;
  }>;
  mileageAndEconomyConsequences: {
    estimatedMileageChangePct: string;
    energyDensityDrop: string;
    realWorldImpactSummary: string;
  };
  coldStartAndVaporConcerns: string;
  longTermMaintenanceWarnings: string[];
  phaseSeparationAndStorage: string;
  technicalGradeScore: number;
  recommendedAction: string;
  dedicatedMetrics?: DedicatedVehicleFuelMetrics;
}

interface AiAnalysisResultsProps {
  analysis: AnalysisData | null;
  loading: boolean;
  vehicle: PetrolVehicle;
  ethanolPct: number;
  source?: string;
  onRefresh: () => void;
}

export const AiAnalysisResults: React.FC<AiAnalysisResultsProps> = ({
  analysis,
  loading,
  vehicle,
  ethanolPct,
  source,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 p-8 sm:p-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-zinc-100 border border-zinc-300 animate-pulse">
          <Activity className="w-6 h-6 text-zinc-900" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">
            Running Powertrain Engineering AI Diagnostic...
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Analyzing {vehicle.year} {vehicle.make} {vehicle.model} against E{ethanolPct} fuel mixture.
            Evaluating stoichiometry, elastomeric material degradation, and fuel trim margins.
          </p>
        </div>
        <div className="w-48 h-1.5 bg-zinc-200 mx-auto overflow-hidden">
          <div className="w-1/2 h-full bg-zinc-900 animate-[move_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-zinc-200 p-8 text-center">
        <Fuel className="w-8 h-8 mx-auto text-zinc-400 mb-2 stroke-1" />
        <h3 className="text-sm font-bold text-zinc-900">Diagnostics Ready</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
          Select a vehicle and adjust the ethanol blend, then initiate technical evaluation.
        </p>
      </div>
    );
  }

  const isCompatible = analysis.suitabilityVerdict === 'FULLY_COMPATIBLE';
  const isCaution = analysis.suitabilityVerdict === 'CONDITIONAL_CAUTION';
  const isHazard = analysis.suitabilityVerdict === 'INCOMPATIBLE_HAZARD';

  return (
    <div className="bg-white border border-zinc-200 space-y-6">
      {/* Verdict Header Banner */}
      <div
        className={`p-6 border-b ${
          isCompatible
            ? 'bg-zinc-900 text-white border-zinc-900'
            : isCaution
            ? 'bg-amber-900 text-white border-amber-950'
            : 'bg-zinc-950 text-white border-red-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">
                Official Engineering Suitability Verdict
              </span>
              <span className="opacity-50">·</span>
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 border border-white/20">
                {source === 'groq-ai'
                  ? 'Verified by Groq AI'
                  : source === 'gemini-ai'
                  ? 'Verified by Gemini 3.8 Flash'
                  : 'Engineering Powertrain Model'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {isCompatible ? (
                <ShieldCheck className="w-7 h-7 text-emerald-400 flex-shrink-0" />
              ) : isCaution ? (
                <AlertTriangle className="w-7 h-7 text-amber-300 flex-shrink-0" />
              ) : (
                <AlertOctagon className="w-7 h-7 text-red-400 flex-shrink-0" />
              )}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {analysis.verdictLabel}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 max-w-3xl leading-relaxed pt-1">
              {analysis.headlineSummary}
            </p>
          </div>

          {/* Technical Grade Badge */}
          <div className="flex items-center md:flex-col justify-between md:justify-center border border-white/20 bg-white/5 p-4 min-w-[140px] text-right md:text-center self-start md:self-auto">
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
              Alignment Score
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight mt-0.5">
              {analysis.technicalGradeScore}
              <span className="text-sm font-normal opacity-60">/100</span>
            </div>
            <span className="text-[10px] opacity-75 uppercase tracking-wide mt-1">
              {analysis.technicalGradeScore >= 80
                ? 'High Tolerance'
                : analysis.technicalGradeScore >= 50
                ? 'Marginal Range'
                : 'Severe Mismatch'}
            </span>
          </div>
        </div>

        {/* Immediate Driver Action Box */}
        <div className="mt-5 p-3.5 bg-black/30 border border-white/15 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              Immediate Operator Action
            </span>
            <p className="text-zinc-200 mt-0.5 leading-relaxed">{analysis.recommendedAction}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Section 1: Engine Safety Recommendations */}
        <div>
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Engine Safety & Operational Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.engineSafetyRecommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3.5 bg-zinc-50 border border-zinc-200 text-xs flex items-start gap-3"
              >
                <div className="w-5 h-5 bg-zinc-900 text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{index + 1}
                </div>
                <p className="text-zinc-800 leading-relaxed font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Fuel Delivery & Material Compatibility */}
        <div>
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
            <Wrench className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Fuel Delivery & Material Degradation Risks
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.fuelDeliveryAndMaterialsIssues.map((item, index) => {
              const isHigh = item.riskLevel.toLowerCase().includes('high') || item.riskLevel.toLowerCase().includes('critical');
              const isMod = item.riskLevel.toLowerCase().includes('moderate');

              return (
                <div key={index} className="p-4 bg-white border border-zinc-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-xs text-zinc-950 truncate">{item.component}</span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                          isHigh
                            ? 'bg-red-50 text-red-900 border-red-300'
                            : isMod
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}
                      >
                        {item.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Combustion, ECU & Mileage Consequences */}
        <div>
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
            <Gauge className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Combustion Dynamics & Mileage Consequences
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mileage Card */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold block">
                  Volumetric Fuel Economy Impact
                </span>
                <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                  {analysis.mileageAndEconomyConsequences.estimatedMileageChangePct}
                </div>
                <div className="text-xs text-zinc-600 font-medium mt-1">
                  {analysis.mileageAndEconomyConsequences.energyDensityDrop}
                </div>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  {analysis.mileageAndEconomyConsequences.realWorldImpactSummary}
                </p>
              </div>
            </div>

            {/* ECU & Combustion Parameters */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.combustionAndEcuIssues.map((issue, index) => (
                <div key={index} className="p-3.5 bg-white border border-zinc-200">
                  <span className="font-bold text-xs text-zinc-950 block">{issue.parameter}</span>
                  <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{issue.consequence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Long-Term Maintenance & Storage Concerns */}
        <div>
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4">
            <Clock className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Long-Term Maintenance & Environmental Storage
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cold Start & Vapor Lock */}
            <div className="p-4 bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 mb-2 text-zinc-900">
                <ThermometerSnowflake className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wide">
                  Cold Start & Vapor Lock Behavior
                </h4>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                {analysis.coldStartAndVaporConcerns}
              </p>
            </div>

            {/* Phase Separation & Water Absorption */}
            <div className="p-4 bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2 mb-2 text-zinc-900">
                <Droplets className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wide">
                  Atmospheric Phase Separation & Shelf-Life
                </h4>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                {analysis.phaseSeparationAndStorage}
              </p>
            </div>

            {/* Bulleted Warnings */}
            <div className="md:col-span-2 p-4 bg-white border border-zinc-200">
              <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-900 mb-2.5">
                Key Preventive Service Protocols
              </h4>
              <ul className="space-y-2 text-xs text-zinc-700">
                {analysis.longTermMaintenanceWarnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-900 flex-shrink-0 mt-1.5" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Disclaimer & Re-analyze Bar */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            <span>Powertrain evaluation tailored for {vehicle.make} {vehicle.model} ({vehicle.variant}).</span>
            <span className="block mt-0.5">Always verify regional fuel quality standards and official vehicle owner documentation.</span>
          </div>
          <button
            onClick={onRefresh}
            className="self-start sm:self-auto px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold border border-zinc-300 transition-colors"
          >
            Re-run Diagnostic Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

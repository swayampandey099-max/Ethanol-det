import React from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { AnalysisData } from './AiAnalysisResults';
import { calculateDedicatedVehicleFuelMetrics } from '../utils/fuelPhysics';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Fuel,
  Gauge,
  ShieldCheck,
  Droplets,
  Printer,
  HelpCircle,
  Coins,
} from 'lucide-react';

interface EasyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: PetrolVehicle;
  ethanolPct: number;
  analysis: AnalysisData | null;
}

export const EasyReportModal: React.FC<EasyReportModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  ethanolPct,
  analysis,
}) => {
  if (!isOpen || !analysis) return null;

  const isSafe = analysis.suitabilityVerdict === 'FULLY_COMPATIBLE';
  const isCaution = analysis.suitabilityVerdict === 'CONDITIONAL_CAUTION';
  const isHazard = analysis.suitabilityVerdict === 'INCOMPATIBLE_HAZARD';

  // Dedicated exact metrics
  const dedicated = analysis.dedicatedMetrics || calculateDedicatedVehicleFuelMetrics(vehicle, ethanolPct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                isSafe
                  ? 'bg-emerald-600'
                  : isCaution
                  ? 'bg-amber-500'
                  : 'bg-rose-600'
              }`}
            >
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Vehicle Fuel Report (Easy Language)
              </h2>
              <p className="text-xs text-slate-500">
                {vehicle.year} {vehicle.make} {vehicle.model} · Tested with <strong>E{ethanolPct} Petrol</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body in Simple, Human Language */}
        <div className="p-6 space-y-6">
          {/* Big Direct Answer */}
          <div
            className={`p-6 rounded-2xl border ${
              isSafe
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : isCaution
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSafe ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              ) : isCaution ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                  Direct Answer
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isSafe
                    ? 'Yes, You Can Fill This Fuel Safely!'
                    : isCaution
                    ? 'Use With Caution (Fill Only If Necessary)'
                    : 'Do Not Use This Fuel In Your Vehicle!'}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed opacity-90">
              {isSafe
                ? `Your ${vehicle.make} ${vehicle.model} was manufactured to safely run on fuel with up to ${vehicle.oemMaxEthanolRating} (${vehicle.oemEthanolCeilingPct}% ethanol). E${ethanolPct} will not damage your engine parts or void warranty.`
                : isCaution
                ? `E${ethanolPct} is slightly above your car's factory recommendation of ${vehicle.oemMaxEthanolRating}. You can drive with it if filled by mistake, but do not make it a regular habit.`
                : `Your vehicle was designed for maximum ${vehicle.oemMaxEthanolRating} (${vehicle.oemEthanolCeilingPct}%). E${ethanolPct} contains far too much alcohol and will corrode standard fuel pipes, strain the fuel pump, and cause engine stuttering.`}
            </p>
          </div>

          {/* Question 1: What happens to my mileage? */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Gauge className="w-5 h-5 text-blue-600" />
              <h4>1. How will E{ethanolPct} affect my mileage & fuel cost?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Exact Mileage Drop</span>
                <div className="text-2xl font-bold text-slate-900 mt-0.5">
                  {dedicated.exactMileageDropPct}%
                </div>
                <span className="text-[11px] text-slate-400">vs pure E0 petrol</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Real-World Average</span>
                <div className="text-xl font-bold text-blue-600 mt-0.5">
                  {dedicated.exactMileageOnBlendKmpl} km/L
                </div>
                <span className="text-[11px] text-slate-500">
                  from {dedicated.baselineMileageKmpl} km/L (-{dedicated.exactKmDropPerLiter} km/L)
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Full Tank Range ({vehicle.tankCapacityLiters}L)</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {dedicated.exactRangeOnBlendKm} km
                </div>
                <span className="text-[11px] text-rose-600 font-semibold">
                  -{dedicated.exactRangeLossKm} km per tank
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Estimated additional spend per 1,000 km driven:</span>
              <span className="font-bold text-slate-900 font-mono">+₹{dedicated.estimatedExtraCostPer1000km}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Why mileage drops:</strong> Ethanol holds less chemical energy (21.2 MJ/L) than pure petrol (32.4 MJ/L). At E{ethanolPct}, the blend contains {dedicated.exactEnergyDensityMjL} MJ/L, so the engine burns +{dedicated.exactFuelMassIncreasePct}% extra fuel to produce equivalent power.
            </p>
          </div>

          {/* Question 2: Will it harm my engine? */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h4>2. Will it harm my engine or fuel pipes?</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Rubber Pipes & Seals</span>
                <span className={`text-xs font-bold mt-1 block ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isSafe ? 'Safe (No Damage)' : 'Risk of Hardening & Leaks'}
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isSafe
                    ? 'Your pipes use ethanol-resistant Viton rubber.'
                    : 'Ethanol dries out older rubber pipes over time.'}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Fuel Pump</span>
                <span className={`text-xs font-bold mt-1 block ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isSafe ? 'Normal Wear' : 'Extra Friction & Heat'}
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  {isSafe
                    ? 'Pump is designed for this blend.'
                    : 'Ethanol is less slippery than petrol, causing pump friction.'}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Engine Pickup</span>
                <span className={`text-xs font-bold mt-1 block ${isSafe ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isSafe ? 'Smooth Acceleration' : 'Possible Lag or Misfire'}
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Engine computer compensates fuel delivery within normal limits.
                </p>
              </div>
            </div>
          </div>

          {/* Question 3: Water in Petrol (Phase Separation) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Droplets className="w-5 h-5 text-cyan-600" />
              <h4>3. Important: Water moisture warning</h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Ethanol attracts water from the air like a sponge. If you park your {vehicle.vehicleType.toLowerCase()} without driving for more than <strong>3 to 4 weeks</strong>, the water and ethanol can separate from the petrol and settle at the bottom of the fuel tank. This makes starting difficult and can rust the tank.
            </p>
          </div>

          {/* Practical Checklist at the Petrol Pump */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-3">
            <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              What you should do at the petrol bunk:
            </h4>
            <ul className="space-y-2 text-xs text-blue-900">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Check the dispenser label:</strong> Most Indian petrol pumps now dispense E20 or E12. Your {vehicle.make} {vehicle.model} factory limit is <strong>{vehicle.oemMaxEthanolRating}</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>If filled high ethanol by mistake:</strong> Don't panic. Drive normally, avoid revving hard, and when the tank is half empty, top off with regular pure or premium petrol.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>Keep fuel fresh:</strong> Refuel regularly rather than letting old fuel sit in the tank for months.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Automotive Fuel Diagnostic Standard
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

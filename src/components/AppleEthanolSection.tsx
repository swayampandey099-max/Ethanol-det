import React, { useState } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { calculateFuelPhysics } from '../utils/fuelPhysics';
import { Droplets, ShieldCheck, AlertTriangle, AlertOctagon, Flame, Gauge, Zap, Info } from 'lucide-react';

interface AppleEthanolSectionProps {
  ethanolPct: number;
  onChangeEthanol: (pct: number) => void;
  selectedVehicle: PetrolVehicle;
}

export const AppleEthanolSection: React.FC<AppleEthanolSectionProps> = ({
  ethanolPct,
  onChangeEthanol,
  selectedVehicle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const presets = [
    { label: 'E0', pct: 0, name: 'Pure Petrol' },
    { label: 'E5', pct: 5, name: '5% Blend' },
    { label: 'E10', pct: 10, name: 'Standard Regular' },
    { label: 'E15', pct: 15, name: 'Unleaded 88' },
    { label: 'E20', pct: 20, name: 'Mandated Blend' },
    { label: 'E25', pct: 25, name: '25% Blend' },
    { label: 'E85', pct: 85, name: 'Flex Fuel' },
    { label: 'E100', pct: 100, name: 'Pure Ethanol' },
  ];

  const oemCeiling = selectedVehicle.oemEthanolCeilingPct;
  const isSafe = ethanolPct <= oemCeiling;
  const isCaution = !isSafe && ethanolPct <= oemCeiling + 5;
  const physics = calculateFuelPhysics(ethanolPct);

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 transition-all relative overflow-hidden">
      {/* Ambient watermorphic glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Step 2 · Fuel Formulation
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ethanol-in-Petrol Concentration
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Set Ethanol Blend Level
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Test different commercial and custom petrol mixtures from E0 to E100.
          </p>
        </div>

        <div className="text-xs text-slate-700 font-medium bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
          Your Vehicle's Factory Ceiling: <strong className="text-slate-900">{selectedVehicle.oemMaxEthanolRating} ({oemCeiling}%)</strong>
        </div>
      </div>

      {/* Fuel Ratio Chamber */}
      <div className="mb-6 p-5 glass-panel-subtle rounded-2xl border border-white/80 bg-gradient-to-b from-white/80 to-slate-50/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Visual Liquid Indicator Bar */}
          <div className="w-full md:w-2/3 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-xs" />
                Pure Petrol ({100 - ethanolPct}%)
              </span>
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block shadow-xs" />
                Ethanol Biofuel ({ethanolPct}%)
              </span>
            </div>

            {/* Liquid Tube with Water Glass Shimmer */}
            <div className="relative h-6 w-full rounded-full overflow-hidden p-0.5 bg-slate-200/60 shadow-inner border border-white/90">
              <div className="h-full w-full flex rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 to-amber-400 transition-all duration-300 relative"
                  style={{ width: `${100 - ethanolPct}%` }}
                >
                  <div className="absolute inset-0 water-shimmer opacity-40" />
                </div>
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 relative"
                  style={{ width: `${ethanolPct}%` }}
                >
                  <div className="absolute inset-0 water-shimmer opacity-60" />
                </div>
              </div>

              {/* OEM Limit Needle/Pin */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 pointer-events-none z-10"
                style={{ left: `${oemCeiling}%` }}
              >
                <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900" />
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0% Pure Petrol</span>
              <span className="text-slate-600 font-medium">OEM Limit: {selectedVehicle.oemMaxEthanolRating}</span>
              <span>100% Ethanol</span>
            </div>
          </div>

          {/* Big Liquid Value Readout (Apple Large Display) */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-3.5 bg-white/80 rounded-2xl border border-white/90 shadow-xs text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Selected Mixture
            </span>
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 my-0.5 flex items-baseline gap-1">
              <span>E{ethanolPct}</span>
              <span className="text-xs font-medium text-slate-500">({ethanolPct}%)</span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">
              {ethanolPct === 0
                ? 'Standard E0 Unleaded'
                : ethanolPct <= 10
                ? 'Low-blend Petrol'
                : ethanolPct <= 20
                ? 'Mid-blend Gasohol'
                : 'High-blend Alcohol Fuel'}
            </span>
          </div>
        </div>
      </div>

      {/* Apple-style Blend Preset Pills */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Standard Pump Blends
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {presets.map((preset) => {
            const isSelected = ethanolPct === preset.pct;
            const isOemLimit = preset.pct === oemCeiling;

            return (
              <button
                key={preset.label}
                onClick={() => onChangeEthanol(preset.pct)}
                className={`py-2.5 px-3 rounded-2xl text-center transition-all relative ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600/20'
                    : 'bg-white/70 hover:bg-white text-slate-700 border border-slate-200/70 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold">{preset.label}</div>
                <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {preset.name}
                </div>
                {isOemLimit && (
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-1 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    OEM Cap
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Smooth Glass Slider */}
      <div className="mb-6 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 space-y-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 relative">
            <span className="text-xs font-semibold text-slate-700">
              Slide to Customize Percentage:
            </span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="w-5 h-5 rounded-full bg-slate-200/70 hover:bg-blue-100 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
                aria-label="Ethanol levels engine health guide"
                title="Learn how ethanol levels affect engine health"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Tooltip Explaining Ethanol Levels & Engine Health */}
              {showTooltip && (
                <div
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="absolute left-0 sm:left-auto sm:right-0 top-7 z-50 w-72 sm:w-88 p-4 rounded-2xl bg-slate-900/95 text-white backdrop-blur-2xl border border-white/20 shadow-2xl space-y-2.5 text-left"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-300" />
                      Ethanol Levels & Engine Health
                    </span>
                    <button
                      onClick={() => setShowTooltip(false)}
                      className="text-slate-400 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 text-[11px] leading-relaxed divide-y divide-white/10 max-h-72 overflow-y-auto pr-1">
                    <div className="pt-1">
                      <span className="font-bold text-white">E0 (Pure Petrol · 0% Ethanol):</span>
                      <p className="text-slate-300 mt-0.5">Maximum energy per liter and longest tank storage life (90+ days). 100% safe for all petrol cars, especially classic and vintage engines.</p>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-emerald-300">E10 (10% Ethanol · Standard):</span>
                      <p className="text-slate-300 mt-0.5">Default regular fuel worldwide. Factory approved for almost all petrol vehicles built after 2000. Negligible engine or fuel line wear.</p>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-cyan-300">E15 (15% Ethanol · Unleaded 88):</span>
                      <p className="text-slate-300 mt-0.5">Approved by US EPA for light cars from 2001 onwards. ~1.5% to 2% mileage decrease. High-pressure pump seals must be rated for E15.</p>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-amber-300">E20 (20% Ethanol · High Blend):</span>
                      <p className="text-slate-300 mt-0.5">Mandated in markets like India and Brazil. Requires upgraded anti-corrosive fuel lines and sensors. Can trigger lean codes (P0171) or accelerated rubber aging in non-E20 cars.</p>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-rose-300">E85 (85% Ethanol · Flex-Fuel):</span>
                      <p className="text-slate-300 mt-0.5">Strictly for certified Flex-Fuel Vehicles (FFVs). High octane (105+ RON), but in non-FFVs it destroys fuel pump plungers, rots rubber hoses, and causes severe lean misfires.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-slate-800 shadow-xs">
            {ethanolPct}% Ethanol
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={ethanolPct}
          onChange={(e) => onChangeEthanol(Number(e.target.value))}
          className="w-full"
        />

        {/* Dedicated Live Blend Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Exact Mileage Drop</span>
            <span className="font-bold text-slate-900 font-mono">{physics.estimatedMileageImpactPct}%</span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Energy Density</span>
            <span className="font-bold text-slate-900 font-mono">{physics.energyDensityMjL} MJ/L</span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Blended Octane</span>
            <span className="font-bold text-amber-700 font-mono">{physics.octaneBoostEstRon} RON</span>
          </div>
          <div className="p-2 rounded-lg bg-white/70 border border-slate-200/70">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Stoichiometric AFR</span>
            <span className="font-bold text-blue-700 font-mono">{physics.stoichiometricAfr}:1</span>
          </div>
        </div>
      </div>

      {/* Live Compatibility Status Banner */}
      <div
        className={`p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3.5 transition-all ${
          isSafe
            ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
            : isCaution
            ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
            : 'bg-rose-50/70 border-rose-200/80 text-rose-950'
        }`}
      >
        <div
          className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
            isSafe
              ? 'bg-emerald-100 text-emerald-700'
              : isCaution
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {isSafe ? (
            <ShieldCheck className="w-5 h-5" />
          ) : isCaution ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <AlertOctagon className="w-5 h-5" />
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold">
            {isSafe
              ? `Approved: E${ethanolPct} is within ${selectedVehicle.make}'s factory limit (${selectedVehicle.oemMaxEthanolRating})`
              : isCaution
              ? `Marginal Caution: E${ethanolPct} slightly exceeds factory ceiling by +${ethanolPct - oemCeiling}%`
              : `High Hazard: E${ethanolPct} exceeds factory specification by +${ethanolPct - oemCeiling}%`}
          </h4>
          <p className="text-xs mt-1 leading-relaxed opacity-90">
            {isSafe
              ? `The powertrain, fuel pump seals, and ECU lambda feedback in your ${selectedVehicle.model} are engineered to run up to ${selectedVehicle.oemMaxEthanolRating} without warranty void or mechanical fatigue.`
              : isCaution
              ? `Your ${selectedVehicle.model} can tolerate this short-term if filled by mistake, but continuous operation will increase fuel trim adjustments and cause minor seal wear.`
              : `Operating your ${selectedVehicle.model} on E${ethanolPct} risks fuel pump scoring, elastomer line embrittlement, lean misfires under high load, and CEL error codes.`}
          </p>
        </div>
      </div>
    </section>
  );
};

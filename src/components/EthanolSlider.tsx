import React, { useState } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { Flame, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface EthanolSliderProps {
  ethanolPct: number;
  onChangeEthanol: (pct: number) => void;
  selectedVehicle: PetrolVehicle;
}

export const EthanolSlider: React.FC<EthanolSliderProps> = ({
  ethanolPct,
  onChangeEthanol,
  selectedVehicle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const presets = [
    { label: 'E0', pct: 0, desc: 'Pure Petrol (0%)' },
    { label: 'E5', pct: 5, desc: '5% Blend' },
    { label: 'E10', pct: 10, desc: 'Global Standard (10%)' },
    { label: 'E12', pct: 12, desc: '12% Blend' },
    { label: 'E15', pct: 15, desc: 'Unleaded 88 (15%)' },
    { label: 'E20', pct: 20, desc: 'India BS6-II (20%)' },
    { label: 'E25', pct: 25, desc: 'Brazil Gasohol (25%)' },
    { label: 'E85', pct: 85, desc: 'Flex Fuel (85%)' },
    { label: 'E100', pct: 100, desc: 'Hydrous Ethanol' },
  ];

  const oemCeiling = selectedVehicle.oemEthanolCeilingPct;
  const isWithinOem = ethanolPct <= oemCeiling;
  const delta = ethanolPct - oemCeiling;

  return (
    <div className="bg-white border border-zinc-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-zinc-900 text-white text-xs font-mono font-bold flex items-center justify-center">
            02
          </span>
          <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">
            Select Ethanol Level in Petrol
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">Vehicle OEM Limit:</span>
          <span className="font-semibold text-zinc-900 bg-zinc-200 px-2 py-0.5 border border-zinc-300">
            {selectedVehicle.oemMaxEthanolRating} ({oemCeiling}%)
          </span>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Quick Blend Preset Buttons */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
            Standard Fuel Pump Blends & Presets
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {presets.map((preset) => {
              const isSelected = ethanolPct === preset.pct;
              const isOemLimit = preset.pct === oemCeiling;

              return (
                <button
                  key={preset.label}
                  onClick={() => onChangeEthanol(preset.pct)}
                  className={`p-2.5 text-center border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="text-sm font-bold font-mono">{preset.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    {preset.pct}%
                  </div>
                  {isOemLimit && (
                    <div
                      className={`text-[9px] uppercase font-bold tracking-tighter mt-1 px-1 py-0.2 border ${
                        isSelected
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          : 'bg-zinc-100 border-zinc-300 text-zinc-700'
                      }`}
                    >
                      OEM CAP
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Precision Range Slider */}
        <div className="bg-zinc-50 p-4 border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 relative">
                <span className="text-xs uppercase font-mono text-zinc-500 font-semibold">
                  Continuous Mixture Slider
                </span>
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="w-4 h-4 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 flex items-center justify-center transition-colors"
                    title="Engine health guide for ethanol levels"
                  >
                    <Info className="w-3 h-3" />
                  </button>

                  {showTooltip && (
                    <div
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="absolute left-0 top-6 z-50 w-72 sm:w-80 p-3 bg-zinc-900 text-white shadow-xl text-left border border-zinc-700 space-y-2 text-xs"
                    >
                      <div className="font-bold border-b border-zinc-700 pb-1 text-zinc-200">
                        Ethanol Levels & Engine Health
                      </div>
                      <div className="space-y-1.5 text-[11px] leading-relaxed text-zinc-300">
                        <p><strong className="text-white">E0:</strong> 0% ethanol. Maximum MPG, 100% safe for all petrol cars.</p>
                        <p><strong className="text-emerald-400">E10:</strong> 10% ethanol. Standard pump petrol. Safe for post-2000 engines.</p>
                        <p><strong className="text-cyan-400">E15:</strong> 15% ethanol. Safe for modern cars; ~2% lower mileage.</p>
                        <p><strong className="text-amber-400">E20:</strong> 20% ethanol. Requires E20-rated fuel pump and seals; risks lean codes on older cars.</p>
                        <p><strong className="text-rose-400">E85:</strong> 85% ethanol. Flex-Fuel only; causes severe pump/seal damage in standard petrol engines.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-zinc-950">
                  E{ethanolPct}
                </span>
                <span className="text-xs text-zinc-600">
                  ({ethanolPct}% Anhydrous Ethanol / {100 - ethanolPct}% Gasoline)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Custom Value:</span>
              <div className="relative w-20">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ethanolPct}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    onChangeEthanol(val);
                  }}
                  className="w-full px-2.5 py-1 text-center font-mono text-sm font-bold bg-white border border-zinc-300 focus:outline-none focus:border-zinc-900"
                />
                <span className="absolute right-2 top-1.5 text-xs text-zinc-400 font-mono">%</span>
              </div>
            </div>
          </div>

          {/* Range Track with OEM Marker */}
          <div className="relative pt-3 pb-1">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={ethanolPct}
              onChange={(e) => onChangeEthanol(Number(e.target.value))}
              className="w-full"
            />

            {/* Marker for OEM Ceiling */}
            <div
              className="absolute top-0 transform -translate-x-1/2 pointer-events-none flex flex-col items-center"
              style={{ left: `${oemCeiling}%` }}
            >
              <div className="text-[9px] font-mono font-bold bg-zinc-900 text-white px-1.5 py-0.5 whitespace-nowrap shadow-sm">
                OEM Limit: {selectedVehicle.oemMaxEthanolRating}
              </div>
              <div className="w-0.5 h-3 bg-zinc-900" />
            </div>

            {/* Scale Ticks */}
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2">
              <span>0% (E0 Pure)</span>
              <span>20% (E20)</span>
              <span>40%</span>
              <span>60%</span>
              <span>85% (E85 Flex)</span>
              <span>100% (E100)</span>
            </div>
          </div>

          {/* Quick OEM Compliance Status Callout */}
          <div
            className={`p-3 border flex items-start gap-3 text-xs ${
              isWithinOem
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : delta <= 5
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            {isWithinOem ? (
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold">
                {isWithinOem
                  ? `Blend Within Manufacturer Specification (≤ ${oemCeiling}%)`
                  : delta <= 5
                  ? `Marginal Blend: Exceeds OEM ceiling by +${delta}% (Caution)`
                  : `Non-Compliant Blend: Exceeds OEM specification by +${delta}%`}
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                {isWithinOem
                  ? `${selectedVehicle.make} validates the ${selectedVehicle.model} (${selectedVehicle.variant}) for ethanol content up to ${selectedVehicle.oemMaxEthanolRating}. Factory fuel pump and injectors can inject necessary volume.`
                  : `Operating ${selectedVehicle.model} on E${ethanolPct} exceeds factory design limits. Engine control module may reach fuel trim limits and prolonged exposure risks accelerated fuel system degradation.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

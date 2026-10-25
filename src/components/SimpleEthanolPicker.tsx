import React, { useState } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { ShieldCheck, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SimpleEthanolPickerProps {
  ethanolPct: number;
  onChangeEthanol: (pct: number) => void;
  selectedVehicle: PetrolVehicle;
}

export const SimpleEthanolPicker: React.FC<SimpleEthanolPickerProps> = ({
  ethanolPct,
  onChangeEthanol,
  selectedVehicle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const commonBlends = [
    { label: 'E0', pct: 0, title: 'Pure Petrol (0% Ethanol)' },
    { label: 'E10', pct: 10, title: 'Standard Pump Petrol (10%)' },
    { label: 'E15', pct: 15, title: '15% Blend (Unleaded 88)' },
    { label: 'E20', pct: 20, title: '20% Blend (Govt Mandate)' },
    { label: 'E85', pct: 85, title: 'Flex-Fuel (85%)' },
  ];

  const oemCeiling = selectedVehicle.oemEthanolCeilingPct;
  const isSafe = ethanolPct <= oemCeiling;
  const isSlightOver = !isSafe && ethanolPct <= oemCeiling + 5;

  return (
    <div className="bg-white border border-zinc-300 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
            Step 2 of 2
          </span>
          <h2 className="text-base font-bold text-zinc-950">Choose Ethanol Level</h2>
        </div>
        <div className="text-xs text-zinc-600 font-mono">
          Your car's factory limit: <strong>{selectedVehicle.oemMaxEthanolRating} ({oemCeiling}%)</strong>
        </div>
      </div>

      {/* Quick Click Blend Buttons */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
          Click Common Fuel Types:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {commonBlends.map((blend) => {
            const isSelected = ethanolPct === blend.pct;
            const isAtCap = blend.pct === oemCeiling;

            return (
              <button
                key={blend.label}
                type="button"
                onClick={() => onChangeEthanol(blend.pct)}
                className={`p-3 text-left border transition-all ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold">{blend.label}</span>
                  {isAtCap && (
                    <span
                      className={`text-[9px] font-mono uppercase px-1 py-0.2 border ${
                        isSelected
                          ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                          : 'bg-zinc-200 text-zinc-700 border-zinc-300'
                      }`}
                    >
                      Max OEM
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {blend.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simple slider with live value */}
      <div className="bg-zinc-50 p-4 border border-zinc-200 space-y-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 relative">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Or Adjust Custom Percentage:
            </label>
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
          <div className="font-mono text-lg font-bold text-zinc-950">
            E{ethanolPct} <span className="text-xs text-zinc-500 font-normal">({ethanolPct}% Ethanol)</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={ethanolPct}
          onChange={(e) => onChangeEthanol(Number(e.target.value))}
          className="w-full cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-zinc-500">
          <span>E0 (0% Pure Petrol)</span>
          <span>E10 (10%)</span>
          <span>E20 (20%)</span>
          <span>E85 (85%)</span>
          <span>E100 (100%)</span>
        </div>
      </div>

      {/* Immediate Plain-English Verdict Preview */}
      <div
        className={`p-3.5 border flex items-center gap-3 text-xs ${
          isSafe
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : isSlightOver
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-red-50 border-red-300 text-red-950'
        }`}
      >
        {isSafe ? (
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
        ) : isSlightOver ? (
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0" />
        )}
        <div>
          <span className="font-bold text-sm block">
            {isSafe
              ? `Safe: E${ethanolPct} is fully approved for your ${selectedVehicle.model}`
              : isSlightOver
              ? `Caution: E${ethanolPct} slightly exceeds your ${selectedVehicle.model}'s factory limit (${selectedVehicle.oemMaxEthanolRating})`
              : `Warning: E${ethanolPct} exceeds your ${selectedVehicle.model}'s limit by +${ethanolPct - oemCeiling}%`}
          </span>
          <span className="text-xs opacity-90 block mt-0.5">
            {isSafe
              ? `Your car's fuel pump, lines, and engine computer are designed to handle up to ${selectedVehicle.oemMaxEthanolRating} without issues.`
              : `Running higher ethanol than recommended can trigger a check engine light, reduce mileage, and cause fuel line wear over time.`}
          </span>
        </div>
      </div>
    </div>
  );
};

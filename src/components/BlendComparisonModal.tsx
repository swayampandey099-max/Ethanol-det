import React from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { calculateFuelPhysics } from '../utils/fuelPhysics';
import { X, Layers, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BlendComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: PetrolVehicle;
  currentEthanolPct: number;
}

export const BlendComparisonModal: React.FC<BlendComparisonModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  currentEthanolPct,
}) => {
  if (!isOpen) return null;

  const compareBlends = [
    { label: 'E0 (Pure Petrol)', pct: 0 },
    { label: 'E10 (Standard)', pct: 10 },
    { label: 'E20 (Mandated)', pct: 20 },
    { label: `E${currentEthanolPct} (Active)`, pct: currentEthanolPct },
    { label: 'E85 (Flex-Fuel)', pct: 85 },
  ];

  const uniqueBlends = compareBlends.filter(
    (blend, index, self) => index === self.findIndex((b) => b.pct === blend.pct)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="glass-panel bg-white/90 backdrop-blur-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-900/20 border border-white/80">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Multi-Blend Fuel Comparison Matrix
              </h3>
              <p className="text-xs text-slate-500">
                {vehicle.year} {vehicle.make} {vehicle.model} · Factory Ceiling: {vehicle.oemMaxEthanolRating}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70">
                  <th className="p-3.5 font-bold text-slate-700">Evaluation Metric</th>
                  {uniqueBlends.map((blend) => (
                    <th
                      key={blend.pct}
                      className={`p-3.5 font-bold ${
                        blend.pct === currentEthanolPct
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-800'
                      }`}
                    >
                      {blend.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {/* Status */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">OEM Status</td>
                  {uniqueBlends.map((blend) => {
                    const isWithin = blend.pct <= vehicle.oemEthanolCeilingPct;
                    return (
                      <td key={blend.pct} className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isWithin
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isWithin ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Approved
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Exceeds
                            </>
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Energy Density */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Energy Density</td>
                  {uniqueBlends.map((blend) => {
                    const p = calculateFuelPhysics(blend.pct);
                    return (
                      <td key={blend.pct} className="p-3.5 font-mono font-medium">
                        {p.energyDensityMjL} MJ/L
                        <span className="block text-[10px] text-slate-400 font-sans">
                          {p.energyDeficitPct === 0 ? 'Baseline' : `-${p.energyDeficitPct}%`}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Mileage Impact */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Mileage Change</td>
                  {uniqueBlends.map((blend) => {
                    const p = calculateFuelPhysics(blend.pct);
                    return (
                      <td key={blend.pct} className="p-3.5 font-mono font-bold text-slate-900">
                        {p.estimatedMileageImpactPct}%
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          relative to E0
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Air-Fuel Ratio */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Stoichiometric AFR</td>
                  {uniqueBlends.map((blend) => {
                    const p = calculateFuelPhysics(blend.pct);
                    return (
                      <td key={blend.pct} className="p-3.5 font-mono">
                        {p.stoichiometricAfr}:1
                        <span className="block text-[10px] text-slate-400 font-sans">
                          +{p.fuelMassIncreaseRequiredPct}% mass
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Wear */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Component Wear</td>
                  {uniqueBlends.map((blend) => {
                    const delta = blend.pct - vehicle.oemEthanolCeilingPct;
                    let text = 'Normal factory wear';
                    let color = 'text-slate-600';
                    if (delta > 20) {
                      text = 'High seal corrosion risk';
                      color = 'text-rose-600 font-semibold';
                    } else if (delta > 5) {
                      text = 'Moderate elastomer aging';
                      color = 'text-amber-600 font-semibold';
                    }
                    return (
                      <td key={blend.pct} className={`p-3.5 text-[11px] ${color}`}>
                        {text}
                      </td>
                    );
                  })}
                </tr>

                {/* Storage */}
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Tank Shelf-Life</td>
                  {uniqueBlends.map((blend) => {
                    let desc = '90+ days (Stable)';
                    if (blend.pct > 50) desc = '14-21 days max (Moisture draw)';
                    else if (blend.pct > 15) desc = '30-45 days max (Use stabilizer)';
                    return (
                      <td key={blend.pct} className="p-3.5 text-[11px] text-slate-600">
                        {desc}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

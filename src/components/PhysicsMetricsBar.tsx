import React from 'react';
import { FuelPhysicsMetrics } from '../utils/fuelPhysics';
import { Activity, Flame, Droplets, Zap, Gauge, AlertCircle } from 'lucide-react';

interface PhysicsMetricsBarProps {
  metrics: FuelPhysicsMetrics;
}

export const PhysicsMetricsBar: React.FC<PhysicsMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="bg-white border border-zinc-200">
      <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Real-Time Chemical & Combustion Thermodynamics
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Mixture: E{metrics.ethanolPct}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 divide-x divide-zinc-200 text-left">
        {/* Metric 1: Energy Density */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Flame className="w-3.5 h-3.5 text-zinc-700" />
            <span>Energy Density</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-zinc-950">
              {metrics.energyDensityMjL}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">MJ/L</span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {metrics.energyDeficitPct === 0 ? 'Baseline (E0 pure petrol)' : `-${metrics.energyDeficitPct}% vs E0 gasoline`}
          </span>
        </div>

        {/* Metric 2: Estimated Mileage Impact */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Gauge className="w-3.5 h-3.5 text-zinc-700" />
            <span>Mileage / Range</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-xl font-bold font-mono ${
                metrics.estimatedMileageImpactPct === 0
                  ? 'text-zinc-950'
                  : 'text-zinc-950'
              }`}
            >
              {metrics.estimatedMileageImpactPct}%
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">est. MPG/kmL</span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {metrics.estimatedMileageImpactPct === 0
              ? 'Zero consumption penalty'
              : `Fuel consumption penalty`}
          </span>
        </div>

        {/* Metric 3: Stoichiometric Air-Fuel Ratio */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Zap className="w-3.5 h-3.5 text-zinc-700" />
            <span>Stoichiometric AFR</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-zinc-950">
              {metrics.stoichiometricAfr}:1
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            Pure petrol is 14.7:1
          </span>
        </div>

        {/* Metric 4: Fuel Mass Demand */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Activity className="w-3.5 h-3.5 text-zinc-700" />
            <span>ECU Fuel Mass Flow</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-zinc-950">
              +{metrics.fuelMassIncreaseRequiredPct}%
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">volume</span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            Needed for Lambda = 1.0
          </span>
        </div>

        {/* Metric 5: Blended Octane (RON) */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Gauge className="w-3.5 h-3.5 text-zinc-700" />
            <span>Estimated Octane</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-zinc-950">
              ~{metrics.octaneBoostEstRon}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">RON</span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            High knock resistance
          </span>
        </div>

        {/* Metric 6: Phase Separation Risk */}
        <div className="p-4 bg-white">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
            <Droplets className="w-3.5 h-3.5 text-zinc-700" />
            <span>Phase Separation</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-sm font-bold font-mono uppercase px-1.5 py-0.5 border ${
                metrics.phaseSeparationRisk === 'Low'
                  ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                  : metrics.phaseSeparationRisk === 'Moderate'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-red-100 text-red-900 border-red-300'
              }`}
            >
              {metrics.phaseSeparationRisk}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 block mt-1 truncate">
            {metrics.ethanolPct > 10 ? 'Hygroscopic moisture risk' : 'Standard tank shelf-life'}
          </span>
        </div>
      </div>
    </div>
  );
};

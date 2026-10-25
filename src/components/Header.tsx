import { Fuel, ShieldAlert, CheckSquare } from 'lucide-react';

interface HeaderProps {
  vehicleCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ vehicleCount, onReset }) => {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-zinc-900 text-white border border-zinc-900 flex-shrink-0">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
                  Powertrain Engineering & Fuel Diagnostic System
                </span>
                <span className="text-zinc-300">|</span>
                <span className="text-xs font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 border border-zinc-200">
                  v3.8 Flash AI
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 mt-0.5">
                Petrol Vehicle Ethanol Suitability Analyzer
              </h1>
              <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
                Evaluate ethanol blend compatibility (E0 to E100) across {vehicleCount} verified petrol vehicles.
                Generates AI-powered safety recommendations, component wear alerts, fuel trim warnings, and mileage degradation estimates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto pt-2 md:pt-0">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 bg-zinc-100 px-3 py-2 border border-zinc-200">
              <CheckSquare className="w-4 h-4 text-zinc-800" />
              <span>Strictly Petrol Vehicles</span>
            </div>
            <button
              onClick={onReset}
              className="text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 px-3 py-2 border border-zinc-300 transition-colors"
            >
              Reset Selection
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

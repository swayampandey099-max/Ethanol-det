import React, { useState, useMemo } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { Search, Filter, Check, Car, Gauge, Info, ChevronDown } from 'lucide-react';

interface VehicleSelectorProps {
  vehicles: PetrolVehicle[];
  selectedVehicle: PetrolVehicle;
  onSelectVehicle: (vehicle: PetrolVehicle) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [oemFilter, setOemFilter] = useState<string>('All');
  const [injectionFilter, setInjectionFilter] = useState<string>('All');
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);

  const categories = ['All', 'Sedan', 'Hatchback', 'SUV', 'Sports', 'Classic'];
  const oemLimits = ['All', 'E10', 'E15', 'E20', 'E85'];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        searchTerm === '' ||
        `${v.make} ${v.model} ${v.variant} ${v.engine}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'All' || v.category === categoryFilter;
      const matchOem = oemFilter === 'All' || v.oemMaxEthanolRating === oemFilter;
      const matchInjection =
        injectionFilter === 'All' || v.fuelInjection.includes(injectionFilter);

      return matchSearch && matchCategory && matchOem && matchInjection;
    });
  }, [vehicles, searchTerm, categoryFilter, oemFilter, injectionFilter]);

  return (
    <div className="bg-white border border-zinc-200">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-zinc-900 text-white text-xs font-mono font-bold flex items-center justify-center">
            01
          </span>
          <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wide">
            Select Petrol Vehicle & Filter Model
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          Showing {filteredVehicles.length} of {vehicles.length} Petrol Vehicles
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 border-b border-zinc-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by make, exact model, engine code (e.g. Civic, M20A, Golf GTI, Swift, Coyote)..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-300 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-500 hover:text-zinc-900"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips / Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 mr-1 font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 border font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-zinc-300 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-zinc-500 mr-1 font-semibold uppercase tracking-wider">
            <span>OEM Ceiling:</span>
          </div>
          {oemLimits.map((limit) => (
            <button
              key={limit}
              onClick={() => setOemFilter(limit)}
              className={`px-2.5 py-1.5 border font-medium transition-colors ${
                oemFilter === limit
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
              }`}
            >
              {limit}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="p-5 max-h-[380px] overflow-y-auto divide-y divide-zinc-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
            <Car className="w-8 h-8 mx-auto text-zinc-400 mb-2 stroke-1" />
            No petrol vehicles match your filter criteria. Try adjusting your search query.
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const isSelected = selectedVehicle.id === vehicle.id;
            return (
              <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle)}
                className={`p-4 cursor-pointer text-left transition-all border ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-50 shadow-sm ring-1 ring-zinc-950'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      {vehicle.year} · {vehicle.make}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-950 mt-0.5 leading-snug">
                      {vehicle.model}
                    </h3>
                  </div>
                  <div
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 border ${
                      vehicle.oemMaxEthanolRating === 'E85'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : vehicle.oemMaxEthanolRating === 'E20'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : vehicle.oemMaxEthanolRating === 'E15'
                        ? 'bg-zinc-100 text-zinc-900 border-zinc-300'
                        : vehicle.oemMaxEthanolRating === 'E0'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    MAX {vehicle.oemMaxEthanolRating}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 mt-1 line-clamp-1 font-medium">
                  {vehicle.variant}
                </p>

                <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="truncate max-w-[170px]" title={vehicle.fuelInjection}>
                    {vehicle.fuelInjection}
                  </span>
                  <span className="font-mono text-zinc-700">{vehicle.displacement}</span>
                </div>

                {isSelected && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-zinc-950">
                    <Check className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Selected for Diagnostic</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Selected Vehicle Dossier / Expanded Specs */}
      <div className="bg-zinc-100 p-5 border-t border-zinc-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Active Vehicle Profile
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-base font-bold text-zinc-950">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} — {selectedVehicle.variant}
              </h3>
              <span className="text-xs font-mono bg-zinc-900 text-white px-2 py-0.5">
                OEM Limit: {selectedVehicle.oemMaxEthanolRating} ({selectedVehicle.oemEthanolCeilingPct}%)
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Engine: {selectedVehicle.engine} · {selectedVehicle.powerOutput}
            </p>
          </div>

          <button
            onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
            className="self-start md:self-auto text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 px-3 py-1.5 border border-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <span>{isSpecsExpanded ? 'Hide Full Powertrain Specs' : 'View Full Powertrain Specs'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSpecsExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isSpecsExpanded && (
          <div className="mt-4 pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 border border-zinc-200">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Fuel Injection Architecture</span>
              <span className="font-semibold text-zinc-900 mt-1 block">{selectedVehicle.fuelInjection}</span>
              <span className="text-zinc-500 text-[11px] mt-0.5 block">Compression: {selectedVehicle.compressionRatio}</span>
            </div>
            <div className="bg-white p-3 border border-zinc-200">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">OEM Recommended Octane</span>
              <span className="font-semibold text-zinc-900 mt-1 block">{selectedVehicle.oemOctaneRecommendation}</span>
              <span className="text-zinc-500 text-[11px] mt-0.5 block">Tank: {selectedVehicle.tankCapacityLiters} Liters</span>
            </div>
            <div className="bg-white p-3 border border-zinc-200">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Emissions & Standard</span>
              <span className="font-semibold text-zinc-900 mt-1 block">{selectedVehicle.emissionStandard}</span>
              <span className="text-zinc-500 text-[11px] mt-0.5 block">Baseline: {selectedVehicle.estimatedCityHighwayMpg}</span>
            </div>
            <div className="bg-white p-3 border border-zinc-200">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Factory Fuel Line & Seal Notes</span>
              <span className="text-zinc-700 text-[11px] mt-1 block leading-relaxed">{selectedVehicle.fuelSystemNotes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { Search, Car, ChevronDown, Check } from 'lucide-react';

interface SimpleVehiclePickerProps {
  vehicles: PetrolVehicle[];
  selectedVehicle: PetrolVehicle;
  onSelectVehicle: (vehicle: PetrolVehicle) => void;
}

export const SimpleVehiclePicker: React.FC<SimpleVehiclePickerProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Popular quick-pick vehicles
  const popularIds = [
    'maruti-suzuki-swift-2024',
    'honda-civic-15t-2023',
    'toyota-corolla-20p-2023',
    'hyundai-creta-15-2024',
    'vw-golf-gti-mk8-2023',
    'ford-mustang-gt-2024',
    'vintage-miata-na-1995',
  ];

  const popularCars = useMemo(() => {
    return vehicles.filter((v) => popularIds.includes(v.id));
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;
    const term = searchTerm.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(term) ||
        v.model.toLowerCase().includes(term) ||
        v.variant.toLowerCase().includes(term) ||
        v.engine.toLowerCase().includes(term) ||
        v.year.toString().includes(term)
    );
  }, [vehicles, searchTerm]);

  return (
    <div className="bg-white border border-zinc-300 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
            Step 1 of 2
          </span>
          <h2 className="text-base font-bold text-zinc-950">Select Your Petrol Car</h2>
        </div>
        <span className="text-xs text-zinc-600 bg-zinc-100 px-2.5 py-1 border border-zinc-200">
          {vehicles.length} Petrol Vehicles Available
        </span>
      </div>

      {/* Quick Select Buttons for Common Cars */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2">
          Popular Models:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {popularCars.map((car) => {
            const isSelected = car.id === selectedVehicle.id;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => {
                  onSelectVehicle(car);
                  setIsDropdownOpen(false);
                }}
                className={`text-xs px-3 py-1.5 border transition-colors ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                    : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400'
                }`}
              >
                {car.make} {car.model}
              </button>
            );
          })}
        </div>
      </div>

      {/* Searchable Car Selector Dropdown */}
      <div className="relative">
        <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
          Or Choose from Full List ({vehicles.length} Models):
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type to filter (e.g. Swift, Civic, Creta, BMW, Corolla)..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>{isDropdownOpen ? 'Close' : 'Browse All'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown list */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-900 shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-zinc-100">
            {filteredVehicles.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                No car found matching "{searchTerm}". Try another keyword.
              </div>
            ) : (
              filteredVehicles.map((car) => {
                const isSelected = car.id === selectedVehicle.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => {
                      onSelectVehicle(car);
                      setIsDropdownOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left p-3 hover:bg-zinc-50 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-zinc-100 font-bold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm text-zinc-950">
                        {car.year} {car.make} <strong>{car.model}</strong>
                      </div>
                      <div className="text-xs text-zinc-500 font-normal">
                        {car.variant} · {car.engine}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono bg-zinc-200 text-zinc-800 px-1.5 py-0.5 border border-zinc-300">
                        Safe up to {car.oemMaxEthanolRating}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Selected Car Highlight Card */}
      <div className="bg-zinc-50 p-4 border border-zinc-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-zinc-950 text-white mt-0.5 flex-shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-zinc-500">
                Selected Car
              </span>
              <span className="text-xs font-mono font-bold bg-zinc-900 text-white px-2 py-0.5">
                Petrol / Gasoline
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-950 mt-0.5">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              {selectedVehicle.variant} ({selectedVehicle.engine})
            </p>
          </div>
        </div>

        <div className="bg-white p-3 border border-zinc-200 sm:text-right self-start sm:self-auto min-w-[150px]">
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">
            Factory Limit
          </span>
          <span className="text-sm font-bold text-zinc-950 block">
            Up to {selectedVehicle.oemMaxEthanolRating} ({selectedVehicle.oemEthanolCeilingPct}%)
          </span>
          <span className="text-[11px] text-zinc-500 block mt-0.5">
            {selectedVehicle.oemOctaneRecommendation}
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { PetrolVehicle } from '../data/vehicles';
import { Search, Car, ChevronDown, Check, ShieldCheck, Bike } from 'lucide-react';

interface AppleVehicleSectionProps {
  vehicles: PetrolVehicle[];
  selectedVehicle: PetrolVehicle;
  onSelectVehicle: (vehicle: PetrolVehicle) => void;
}

export const AppleVehicleSection: React.FC<AppleVehicleSectionProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Top Indian Iconic Vehicles
  const popularCars = useMemo(() => {
    const popularIds = [
      'maruti-swift-2024',
      'hero-splendor-plus-2024',
      'honda-activa-6g-2024',
      're-classic-350-2024',
      'hyundai-creta-15-2024',
      'tata-nexon-12-2024',
      'bajaj-pulsar-150-2024',
      'tvs-jupiter-110-2024',
      'yamaha-r15-v4-2024',
      'mahindra-thar-petrol-2024',
    ];
    return vehicles.filter((v) => popularIds.includes(v.id));
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        searchTerm === '' ||
        `${v.make} ${v.model} ${v.variant} ${v.engine} ${v.year} ${v.vehicleType}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        vehicleTypeFilter === 'All'
          ? true
          : vehicleTypeFilter === 'Cars'
          ? v.vehicleType === 'Car'
          : vehicleTypeFilter === 'Bikes'
          ? v.vehicleType === 'Motorcycle'
          : v.vehicleType === 'Scooter';

      return matchesSearch && matchesType;
    });
  }, [vehicles, searchTerm, vehicleTypeFilter]);

  const typeOptions = [
    { label: 'All Vehicles', value: 'All' },
    { label: 'Cars & SUVs', value: 'Cars' },
    { label: 'Motorcycles (Bikes)', value: 'Bikes' },
    { label: 'Scooters', value: 'Scooters' },
  ];

  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-8 transition-all relative overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-200/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Step 1 · Vehicle Selection
            </span>
            <span className="text-xs text-slate-500 font-medium">
              100% Petrol / Gasoline Indian Models
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Choose Your Car or Bike
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Database of {vehicles.length} Indian petrol vehicles with BS4, BS6 & E20 factory compliance ratings.
          </p>
        </div>

        <div className="text-xs text-slate-600 font-semibold bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs self-start sm:self-auto">
          {vehicles.length} Indian Models Available
        </div>
      </div>

      {/* Vehicle Type Filters: Cars vs Bikes vs Scooters */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 p-1 bg-slate-200/50 rounded-2xl backdrop-blur-md w-fit">
        {typeOptions.map((type) => (
          <button
            key={type.value}
            onClick={() => setVehicleTypeFilter(type.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              vehicleTypeFilter === type.value
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search make or model (e.g. Swift, Splendor, Activa, Classic 350, Creta, Pulsar, Thar, Nexon)..."
            className="w-full pl-11 pr-24 py-3 bg-white/70 hover:bg-white/90 focus:bg-white backdrop-blur-md border border-slate-200 focus:border-blue-500 rounded-2xl text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-xs"
          />
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute right-2.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-slate-200 flex items-center gap-1 transition-all"
          >
            <span>{isDropdownOpen ? 'Close' : 'Browse All'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 z-40 max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
            {filteredVehicles.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No petrol car or bike found matching "{searchTerm}".
              </div>
            ) : (
              filteredVehicles.map((v) => {
                const isSelected = v.id === selectedVehicle.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelectVehicle(v);
                      setIsDropdownOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left p-3 rounded-xl hover:bg-blue-50/80 transition-all flex items-center justify-between ${
                      isSelected ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{v.year} {v.make} {v.model}</span>
                        <span className="text-[10px] text-slate-500 font-normal px-1.5 py-0.2 bg-slate-100 rounded-md">
                          {v.vehicleType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        {v.variant} · {v.engine}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        v.oemMaxEthanolRating === 'E20'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        Max {v.oemMaxEthanolRating}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Popular Indian Quick Select Chips */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Popular Indian Cars & Bikes
        </span>
        <div className="flex flex-wrap gap-2">
          {popularCars.map((car) => {
            const isSelected = car.id === selectedVehicle.id;
            return (
              <button
                key={car.id}
                onClick={() => {
                  onSelectVehicle(car);
                  setIsDropdownOpen(false);
                }}
                className={`text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/25 ring-2 ring-blue-600/20'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span>{car.make} {car.model}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Vehicle Card */}
      <div className="glass-panel-subtle rounded-2xl p-4 sm:p-5 border border-white/80 bg-gradient-to-r from-blue-50/60 via-white/70 to-indigo-50/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              {selectedVehicle.vehicleType === 'Car' ? (
                <Car className="w-6 h-6" />
              ) : (
                <Bike className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Selected {selectedVehicle.vehicleType}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{selectedVehicle.emissionStandard}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {selectedVehicle.variant} · {selectedVehicle.displacement} ({selectedVehicle.fuelInjection})
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/70 sm:text-right shadow-xs self-start sm:self-auto min-w-[170px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Factory Ethanol Ceiling
            </span>
            <div className="text-base font-bold text-slate-900 flex sm:justify-end items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{selectedVehicle.oemMaxEthanolRating} ({selectedVehicle.oemEthanolCeilingPct}%)</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Fuel: {selectedVehicle.oemOctaneRecommendation}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

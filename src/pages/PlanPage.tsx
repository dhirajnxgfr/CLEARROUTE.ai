import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Truck,
  ArrowRight,
  AlertCircle,
  Clock,
  MapPin,
  ChevronDown,
  Calendar,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { CorridorMap } from '../components/CorridorMap';
import { CORRIDOR_NODES, DEMO_RESTRICTIONS } from '../data/corridorGraph';
import {
  getSavedVehicles,
  getActiveVehicleId,
  setActiveVehicleId,
  getSavedReports,
  savePlan,
} from '../services/storage';
import { computeTruckRoute } from '../engine/routingEngine';
import { VehicleType, CargoType, VehicleProfile } from '../types/truck';
import { useLanguage } from '../context/LanguageContext';

// Zod Schema for validation
const planFormSchema = z.object({
  loadedWeightT: z
    .number()
    .min(5, 'Loaded weight must be at least 5 tonnes')
    .max(80, 'Maximum legal rating is 80 tonnes'),
  heightM: z
    .number()
    .min(2.5, 'Minimum clearance height is 2.5 m')
    .max(5.5, 'Overhead height cannot exceed 5.5 m'),
  widthM: z
    .number()
    .min(2.0, 'Vehicle width must be at least 2.0 m')
    .max(3.5, 'Carriageway limit is 3.5 m'),
  lengthM: z
    .number()
    .min(6.0, 'Length must be at least 6.0 m')
    .max(25.0, 'Length cannot exceed 25.0 m'),
  axles: z
    .number()
    .int('Axles must be a whole number')
    .min(2, 'Minimum 2 axles')
    .max(10, 'Maximum 10 axles'),
  originId: z.string().min(1, 'Please select an origin terminal or hub'),
  destId: z.string().min(1, 'Please select a destination delivery hub'),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid departure time format (HH:mm)'),
  deadlineTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid deadline time format (HH:mm)'),
});

type PlanFormData = z.infer<typeof planFormSchema>;

export const PlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [vehicles, setVehicles] = useState<VehicleProfile[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Form states
  const [vehicleType, setVehicleType] = useState<VehicleType>('container');
  const [vehicleName, setVehicleName] = useState<string>('BharatBenz 4028T Container');
  const [loadedWeightT, setLoadedWeightT] = useState<number>(35.0);
  const [heightM, setHeightM] = useState<number>(4.20);
  const [widthM, setWidthM] = useState<number>(2.50);
  const [lengthM, setLengthM] = useState<number>(14.80);
  const [axles, setAxles] = useState<number>(5);
  const [cargoType, setCargoType] = useState<CargoType>('general');

  const [originId, setOriginId] = useState<string>('jnpt_gate');
  const [destId, setDestId] = useState<string>('chakan_midc');
  const [departureTime, setDepartureTime] = useState<string>('08:30');
  const [deadlineTime, setDeadlineTime] = useState<string>('18:00');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);

  // Load vehicles
  useEffect(() => {
    const list = getSavedVehicles();
    setVehicles(list);
    const activeId = getActiveVehicleId();
    const found = list.find((v) => v.id === activeId) || list[0];
    if (found) {
      applyVehicleProfile(found);
      setSelectedVehicleId(found.id);
    }
  }, []);

  const applyVehicleProfile = (v: VehicleProfile) => {
    setSelectedVehicleId(v.id);
    setVehicleName(v.name);
    setVehicleType(v.type);
    setLoadedWeightT(v.loadedWeightT);
    setHeightM(v.heightM);
    setWidthM(v.widthM);
    setLengthM(v.lengthM);
    setAxles(v.axles);
    setCargoType(v.defaultCargo);
  };

  const handleVehicleSelect = (id: string) => {
    const found = vehicles.find((v) => v.id === id);
    if (found) {
      applyVehicleProfile(found);
      setActiveVehicleId(found.id);
    }
  };

  const handleTypeChipClick = (type: VehicleType) => {
    setVehicleType(type);
    // Find matching default if available
    const matching = vehicles.find((v) => v.type === type);
    if (matching) {
      applyVehicleProfile(matching);
    } else {
      // default fallbacks per type
      if (type === 'container') {
        setLoadedWeightT(35.0);
        setHeightM(4.20);
        setAxles(5);
      } else if (type === 'tanker') {
        setLoadedWeightT(28.0);
        setHeightM(3.55);
        setAxles(3);
        setCargoType('hazardous');
      } else if (type === 'tipper') {
        setLoadedWeightT(42.0);
        setHeightM(3.75);
        setAxles(4);
      } else if (type === 'flatbed') {
        setLoadedWeightT(48.0);
        setHeightM(3.20);
        setAxles(6);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = planFormSchema.safeParse({
      loadedWeightT,
      heightM,
      widthM,
      lengthM,
      axles,
      originId,
      destId,
      departureTime,
      deadlineTime,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      issues.forEach((err: any) => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (originId === destId) {
      setErrors({ destId: 'Origin and destination cannot be identical.' });
      return;
    }

    setIsSubmitting(true);

    const vehicleProfile: VehicleProfile = {
      id: selectedVehicleId || `veh_custom_${Date.now()}`,
      name: vehicleName,
      type: vehicleType,
      loadedWeightT,
      heightM,
      widthM,
      lengthM,
      axles,
      defaultCargo: cargoType,
    };

    // Compute route with client-side engine
    setTimeout(() => {
      const activeReports = getSavedReports();
      const plan = computeTruckRoute(
        originId,
        destId,
        vehicleProfile,
        departureTime,
        deadlineTime,
        activeReports
      );
      savePlan(plan);
      setIsSubmitting(false);
      navigate(`/plan/${plan.id}`);
    }, 250);
  };

  const demoLocations = Object.values(CORRIDOR_NODES).filter((n) => n.isDemoLocation);

  const currentOriginNode = CORRIDOR_NODES[originId];
  const currentDestNode = CORRIDOR_NODES[destId];

  return (
    <div className="relative w-full h-[calc(100vh-57px)] overflow-hidden bg-[#0B1B32] flex flex-col lg:flex-row">
      {/* Left Planning Panel (440px on desktop, collapsible bottom-sheet on mobile) */}
      <div
        className={`w-full lg:w-[440px] shrink-0 z-20 bg-[#0D1E4C]/95 backdrop-blur-md border-r border-[#26415E] flex flex-col h-full shadow-2xl transition-transform duration-300 ${
          mobilePanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)] lg:translate-y-0'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-[#26415E] flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-[#F8FAFC]">{t.planHeaderTitle}</h2>
            <p className="text-xs text-[#E5C9D7]/80">{t.planHeaderDesc}</p>
          </div>
          {/* Mobile toggle button */}
          <button
            onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
            className="lg:hidden px-3 py-1 text-xs font-mono bg-[#26415E] border border-[#26415E] text-[#E5C9D7] rounded-md"
          >
            {mobilePanelOpen ? (language === 'hi' ? 'मैप देखें' : 'View Map') : (language === 'hi' ? 'प्लान बदलें' : 'Edit Plan')}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Saved Vehicle Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                {t.activeVehiclePreset}
              </label>
              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] text-[#F8FAFC] rounded-md px-3 py-2 text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-[#83A6CE] pr-10"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.loadedWeightT} t · {v.heightM} m)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. Vehicle Type Chips */}
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                {language === 'hi' ? 'वाहन श्रेणी (Category)' : 'Vehicle Category'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['container', 'tanker', 'tipper', 'flatbed'] as VehicleType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChipClick(type)}
                    className={`py-2 px-1 text-xs font-medium rounded-md capitalize border transition-all ${
                      vehicleType === type
                        ? 'bg-[#83A6CE] text-[#0B1B32] font-bold border-[#83A6CE] shadow-sm'
                        : 'bg-[#26415E]/40 text-slate-300 border-[#26415E] hover:text-white hover:border-[#83A6CE]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Physical Parameters Grid */}
            <div className="p-3.5 rounded-lg bg-[#0B1B32] border border-[#26415E] space-y-3">
              <span className="text-[11px] font-mono text-[#83A6CE] uppercase tracking-wider block font-semibold">
                {t.vehicleDimensions}
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Loaded Weight */}
                <div>
                  <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                    {t.grossWeight}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="80"
                    value={loadedWeightT}
                    onChange={(e) => setLoadedWeightT(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-[#0D1E4C] border ${
                      errors.loadedWeightT ? 'border-red-500' : 'border-[#26415E]'
                    } rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]`}
                  />
                  {errors.loadedWeightT && (
                    <span className="text-[10px] text-red-400 mt-0.5 block">{errors.loadedWeightT}</span>
                  )}
                </div>

                {/* Overhead Height */}
                <div>
                  <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                    {t.heightClearance}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="2.5"
                    max="5.5"
                    value={heightM}
                    onChange={(e) => setHeightM(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-[#0D1E4C] border ${
                      errors.heightM ? 'border-red-500' : 'border-[#26415E]'
                    } rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]`}
                  />
                  {errors.heightM && (
                    <span className="text-[10px] text-red-400 mt-0.5 block">{errors.heightM}</span>
                  )}
                </div>

                {/* Carriageway Width */}
                <div>
                  <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                    {t.width}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="2.0"
                    max="3.5"
                    value={widthM}
                    onChange={(e) => setWidthM(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-[#0D1E4C] border ${
                      errors.widthM ? 'border-red-500' : 'border-[#26415E]'
                    } rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]`}
                  />
                </div>

                {/* Axles */}
                <div>
                  <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                    {t.axleCount}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={axles}
                    onChange={(e) => setAxles(parseInt(e.target.value, 10) || 2)}
                    className="w-full bg-[#0D1E4C] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                  />
                </div>
              </div>

              {/* Cargo Classification */}
              <div>
                <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                  {t.cargoType}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['general', 'hazardous', 'perishable'] as CargoType[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCargoType(c)}
                      className={`py-1.5 px-2 text-xs rounded-md capitalize border transition-all ${
                        cargoType === c
                          ? 'bg-[#26415E] text-[#E5C9D7] border-[#83A6CE] font-semibold'
                          : 'bg-[#0D1E4C] text-slate-300 border-[#26415E] hover:text-white'
                      }`}
                    >
                      {c === 'general' ? (language === 'hi' ? 'सामान्य (General)' : 'General') :
                       c === 'hazardous' ? (language === 'hi' ? 'खतरनाक (Hazmat)' : 'Hazardous') :
                       (language === 'hi' ? 'शीघ्र नष्ट (Perishable)' : 'Perishable')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Origin & Destination Waypoints */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  {t.originHub}
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] text-[#F8FAFC] rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                >
                  {demoLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.district})
                    </option>
                  ))}
                </select>
                {errors.originId && (
                  <span className="text-[10px] text-red-400 mt-0.5 block">{errors.originId}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  {t.destHub}
                </label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] text-[#F8FAFC] rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                >
                  {demoLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.district})
                    </option>
                  ))}
                </select>
                {errors.destId && (
                  <span className="text-[10px] text-red-400 mt-0.5 block">{errors.destId}</span>
                )}
              </div>
            </div>

            {/* 5. Schedule & Timetable */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  {t.departureTime}
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] text-[#F8FAFC] rounded-md px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  {t.deadlineTime}
                </label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] text-[#F8FAFC] rounded-md px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[46px] py-3 px-4 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] active:opacity-90 disabled:opacity-50 text-[#0B1B32] font-bold text-xs rounded-md shadow-md shadow-[#0B1B32]/40 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#83A6CE]/50"
              >
                {isSubmitting ? (
                  <span>{t.calculatingBtn}</span>
                ) : (
                  <>
                    <span>{t.calculateRoutesBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right / Main Fullscreen Interactive Map */}
      <div className="flex-1 relative h-full">
        <CorridorMap
          originCoords={currentOriginNode ? [currentOriginNode.lat, currentOriginNode.lng] : undefined}
          originName={currentOriginNode?.name}
          destCoords={currentDestNode ? [currentDestNode.lat, currentDestNode.lng] : undefined}
          destName={currentDestNode?.name}
          restrictions={DEMO_RESTRICTIONS}
          driverReports={getSavedReports()}
          className="w-full h-full"
        />

        {/* Floating Restriction Legend (bottom-right per prompt requirements) */}
        <div className="absolute bottom-5 right-5 z-10 bg-[#0D1E4C]/95 backdrop-blur-md border border-[#26415E] p-3 rounded-lg shadow-2xl space-y-2 text-xs max-w-xs">
          <div className="font-semibold text-[#F8FAFC] border-b border-[#26415E] pb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#83A6CE]">Road Restriction Legend</span>
            <span className="text-[10px] text-[#E5C9D7]/70 font-mono">Demo Corridor</span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#26415E] border border-red-500 text-red-400 font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                !
              </span>
              <span className="text-xs">Weight-limit bridge (e.g. 20 t / 18 t)</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#26415E] border border-[#C48CB3] text-[#C48CB3] font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                H
              </span>
              <span className="text-xs">Low clearance rail/gantry (e.g. 3.8 m)</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#26415E] border border-red-500 text-red-400 font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                T
              </span>
              <span className="text-xs">Time-based municipal heavy ban</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-[#26415E] border border-[#83A6CE] text-[#83A6CE] font-mono font-bold flex items-center justify-center text-[11px] shrink-0">
                W
              </span>
              <span className="text-xs">Narrow road / bridge width (2.5 m)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

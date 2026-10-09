import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Trash2, ArrowRight, Save, Truck, Layers } from 'lucide-react';
import { TruckSilhouette } from '../components/TruckSilhouette';
import {
  getSavedVehicles,
  saveVehicle,
  deleteVehicle,
  getActiveVehicleId,
  setActiveVehicleId,
} from '../services/storage';
import { VehicleProfile, VehicleType, CargoType } from '../types/truck';
import { useLanguage } from '../context/LanguageContext';

export const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [vehicles, setVehicles] = useState<VehicleProfile[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile | null>(null);
  const [activeVehicleId, setActiveId] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Form edit fields
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<VehicleType>('container');
  const [editWeight, setEditWeight] = useState(35.0);
  const [editHeight, setEditHeight] = useState(4.20);
  const [editWidth, setEditWidth] = useState(2.50);
  const [editLength, setEditLength] = useState(14.80);
  const [editAxles, setEditAxles] = useState(5);
  const [editCargo, setEditCargo] = useState<CargoType>('general');
  const [editReg, setEditReg] = useState('');

  useEffect(() => {
    const list = getSavedVehicles();
    setVehicles(list);
    const active = getActiveVehicleId();
    setActiveId(active);
    const found = list.find((v) => v.id === active) || list[0];
    if (found) {
      selectVehicle(found);
    }
  }, []);

  const selectVehicle = (v: VehicleProfile) => {
    setSelectedVehicle(v);
    setEditName(v.name);
    setEditType(v.type);
    setEditWeight(v.loadedWeightT);
    setEditHeight(v.heightM);
    setEditWidth(v.widthM);
    setEditLength(v.lengthM);
    setEditAxles(v.axles);
    setEditCargo(v.defaultCargo);
    setEditReg(v.registrationNumber || '');
  };

  const handleCreateNew = (presetType: VehicleType = 'container') => {
    let defaults: Partial<VehicleProfile> = {
      name: 'Custom New Freight Unit',
      type: presetType,
      loadedWeightT: 32.0,
      heightM: 4.0,
      widthM: 2.5,
      lengthM: 12.0,
      axles: 4,
      defaultCargo: 'general',
      registrationNumber: `MH ${Math.floor(10 + Math.random() * 89)} TC ${Math.floor(1000 + Math.random() * 8999)}`,
    };

    if (presetType === 'tanker') {
      defaults = {
        name: 'Chemical / Bulk Liquid Tanker',
        type: 'tanker',
        loadedWeightT: 28.0,
        heightM: 3.5,
        widthM: 2.45,
        lengthM: 11.5,
        axles: 3,
        defaultCargo: 'hazardous',
      };
    } else if (presetType === 'tipper') {
      defaults = {
        name: 'Heavy Rigid Mining Tipper',
        type: 'tipper',
        loadedWeightT: 42.0,
        heightM: 3.8,
        widthM: 2.55,
        lengthM: 9.8,
        axles: 4,
        defaultCargo: 'general',
      };
    } else if (presetType === 'flatbed') {
      defaults = {
        name: 'Heavy Duty 22-Wheeler Flatbed',
        type: 'flatbed',
        loadedWeightT: 48.0,
        heightM: 3.2,
        widthM: 2.6,
        lengthM: 16.5,
        axles: 6,
        defaultCargo: 'general',
      };
    }

    const newVehicle: VehicleProfile = {
      id: `veh_${Date.now()}`,
      name: defaults.name!,
      type: defaults.type!,
      loadedWeightT: defaults.loadedWeightT!,
      heightM: defaults.heightM!,
      widthM: defaults.widthM!,
      lengthM: defaults.lengthM!,
      axles: defaults.axles!,
      defaultCargo: defaults.defaultCargo!,
      registrationNumber: defaults.registrationNumber,
    };

    const updated = saveVehicle(newVehicle);
    setVehicles(updated);
    selectVehicle(newVehicle);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const updated: VehicleProfile = {
      ...selectedVehicle,
      name: editName,
      type: editType,
      loadedWeightT: Number(editWeight),
      heightM: Number(editHeight),
      widthM: Number(editWidth),
      lengthM: Number(editLength),
      axles: Number(editAxles),
      defaultCargo: editCargo,
      registrationNumber: editReg,
    };

    const list = saveVehicle(updated);
    setVehicles(list);
    setSelectedVehicle(updated);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (vehicles.length <= 1) {
      alert('You must keep at least one vehicle profile in the system.');
      return;
    }
    const updated = deleteVehicle(id);
    setVehicles(updated);
    if (selectedVehicle?.id === id) {
      selectVehicle(updated[0]);
    }
  };

  const handleUseInPlanner = () => {
    if (!selectedVehicle) return;
    setActiveVehicleId(selectedVehicle.id);
    navigate('/plan');
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26415E] pb-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {t.fleetTitle}
            </h1>
            <p className="text-xs text-[#E5C9D7]/80 mt-1">
              {t.fleetSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCreateNew('container')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] rounded-md transition-colors cursor-pointer shadow-md shadow-[#0B1B32]/40"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addVehicle}</span>
            </button>
          </div>
        </div>

        {/* Preset Template Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-300">
          <span className="font-mono text-[#83A6CE] text-[11px] shrink-0">
            {language === 'hi' ? 'त्वरित प्रीसेट जोड़ें:' : 'ADD PRESET:'}
          </span>
          <button
            onClick={() => handleCreateNew('container')}
            className="px-2.5 py-1 rounded bg-[#26415E]/50 border border-[#26415E] hover:border-[#83A6CE] text-slate-200 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            + {t.presetContainer}
          </button>
          <button
            onClick={() => handleCreateNew('tanker')}
            className="px-2.5 py-1 rounded bg-[#26415E]/50 border border-[#26415E] hover:border-[#83A6CE] text-slate-200 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            + {t.presetTanker}
          </button>
          <button
            onClick={() => handleCreateNew('tipper')}
            className="px-2.5 py-1 rounded bg-[#26415E]/50 border border-[#26415E] hover:border-[#83A6CE] text-slate-200 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            + {t.presetMultiAxle}
          </button>
          <button
            onClick={() => handleCreateNew('flatbed')}
            className="px-2.5 py-1 rounded bg-[#26415E]/50 border border-[#26415E] hover:border-[#83A6CE] text-slate-200 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
          >
            + {t.presetHeavyHauler}
          </button>
        </div>

        {/* Main Content Layout: Grid of Cards on Left + Edit Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Grid: Vehicle Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              const isActivePlanner = activeVehicleId === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => selectVehicle(v)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer relative flex flex-col justify-between space-y-3.5 ${
                    isSelected
                      ? 'bg-[#26415E] border-[#83A6CE] shadow-lg ring-1 ring-[#83A6CE]/30'
                      : 'bg-[#0D1E4C] border-[#26415E] hover:border-[#83A6CE]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-[#83A6CE] uppercase tracking-wider block font-semibold">
                          {v.type}
                        </span>
                        <h3 className="font-display text-sm font-bold text-[#F8FAFC] line-clamp-1">
                          {v.name}
                        </h3>
                      </div>
                      {isActivePlanner && (
                        <span className="text-[10px] font-mono bg-[#0B1B32] text-[#83A6CE] border border-[#83A6CE]/40 px-1.5 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Technical SVG Side-View Blueprint */}
                    <div className="py-2 px-1 bg-[#0B1B32] rounded-md border border-[#26415E]">
                      <TruckSilhouette
                        type={v.type}
                        className="w-full h-14"
                        accentColor={isSelected ? '#83A6CE' : '#26415E'}
                      />
                    </div>
                  </div>

                  {/* Specs Strip */}
                  <div className="pt-2 border-t border-[#26415E] grid grid-cols-4 gap-1 text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-400 block">WEIGHT</span>
                      <span>{v.loadedWeightT} t</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">HEIGHT</span>
                      <span>{v.heightM} m</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">AXLES</span>
                      <span>{v.axles}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">CARGO</span>
                      <span className="capitalize">{v.defaultCargo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Vehicle Editor Panel */}
          <div className="lg:col-span-5 bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 shadow-xl space-y-4 sticky top-4">
            {selectedVehicle ? (
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#26415E] pb-2.5">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#F8FAFC]">
                      Edit Vehicle Specifications
                    </h2>
                    <span className="text-[11px] font-mono text-[#E5C9D7]/70">
                      ID: {selectedVehicle.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedVehicle.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-md transition-colors cursor-pointer"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">
                      Vehicle Label / Model
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-200 mb-1">
                        Category Type
                      </label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as VehicleType)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] capitalize focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                      >
                        <option value="container">Container</option>
                        <option value="tanker">Tanker</option>
                        <option value="tipper">Tipper</option>
                        <option value="flatbed">Flatbed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-200 mb-1">
                        Registration Plate
                      </label>
                      <input
                        type="text"
                        value={editReg}
                        onChange={(e) => setEditReg(e.target.value)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-200 mb-1">
                        Loaded Weight (t)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={editWeight}
                        onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-200 mb-1">
                        Overhead Height (m)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={editHeight}
                        onChange={(e) => setEditHeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                        Width (m)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={editWidth}
                        onChange={(e) => setEditWidth(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-2.5 py-1 text-xs text-[#F8FAFC] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                        Length (m)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={editLength}
                        onChange={(e) => setEditLength(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-2.5 py-1 text-xs text-[#F8FAFC] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                        Axles
                      </label>
                      <input
                        type="number"
                        value={editAxles}
                        onChange={(e) => setEditAxles(parseInt(e.target.value, 10) || 2)}
                        className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-2.5 py-1 text-xs text-[#F8FAFC] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">
                      Cargo Classification
                    </label>
                    <select
                      value={editCargo}
                      onChange={(e) => setEditCargo(e.target.value as CargoType)}
                      className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] capitalize focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                    >
                      <option value="general">General Dry Freight</option>
                      <option value="hazardous">Hazardous Materials (HAZMAT/POL)</option>
                      <option value="perishable">Perishable Goods</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] font-bold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0B1B32]/40"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveFeedback ? 'Changes Saved!' : 'Save Changes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseInPlanner}
                    className="w-full py-2.5 px-3 bg-[#26415E] hover:bg-[#26415E]/80 border border-[#26415E] text-[#E5C9D7] font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Use in Route Planner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center text-slate-400 py-12 text-xs">
                Select a vehicle profile to view and modify parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

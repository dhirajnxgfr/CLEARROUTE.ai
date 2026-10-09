import React, { useState } from 'react';
import { CorridorMap } from '../components/CorridorMap';
import { DEMO_RESTRICTIONS } from '../data/corridorGraph';
import { Restriction, RestrictionType } from '../types/truck';
import { Filter, Scale, ArrowUpDown, Clock, Layers, ShieldAlert, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RestrictionsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [weightThreshold, setWeightThreshold] = useState<number>(50);
  const [selectedRestriction, setSelectedRestriction] = useState<Restriction | null>(null);

  // Filter restrictions
  const filteredRestrictions = DEMO_RESTRICTIONS.filter((r) => {
    if (selectedType !== 'all') {
      if (selectedType === 'weight' && r.type !== 'max_weight_t') return false;
      if (selectedType === 'height' && r.type !== 'max_height_m') return false;
      if (selectedType === 'time' && r.type !== 'time_ban') return false;
      if (selectedType === 'width' && r.type !== 'max_width_m') return false;
    }

    if (r.type === 'max_weight_t' && r.value > weightThreshold) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Filter & Details Panel (440px) */}
      <div className="w-full lg:w-[440px] shrink-0 bg-[#0D1E4C] border-r border-[#26415E] flex flex-col h-full z-20">
        <div className="p-4 border-b border-[#26415E] space-y-1.5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-base font-bold text-[#F8FAFC]">
              {t.restrictionsTitle}
            </h1>
            <span className="text-[10px] font-mono text-[#83A6CE] bg-[#0B1B32] px-2 py-0.5 rounded border border-[#26415E]">
              {language === 'hi' ? 'डेमो डेटा' : 'Demo Data'}
            </span>
          </div>
          <p className="text-xs text-[#E5C9D7]/80">
            {t.restrictionsSubtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-[#26415E] bg-[#0B1B32] space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-200 mb-1.5">
              {language === 'hi' ? 'प्रतिबंध प्रकार अनुसार फिल्टर' : 'Filter by Restriction Type'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'weight', label: t.filterWeight },
                { id: 'height', label: t.filterHeight },
                { id: 'time', label: t.filterTime },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`py-1.5 px-2 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    selectedType === tab.id
                      ? 'bg-[#83A6CE] text-[#0B1B32] font-bold'
                      : 'bg-[#26415E]/50 text-slate-300 border border-[#26415E] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Threshold Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
              <span>{language === 'hi' ? 'भार क्षमता फिल्टर' : 'Weight Capacity Filter'}</span>
              <span className="font-mono text-[#83A6CE] font-bold">≤ {weightThreshold} t</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={weightThreshold}
              onChange={(e) => setWeightThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-[#83A6CE] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#E5C9D7]/60 mt-0.5">
              <span>10 t</span>
              <span>35 t</span>
              <span>60 t</span>
            </div>
          </div>
        </div>

        {/* Restrictions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs text-slate-300 flex items-center justify-between">
            <span>Showing {filteredRestrictions.length} documented restrictions</span>
          </div>

          {filteredRestrictions.map((res) => {
            const isSelected = selectedRestriction?.id === res.id;
            let badgeColor = 'border-red-500 text-red-400';
            let iconText = '!';
            if (res.type === 'max_height_m') {
              badgeColor = 'border-[#C48CB3] text-[#C48CB3]';
              iconText = 'H';
            } else if (res.type === 'time_ban') {
              badgeColor = 'border-red-500 text-red-400';
              iconText = 'T';
            } else if (res.type === 'max_width_m') {
              badgeColor = 'border-[#83A6CE] text-[#83A6CE]';
              iconText = 'W';
            }

            return (
              <div
                key={res.id}
                onClick={() => setSelectedRestriction(res)}
                className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-[#26415E] border-[#83A6CE] shadow-md ring-1 ring-[#83A6CE]/30'
                    : 'bg-[#0B1B32] border-[#26415E] hover:border-[#83A6CE]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded bg-[#0D1E4C] border ${badgeColor} font-mono font-bold flex items-center justify-center text-[11px] shrink-0`}
                    >
                      {iconText}
                    </span>
                    <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                      {res.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#E5C9D7]/70">Demo</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                <div className="pt-2 border-t border-[#26415E] flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-mono text-[#83A6CE]">{res.locationName}</span>
                  {res.sourceAuthority && (
                    <span className="text-[10px] text-[#E5C9D7]/70 truncate max-w-[140px]">
                      {res.sourceAuthority}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Map View */}
      <div className="flex-1 relative h-full min-h-[450px]">
        <CorridorMap
          restrictions={filteredRestrictions}
          className="w-full h-full"
        />

        {/* Selected Restriction Detail Toast */}
        {selectedRestriction && (
          <div className="absolute top-5 left-5 right-5 sm:right-auto sm:max-w-md z-10 bg-[#0D1E4C]/95 backdrop-blur-md border border-[#83A6CE] p-4 rounded-xl shadow-2xl space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#83A6CE] uppercase tracking-wider block font-bold">
                  INFRASTRUCTURE LIMIT DATA
                </span>
                <h4 className="font-display text-base font-bold text-[#F8FAFC]">
                  {selectedRestriction.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedRestriction(null)}
                className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-[#26415E] cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedRestriction.description}</p>
            <div className="text-[11px] text-[#E5C9D7]/80 pt-2 border-t border-[#26415E] flex justify-between font-mono">
              <span>Authority: {selectedRestriction.sourceAuthority}</span>
              <span>GPS: {selectedRestriction.lat}, {selectedRestriction.lng}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Layers, Info, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CoveragePage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#26415E] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0D1E4C] border border-[#26415E] text-xs font-mono text-[#83A6CE]">
            {t.coverageSubtitle}
          </div>
          <h1 className="font-display text-3xl font-bold text-[#F8FAFC]">
            {t.coverageTitle}
          </h1>
          <p className="text-sm text-[#E5C9D7]/80">
            {language === 'hi'
              ? 'इण्डिया नेक्स्टजेन टेकफ्यूजन 2026 हेतु निर्मित। समर्थित विनिर्देशों और टेस्ट कॉरिडोर सीमाओं का तकनीकी प्रलेखन।'
              : 'Built for India NextGen TechFusion 2026. Explicit documentation of supported parameters and test corridor boundaries.'}
          </p>
        </div>

        {/* 1. Disclaimer Callout */}
        <div className="bg-red-950/20 border border-red-800/40 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{t.disclaimerTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
            {t.disclaimerText}
          </p>
        </div>

        {/* 2. Geographic Corridor Scope */}
        <div className="bg-[#0D1E4C] border border-[#26415E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#83A6CE]" />
            <span>{t.corridorScopeTitle}</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.corridorScopeText}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-slate-300">
            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E]">
              <span className="text-[#83A6CE] block text-[10px]">{language === 'hi' ? 'प्रस्थान हब' : 'ORIGIN HUB'}</span>
              <span>{language === 'hi' ? 'जेएनपीटी कंटेनर टर्मिनल 4' : 'JNPT Container Terminal 4'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E]">
              <span className="text-[#83A6CE] block text-[10px]">{language === 'hi' ? 'तटीय सीएफएस' : 'COASTAL CFS'}</span>
              <span>{language === 'hi' ? 'उरण / कलंबोली सीएफएस' : 'Uran / Kalamboli CFS'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E]">
              <span className="text-[#83A6CE] block text-[10px]">{language === 'hi' ? 'पर्वतीय दर्रा' : 'MOUNTAIN PASS'}</span>
              <span>{language === 'hi' ? 'भोर घाट / खंडाला पास' : 'Bhor Ghat / Khandala Pass'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E]">
              <span className="text-[#83A6CE] block text-[10px]">{language === 'hi' ? 'गंतव्य' : 'DESTINATION'}</span>
              <span>{language === 'hi' ? 'चाकण एमआईडीसी फेज 2' : 'Chakan MIDC Phase 2'}</span>
            </div>
          </div>
        </div>

        {/* 3. Supported Vehicle Types Grid */}
        <div className="bg-[#0D1E4C] border border-[#26415E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
            Supported Vehicle Classifications (4 Types)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B1B32] border border-[#26415E] space-y-2">
              <span className="text-xs font-bold text-[#83A6CE]">1. Multi-Axle Container Tractor-Trailer</span>
              <p className="text-xs text-slate-300">
                40ft High-Cube dry shipping container (up to 4.25 m height, 5 axles, 35-44 gross tonnes).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1B32] border border-[#26415E] space-y-2">
              <span className="text-xs font-bold text-[#83A6CE]">2. Petroleum & Chemical Liquid Tanker</span>
              <p className="text-xs text-slate-300">
                Pressurized cylindrical vessels (HAZMAT/POL class, subject to expressway tunnel transit hours).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1B32] border border-[#26415E] space-y-2">
              <span className="text-xs font-bold text-[#83A6CE]">3. Heavy Mining & Quarry Rigid Tipper</span>
              <p className="text-xs text-slate-300">
                Rigid 4-axle rock bodies (high gross tonnage up to 42 t, sensitive to bridge bending moments).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1B32] border border-[#26415E] space-y-2">
              <span className="text-xs font-bold text-[#83A6CE]">4. 22-Wheeler Heavy Lowbed Flatbed</span>
              <p className="text-xs text-slate-300">
                Industrial machinery hauler (extra length 16.5 m, width 2.6 m, 6 axles, gross weight up to 48 t).
              </p>
            </div>
          </div>
        </div>

        {/* 4. Supported Restriction Types */}
        <div className="bg-[#0D1E4C] border border-[#26415E] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
            Supported Restriction Types (4 Types)
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E] flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-[#26415E] border-2 border-red-500 text-red-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                !
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#F8FAFC]">Bridge Gross Weight Thresholds (t)</h3>
                <p className="text-xs text-slate-300">
                  Checks vehicle gross weight against masonry arches, submersible causeways, and aging PWD structures (e.g. 18 t & 20 t limits).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E] flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-[#26415E] border-2 border-[#C48CB3] text-[#C48CB3] font-mono font-bold flex items-center justify-center text-xs shrink-0">
                H
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#F8FAFC]">Overhead Vertical Clearances (m)</h3>
                <p className="text-xs text-slate-300">
                  Evaluates total vehicle height against low railway girder bridges, toll gantry steelwork, and urban pipeline crossings (e.g. 3.80 m clearance).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E] flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-[#26415E] border-2 border-red-500 text-red-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                T
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#F8FAFC]">Municipal Time-of-Day Curfew Bans (HH:mm)</h3>
                <p className="text-xs text-slate-300">
                  Calculates estimated arrival time at urban centers to prevent entry during morning/evening school and rush-hour truck curfews (e.g. 07:00 - 11:00).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B1B32] border border-[#26415E] flex items-start gap-3">
              <span className="w-6 h-6 rounded bg-[#26415E] border-2 border-[#83A6CE] text-[#83A6CE] font-mono font-bold flex items-center justify-center text-xs shrink-0">
                W
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#F8FAFC]">Carriageway & Culvert Width Limits (m)</h3>
                <p className="text-xs text-slate-300">
                  Validates wide multi-axle trailers against narrow rural village connectors and single-lane stone bridges (e.g. 2.50 m limit).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

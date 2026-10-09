import React, { useState, useEffect } from 'react';
import { CorridorMap } from '../components/CorridorMap';
import { getSavedReports, addDriverReport, toggleReportActive } from '../services/storage';
import { DriverReport, HazardType } from '../types/truck';
import { AlertTriangle, Plus, CheckCircle2, ShieldAlert, Clock, MapPin, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, profile } = useAuth();
  const [reports, setReports] = useState<DriverReport[]>([]);
  const [activeOnly, setActiveOnly] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HazardType>('closure');
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');
  const [reportedBy, setReportedBy] = useState('Driver Sunil (MH-46)');
  const [formFeedback, setFormFeedback] = useState(false);

  useEffect(() => {
    if (profile?.displayName || user?.displayName) {
      setReportedBy(profile?.displayName || user?.displayName || 'Driver Sunil (MH-46)');
    }
  }, [profile, user]);

  useEffect(() => {
    setReports(getSavedReports());
  }, []);

  const handleToggle = (id: string) => {
    const updated = toggleReportActive(id);
    setReports(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;

    // Approximate lat/lng around corridor
    const lat = 18.78 + (Math.random() - 0.5) * 0.15;
    const lng = 73.35 + (Math.random() - 0.5) * 0.2;

    const newReport = addDriverReport({
      title,
      type,
      locationName,
      lat,
      lng,
      active: true,
      severity: 'blocking',
      reportedBy,
      notes,
    });

    setReports(getSavedReports());
    setTitle('');
    setLocationName('');
    setNotes('');
    setFormFeedback(true);
    setTimeout(() => setFormFeedback(false), 2500);
  };

  const displayedReports = activeOnly ? reports.filter((r) => r.active) : reports;

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Form & Reports Feed (460px) */}
      <div className="w-full lg:w-[460px] shrink-0 bg-[#0D1E4C] border-r border-[#26415E] flex flex-col h-full z-20">
        <div className="p-4 border-b border-[#26415E] space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-base font-bold text-[#F8FAFC]">
              {t.driverReportsTitle}
            </h1>
            <span className="text-[10px] font-mono text-[#83A6CE] bg-[#0B1B32] px-2 py-0.5 rounded border border-[#26415E]">
              {language === 'hi' ? 'लाइव मेश' : 'Live Mesh'}
            </span>
          </div>
          <p className="text-xs text-[#E5C9D7]/80">
            {t.driverReportsSubtitle}
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Submit New Report Form */}
          <div className="bg-[#0B1B32] border border-[#26415E] rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#83A6CE]">
                {t.reportNewIssue}
              </span>
              {formFeedback && (
                <span className="text-[10px] font-mono text-[#C48CB3]">
                  {language === 'hi' ? 'रिपोर्ट प्रसारित!' : 'Report Broadcasted!'}
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#E5C9D7]/80 mb-1">
                  {t.incidentType}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['closure', 'waterlogging', 'landslide', 'accident'] as HazardType[]).map((hType) => (
                    <button
                      key={hType}
                      type="button"
                      onClick={() => setType(hType)}
                      className={`py-1.5 px-1 text-xs rounded-md capitalize border font-medium transition-all cursor-pointer ${
                        type === hType
                          ? 'bg-[#83A6CE] text-[#0B1B32] font-bold border-[#83A6CE]'
                          : 'bg-[#0D1E4C] text-slate-300 border-[#26415E] hover:border-[#83A6CE]/50'
                      }`}
                    >
                      {hType === 'closure' ? (language === 'hi' ? 'बंद' : 'closure') :
                       hType === 'waterlogging' ? (language === 'hi' ? 'जलभराव' : 'waterlog') :
                       hType === 'landslide' ? (language === 'hi' ? 'भूस्खलन' : 'landslide') :
                       (language === 'hi' ? 'दुर्घटना' : 'accident')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'घटना का शीर्षक (उदा. अमृतांजन घाट पर पत्थर गिरना)' : 'Report title (e.g. Amrutanjan Ghat Rockfall)'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0D1E4C] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'स्थान का मील का पत्थर (उदा. पुराना NH48 KM 42)' : 'Location landmark (e.g. Old NH48 KM 42)'}
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#0D1E4C] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                  required
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Additional driver observations & detour notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0D1E4C] border border-[#26415E] rounded-md px-3 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
              >
                Submit & Invalidate Affected Edges
              </button>
            </form>
          </div>

          {/* Active Reports List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-[#F8FAFC]">Community Incident Log</span>
              <button
                onClick={() => setActiveOnly(!activeOnly)}
                className="text-[11px] font-mono text-[#83A6CE] hover:underline cursor-pointer"
              >
                {activeOnly ? 'Show All' : 'Active Only'}
              </button>
            </div>

            {displayedReports.map((r) => (
              <div
                key={r.id}
                className={`p-3 rounded-lg border transition-all space-y-1.5 ${
                  r.active
                    ? 'bg-[#191012] border-red-900/50'
                    : 'bg-[#0B1B32] border-[#26415E] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        r.active ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
                      }`}
                    ></span>
                    <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                      {r.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleToggle(r.id)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded border cursor-pointer ${
                      r.active
                        ? 'bg-red-950/60 text-red-300 border-red-800/50 hover:bg-red-900/50'
                        : 'bg-[#0D1E4C] text-slate-300 border-[#26415E]'
                    }`}
                  >
                    {r.active ? 'ACTIVE (BLOCKING)' : 'RESOLVED'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{r.notes}</p>

                <div className="pt-2 border-t border-[#26415E] flex items-center justify-between text-[11px] text-[#E5C9D7]/80">
                  <span>{r.locationName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{r.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Map View */}
      <div className="flex-1 relative h-full min-h-[450px]">
        <CorridorMap
          driverReports={displayedReports}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

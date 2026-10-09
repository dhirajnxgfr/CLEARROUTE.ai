import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Navigation2,
  Volume2,
  VolumeX,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock,
  Gauge,
  MapPin,
  RefreshCw,
  X,
  Plus,
} from 'lucide-react';
import { CorridorMap } from '../components/CorridorMap';
import { getSavedPlan, getSavedReports, addDriverReport, savePlan } from '../services/storage';
import { RoutingPlan, RouteOption, DriverReport } from '../types/truck';
import { computeTruckRoute, formatHoursToTime } from '../engine/routingEngine';
import { DEMO_RESTRICTIONS } from '../data/corridorGraph';
import { useLanguage } from '../context/LanguageContext';

interface TurnInstruction {
  distanceText: string;
  instruction: string;
  subText: string;
  turnType: 'straight' | 'right' | 'left' | 'merge';
}

const SAMPLE_TURN_STEPS: TurnInstruction[] = [
  {
    distanceText: '800 m',
    instruction: 'Keep Right toward Khalapur Toll Plaza',
    subText: 'NH 48 Expressway Freight Lane 1',
    turnType: 'straight',
  },
  {
    distanceText: '2.4 km',
    instruction: 'Prepare for Bhor Ghat Viaduct Approach',
    subText: 'Multi-axle trucks maintain 40 km/h in leftmost lane',
    turnType: 'straight',
  },
  {
    distanceText: '14.2 km',
    instruction: 'Pass Khandala Flyover & Expressway Tunnel 2',
    subText: 'Overhead clearance verified: 4.8 m',
    turnType: 'straight',
  },
  {
    distanceText: '38.5 km',
    instruction: 'Take Exit toward Talegaon Dabhade / Chakan',
    subText: 'Exit 14B · Talegaon-Chakan 4-Lane Industrial Highway',
    turnType: 'right',
  },
  {
    distanceText: '11.0 km',
    instruction: 'Arrive at Chakan MIDC Phase 2 Auto Cluster',
    subText: 'Terminal Gate 3 Inbound Delivery',
    turnType: 'left',
  },
];

const SAMPLE_TURN_STEPS_HI: TurnInstruction[] = [
  {
    distanceText: '800 मी.',
    instruction: 'खालापुर टोल प्लाजा की ओर दाएं रहें',
    subText: 'NH 48 एक्सप्रेसवे भारी माल लेन 1',
    turnType: 'straight',
  },
  {
    distanceText: '2.4 किमी',
    instruction: 'भोर घाट वायाडक्ट के लिए तैयार रहें',
    subText: 'मल्टी-एक्सल ट्रक बाईं लेन में 40 किमी/घंटा रखें',
    turnType: 'straight',
  },
  {
    distanceText: '14.2 किमी',
    instruction: 'खंडाला फ्लाईओवर और सुरंग 2 पार करें',
    subText: 'ऊंचाई क्लीयरेंस सत्यापित: 4.8 मीटर',
    turnType: 'straight',
  },
  {
    distanceText: '38.5 किमी',
    instruction: 'तलेगांव दाभाड़े / चाकण की ओर निकास लें',
    subText: 'निकास 14B · तालेगांव-चाकण 4-लेन औद्योगिक हाईवे',
    turnType: 'right',
  },
  {
    distanceText: '11.0 किमी',
    instruction: 'चाकण MIDC फेज 2 ऑटो क्लस्टर पर आगमन',
    subText: 'टर्मिनल गेट 3 इनबाउंड डिलीवरी',
    turnType: 'left',
  },
];

export const NavigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [plan, setPlan] = useState<RoutingPlan | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [muted, setMuted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Simulation state
  const [progressFraction, setProgressFraction] = useState(0.15); // 0 to 1
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(54);
  const [isRerouted, setIsRerouted] = useState(false);
  const [rerouteNotice, setRerouteNotice] = useState<string>('');

  // Proximity Alert Banner
  const [showAlert, setShowAlert] = useState(true);
  const [alertText, setAlertText] = useState(
    'Low clearance in 2.4 km: Bridge clearance 4.5 m, your truck is 4.2 m. You can pass safely.'
  );

  // Road condition report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('Monsoon Ghat Roadwork');
  const [reportType, setReportType] = useState<'closure' | 'waterlogging' | 'landslide' | 'accident'>('closure');
  const [reportNotes, setReportNotes] = useState('Lane blocked by fallen boulder near Old Ghat hairpin.');

  useEffect(() => {
    if (!id) return;
    const loaded = getSavedPlan(id);
    if (loaded) {
      setPlan(loaded);
      const chosen = loaded.routes.find((r) => r.id === loaded.recommendedRouteId) || loaded.routes[0];
      setActiveRoute(chosen);
    }
  }, [id]);

  // Simulated truck movement along coordinates
  useEffect(() => {
    if (!activeRoute || activeRoute.coordinates.length < 2) return;

    const timer = setInterval(() => {
      setProgressFraction((prev) => {
        const next = prev + 0.015;
        if (next >= 0.95) return 0.95; // near end
        return next;
      });

      // Fluctuate speed slightly
      setCurrentSpeedKmh((prev) => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.min(68, Math.max(38, Math.round(prev + delta)));
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [activeRoute]);

  // Step progression based on fraction
  useEffect(() => {
    if (progressFraction > 0.75) setStepIndex(4);
    else if (progressFraction > 0.5) setStepIndex(3);
    else if (progressFraction > 0.3) setStepIndex(2);
    else if (progressFraction > 0.15) setStepIndex(1);
    else setStepIndex(0);
  }, [progressFraction]);

  if (!plan || !activeRoute) {
    return (
      <div className="min-h-screen bg-[#0B1B32] flex items-center justify-center text-slate-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#83A6CE] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-sm text-[#E5C9D7]">Initializing Cab Navigation HUD...</p>
        </div>
      </div>
    );
  }

  // Calculate truck current coordinate from progress
  const coords = activeRoute.coordinates;
  const targetIndex = Math.min(coords.length - 1, Math.floor(progressFraction * coords.length));
  const truckPos = coords[targetIndex] || coords[0];

  const totalKm = activeRoute.distanceKm;
  const kmRemaining = Math.max(0, Math.round((totalKm * (1 - progressFraction)) * 10) / 10);
  const minsRemaining = Math.max(0, Math.round(activeRoute.timeMin * (1 - progressFraction)));

  const turnSteps = language === 'hi' ? SAMPLE_TURN_STEPS_HI : SAMPLE_TURN_STEPS;
  const currentTurn = turnSteps[stepIndex] || turnSteps[0];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    // Submit report
    const newRep = addDriverReport({
      title: reportTitle,
      type: reportType,
      locationName: 'Near Current GPS Milepost',
      lat: truckPos[0] + 0.005,
      lng: truckPos[1] + 0.005,
      active: true,
      severity: 'blocking',
      reportedBy: `Truck Unit #${plan.vehicle.registrationNumber || 'MH-46'}`,
      notes: reportNotes,
    });

    setReportModalOpen(false);

    // Trigger dynamic rerouting
    setIsRerouted(true);
    setRerouteNotice(
      `Rerouted just now: ${reportTitle} reported ahead. New path stays fully legal for ${plan.vehicle.loadedWeightT} t.`
    );
    setAlertText(
      `Dynamic Reroute Active: Avoiding ${reportTitle}. Highway clearance & weight parameters maintained.`
    );
    setShowAlert(true);
  };

  const handleSimulateReroute = () => {
    setIsRerouted(true);
    setRerouteNotice(
      `Rerouted 4 min ago: Heavy vehicle congestion on rural approach. Expressway freight link adds 3 min and stays 100% legal for ${plan.vehicle.loadedWeightT} t.`
    );
    setShowAlert(true);
    setAlertText(
      `Overhead clearance 4.8 m ahead on Bhor Ghat viaduct (Truck: ${plan.vehicle.heightM} m). Safe passage assured.`
    );
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden relative">
      {/* Left Tablet / Cab Navigation Column (460px) */}
      <div className="w-full lg:w-[460px] shrink-0 bg-[#0D1E4C] border-r border-[#26415E] flex flex-col justify-between p-4 sm:p-5 space-y-4 z-20">
        <div className="space-y-4">
          {/* Top Bar inside cab HUD */}
          <div className="flex items-center justify-between border-b border-[#26415E] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#83A6CE] animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                CAB TELEMATICS HUD
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-1.5 rounded-md bg-[#26415E] border border-[#26415E] text-slate-300 hover:text-white transition-colors"
                title={muted ? 'Unmute Voice Prompts' : 'Mute Voice Prompts'}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[11px] font-mono text-[#83A6CE] bg-[#0B1B32] px-2 py-0.5 rounded border border-[#26415E]">
                GPS ACTIVE
              </span>
            </div>
          </div>

          {/* 1. Big Turn-by-Turn Card */}
          <div className="bg-[#0B1B32] border border-[#26415E] rounded-xl p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {currentTurn.distanceText}
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-[#F8FAFC] leading-snug pt-1">
                  {currentTurn.instruction}
                </div>
                <div className="text-xs text-[#E5C9D7]/80 pt-1">
                  {currentTurn.subText}
                </div>
              </div>

              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#83A6CE] to-[#C48CB3] text-[#0B1B32] flex items-center justify-center shrink-0 shadow-md">
                {currentTurn.turnType === 'right' ? (
                  <ArrowRight className="w-7 h-7 stroke-[2.5]" />
                ) : currentTurn.turnType === 'left' ? (
                  <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
                ) : (
                  <ArrowUp className="w-7 h-7 stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Bottom Lane Guidance */}
            <div className="mt-3 pt-2.5 border-t border-[#26415E] flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono text-slate-400 text-[11px]">Designated Corridor:</span>
              <span className="font-mono font-bold text-[#83A6CE] text-[11px]">
                HEAVY FREIGHT LANE (LEFT)
              </span>
            </div>
          </div>

          {/* 2. Amber Alert Banner for Upcoming Restriction Radar */}
          {showAlert && (
            <div className="bg-[#26415E]/60 border border-[#C48CB3]/50 rounded-lg p-3.5 shadow-md flex items-start gap-3 relative">
              <AlertTriangle className="w-4 h-4 text-[#C48CB3] shrink-0 mt-0.5" />
              <div className="space-y-0.5 pr-5">
                <div className="text-[11px] font-bold text-[#C48CB3] uppercase tracking-wider font-mono">
                  Restriction Radar
                </div>
                <p className="text-xs text-[#E5C9D7] leading-relaxed">
                  {alertText}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 3. Dynamic Rerouted Notice Card */}
          {isRerouted && (
            <div className="bg-[#26415E]/60 border border-[#83A6CE]/50 rounded-lg p-3.5 shadow-md flex items-start gap-3">
              <RefreshCw className="w-4 h-4 text-[#83A6CE] shrink-0 mt-0.5 animate-spin" />
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-[#83A6CE] uppercase tracking-wider font-mono">
                  Route Recalculated
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {rerouteNotice}
                </p>
              </div>
            </div>
          )}

          {/* Speed & Tonnage Cockpit HUD */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#0B1B32] rounded-lg border border-[#26415E]">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">
                {language === 'hi' ? 'वर्तमान गति' : 'CURRENT SPEED'}
              </span>
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-mono text-2xl font-bold text-[#83A6CE]">{currentSpeedKmh}</span>
                <span className="text-xs text-slate-400">km/h</span>
              </div>
              <span className="text-[10px] text-[#E5C9D7] font-mono">
                {language === 'hi' ? 'सीमा: 60 किमी/घंटा' : 'Limit: 60 km/h'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">
                {language === 'hi' ? 'सकल भार' : 'GROSS TONNAGE'}
              </span>
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-mono text-2xl font-bold text-[#F8FAFC]">
                  {plan.vehicle.loadedWeightT}
                </span>
                <span className="text-xs text-slate-400">{language === 'hi' ? 'टन' : 'tonnes'}</span>
              </div>
              <span className="text-[10px] text-[#C48CB3] font-mono">
                {language === 'hi' ? 'ऊंचाई: ' : 'Clearance: '}{plan.vehicle.heightM} m
              </span>
            </div>
          </div>
        </div>

        {/* Large Cab Action Buttons */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setReportModalOpen(true)}
              className="min-h-[44px] py-2.5 px-3 bg-[#26415E] hover:bg-[#26415E]/80 border border-[#26415E] text-[#F8FAFC] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#C48CB3]" />
              <span>{t.reportHazardBtn}</span>
            </button>

            <button
              onClick={handleSimulateReroute}
              className="min-h-[44px] py-2.5 px-3 bg-[#26415E] hover:bg-[#26415E]/80 border border-[#26415E] text-slate-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#83A6CE]" />
              <span>{t.rerouteBtn}</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/trips')}
            className="w-full min-h-[42px] py-2 px-3 bg-red-950/25 hover:bg-red-950/50 border border-red-800/40 text-red-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'नेविगेशन समाप्त करें (Save & End)' : 'End Navigation Trip'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Fullscreen Map Following Simulated Truck */}
      <div className="flex-1 relative h-full min-h-[450px]">
        <CorridorMap
          originCoords={[plan.origin.lat, plan.origin.lng]}
          originName={plan.origin.name}
          destCoords={[plan.destination.lat, plan.destination.lng]}
          destName={plan.destination.name}
          activeRoute={activeRoute}
          truckPosition={truckPos}
          restrictions={DEMO_RESTRICTIONS}
          driverReports={getSavedReports()}
          className="w-full h-full"
        />

        {/* Bottom Floating Stats Bar */}
        <div className="absolute bottom-5 left-5 right-5 z-10 bg-[#0D1E4C]/95 backdrop-blur-md border border-[#26415E] p-3.5 rounded-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">ESTIMATED ARRIVAL</span>
              <span className="font-mono text-base font-bold text-[#F8FAFC]">
                {formatHoursToTime(9.5 + minsRemaining / 60)}
              </span>
            </div>

            <div className="h-7 w-px bg-[#26415E]"></div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 block">REMAINING DISTANCE</span>
              <span className="font-mono text-base font-bold text-[#83A6CE]">
                {kmRemaining} km
              </span>
            </div>

            <div className="h-7 w-px bg-[#26415E]"></div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 block">DEADLINE STATUS</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#83A6CE]" />
                <span className="text-xs font-semibold text-[#83A6CE]">On Time (Target: {plan.deadlineTime})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/plan/${plan.id}`}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#26415E] hover:bg-[#26415E]/80 border border-[#26415E] rounded-md transition-colors"
            >
              Trip Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Driver Road Condition Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#26415E] pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                  Report Real-Time Road Hazard
                </h3>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hazard Classification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['closure', 'waterlogging', 'landslide', 'accident'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setReportType(t)}
                      className={`py-1.5 px-2 text-xs rounded-md capitalize border font-medium transition-all ${
                        reportType === t
                          ? 'bg-[#83A6CE] text-[#0B1B32] font-bold border-[#83A6CE]'
                          : 'bg-[#26415E]/50 text-slate-300 border-[#26415E] hover:border-[#83A6CE]/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Details & Observations
                </label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full bg-[#0B1B32] border border-[#26415E] rounded-md px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#83A6CE]"
                />
              </div>

              <p className="text-[11px] text-[#E5C9D7]/80">
                Submitting this alert flags this highway edge and triggers automated dynamic rerouting across all active heavy transport units in the corridor.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] rounded-md shadow-sm"
                >
                  Broadcast & Trigger Reroute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

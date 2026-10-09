import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Navigation,
  Clock,
  Fuel,
  Receipt,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Shield,
  Zap,
  TrendingDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CorridorMap } from '../components/CorridorMap';
import { getSavedPlan, getSavedReports } from '../services/storage';
import { RoutingPlan, RouteOption } from '../types/truck';
import { DEMO_RESTRICTIONS } from '../data/corridorGraph';
import { useLanguage } from '../context/LanguageContext';

export const PlanResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [plan, setPlan] = useState<RoutingPlan | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loaded = getSavedPlan(id);
    if (loaded) {
      setPlan(loaded);
      setSelectedRouteId(loaded.recommendedRouteId || loaded.routes[0]?.id || '');
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1B32] flex items-center justify-center text-slate-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#83A6CE] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-xs text-[#E5C9D7]">Evaluating Corridor Geometric Limits...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0B1B32] flex items-center justify-center text-[#F8FAFC] p-4">
        <div className="bg-[#0D1E4C] border border-[#26415E] p-8 rounded-xl max-w-md text-center space-y-4">
          <AlertTriangle className="w-9 h-9 text-[#C48CB3] mx-auto" />
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">Route Plan Not Found</h2>
          <p className="text-xs text-[#E5C9D7]/80">
            This route plan may have expired or was created in another session.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] text-[#0B1B32] rounded-md shadow-sm"
          >
            Create New Plan
          </Link>
        </div>
      </div>
    );
  }

  const activeRoute = plan.routes.find((r) => r.id === selectedRouteId) || plan.routes[0];

  return (
    <div className="relative w-full h-[calc(100vh-57px)] overflow-hidden bg-[#0B1B32] flex flex-col lg:flex-row">
      {/* Left Results Panel (440px) */}
      <div className="w-full lg:w-[440px] shrink-0 z-20 bg-[#0D1E4C]/95 backdrop-blur-md border-r border-[#26415E] flex flex-col h-full shadow-2xl">
        {/* Top Header & Breadcrumb */}
        <div className="p-4 border-b border-[#26415E] space-y-2">
          <div className="flex items-center justify-between">
            <Link
              to="/plan"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#83A6CE] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToPlanner}</span>
            </Link>
            <span className="text-[10px] font-mono text-[#E5C9D7]/70">
              Ref: {plan.id.slice(-8)}
            </span>
          </div>

          <h1 className="font-display text-lg font-bold text-[#F8FAFC] leading-tight">
            {plan.origin.name} <span className="text-[#83A6CE]">➔</span> {plan.destination.name}
          </h1>

          {/* Vehicle specs chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-[#0B1B32] border border-[#26415E] text-slate-200 font-mono text-[11px]">
              {plan.vehicle.loadedWeightT} t
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0B1B32] border border-[#26415E] text-slate-200 font-mono text-[11px]">
              {plan.vehicle.heightM} m H
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0B1B32] border border-[#26415E] text-slate-200 font-mono text-[11px]">
              {plan.vehicle.axles} {language === 'hi' ? 'एक्सल' : 'Axles'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#0B1B32] border border-[#26415E] text-[#83A6CE] font-mono text-[11px] capitalize">
              {plan.vehicle.defaultCargo} {language === 'hi' ? 'माल' : 'Cargo'}
            </span>
          </div>
        </div>

        {/* Scrollable Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Selectable Route Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">
                {language === 'hi' ? 'स्वीकृत कानूनी कॉरिडोर' : 'Candidate Permitted Corridors'}
              </span>
              <span>
                {plan.routes.length} {language === 'hi' ? 'विकल्प तैयार' : 'options computed'}
              </span>
            </div>

            {plan.routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              let icon = <Zap className="w-4 h-4 text-[#83A6CE]" />;
              let badgeText = language === 'hi' ? 'सबसे तेज कानूनी' : 'Fastest Legal';
              let badgeColor = 'text-[#83A6CE]';
              if (route.category === 'safest') {
                icon = <Shield className="w-4 h-4 text-[#83A6CE]" />;
                badgeText = language === 'hi' ? 'सर्वाधिक सुरक्षित' : 'Safest Alignment';
                badgeColor = 'text-[#83A6CE]';
              } else if (route.category === 'lowest_cost') {
                icon = <TrendingDown className="w-4 h-4 text-[#C48CB3]" />;
                badgeText = language === 'hi' ? 'न्यूनतम खर्च' : 'Lowest Operating Cost';
                badgeColor = 'text-[#C48CB3]';
              }

              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#26415E] border-[#83A6CE] shadow-md ring-1 ring-[#83A6CE]/30'
                      : 'bg-[#0B1B32] border-[#26415E] hover:border-[#83A6CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {icon}
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-[#83A6CE] bg-[#0D1E4C] px-1.5 py-0.5 rounded border border-[#83A6CE]/40 font-semibold">
                        {language === 'hi' ? 'मैप पर सक्रिय' : 'ACTIVE ON MAP'}
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-[#F8FAFC] mb-1">
                    {route.title}
                  </div>
                  <div className="text-xs text-[#E5C9D7]/80 mb-3 leading-relaxed">
                    {route.subtitle}
                  </div>

                  {/* Route Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#26415E] font-mono text-xs text-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'hi' ? 'समय' : 'TIME'}
                      </span>
                      <span className="font-bold text-[#F8FAFC]">
                        {Math.floor(route.timeMin / 60)}h {route.timeMin % 60}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'hi' ? 'दूरी' : 'DISTANCE'}
                      </span>
                      <span>{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'hi' ? 'टोल' : 'TOLL'}
                      </span>
                      <span>₹{route.tollInr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {language === 'hi' ? 'डीजल' : 'EST. FUEL'}
                      </span>
                      <span>{route.fuelLiters} L</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 2. "Why this route?" Card */}
          <div className="p-3.5 rounded-lg bg-[#0B1B32] border border-[#26415E] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#83A6CE]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                {language === 'hi' ? 'यह रूट क्यों चुना गया? (निर्णय ऑडिट)' : 'Why This Route? (Decision Audit)'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {plan.whyThisRoute}
            </p>
            <div className="pt-2 border-t border-[#26415E] text-xs text-slate-300 flex items-center justify-between font-mono text-[11px]">
              <span>{language === 'hi' ? 'प्रस्थान: ' : 'Departure: '}{plan.departureTime}</span>
              <span>{language === 'hi' ? 'डेडलाइन: ' : 'Deadline: '}{plan.deadlineTime}</span>
            </div>
          </div>

          {/* 3. Rejected Routes List */}
          {plan.rejectedRoutes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-red-400">
                  {language === 'hi' ? 'अस्वीकृत मार्ग विकल्प' : 'Rejected Candidate Routes'}
                </span>
                <span>
                  {plan.rejectedRoutes.length} {language === 'hi' ? 'अवरुद्ध' : 'blocked'}
                </span>
              </div>

              {plan.rejectedRoutes.map((rej) => (
                <div
                  key={rej.id}
                  className="p-3 rounded-lg bg-[#191012] border border-red-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      {rej.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {rej.distanceKm} km
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-snug">
                      {rej.blockedReason}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1">
                    {language === 'hi' ? 'अवरोध स्थल: ' : 'Barrier Location: '}{rej.violatingLocation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Panel Action: Start Navigation Button */}
        <div className="p-4 border-t border-[#26415E] bg-[#0D1E4C]">
          <Link
            to={`/navigate/${plan.id}`}
            className="w-full min-h-[46px] py-3 px-4 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] font-bold text-xs rounded-md shadow-md shadow-[#0B1B32]/40 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#83A6CE]/50"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>{t.startNavigation}</span>
          </Link>
        </div>
      </div>

      {/* Right / Main Map View */}
      <div className="flex-1 relative h-full">
        <CorridorMap
          originCoords={[plan.origin.lat, plan.origin.lng]}
          originName={plan.origin.name}
          destCoords={[plan.destination.lat, plan.destination.lng]}
          destName={plan.destination.name}
          activeRoute={activeRoute}
          alternativeRoutes={plan.routes}
          rejectedRoutes={plan.rejectedRoutes}
          restrictions={DEMO_RESTRICTIONS}
          driverReports={getSavedReports()}
          className="w-full h-full"
        />

        {/* Floating summary tag */}
        <div className="absolute top-4 right-4 z-10 bg-[#0D1E4C]/95 backdrop-blur-md border border-[#26415E] px-3.5 py-2 rounded-md text-xs flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-[#83A6CE]"></span>
          <span className="text-[#F8FAFC] font-medium">{activeRoute?.title}</span>
          <span className="text-[#E5C9D7]/80 font-mono text-[11px]">· {activeRoute?.distanceKm} km</span>
        </div>
      </div>
    </div>
  );
};

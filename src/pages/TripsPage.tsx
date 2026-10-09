import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTripHistory } from '../services/storage';
import { TripHistoryItem } from '../types/truck';
import { Clock, Navigation, ArrowRight, RotateCcw, CheckCircle2, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [trips, setTrips] = useState<TripHistoryItem[]>([]);

  useEffect(() => {
    setTrips(getTripHistory());
  }, []);

  const handleReRun = (trip: TripHistoryItem) => {
    navigate('/plan');
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-[#0B1B32] text-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#26415E] pb-5">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {t.tripsTitle}
            </h1>
            <p className="text-xs text-[#E5C9D7]/80 mt-1">
              {t.tripsSubtitle}
            </p>
          </div>

          <Link
            to="/plan"
            className="px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] rounded-md transition-colors shadow-sm"
          >
            {t.planNewRouteBtn}
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-12 text-center text-slate-400 space-y-3">
            <Truck className="w-9 h-9 mx-auto text-[#83A6CE]/60" />
            <h3 className="font-display text-base font-bold text-[#F8FAFC]">{t.noTripsYet}</h3>
            <p className="text-xs max-w-sm mx-auto text-[#E5C9D7]/80">
              {t.noTripsDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((item) => (
              <div
                key={item.id}
                className="bg-[#0D1E4C] border border-[#26415E] hover:border-[#83A6CE]/60 rounded-lg p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-[#83A6CE] text-[11px]">{item.date}</span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-slate-300">{item.vehicleName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0B1B32] text-[10px] uppercase font-mono text-[#E5C9D7] border border-[#26415E]">
                      {item.vehicleType}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                    {item.originName} <span className="text-[#83A6CE]">➔</span> {item.destinationName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                    <span>Distance: <strong className="text-white">{item.distanceKm} km</strong></span>
                    <span>Duration: <strong className="text-white">{Math.floor(item.durationMin / 60)}h {item.durationMin % 60}m</strong></span>
                    <span>Toll & Fuel: <strong className="text-white">₹{item.costInr}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <Link
                    to={`/plan/${item.id}`}
                    className="px-3 py-1.5 text-xs font-medium bg-[#26415E] hover:bg-[#26415E]/80 border border-[#26415E] text-slate-200 rounded-md transition-colors"
                  >
                    View Plan
                  </Link>

                  <button
                    onClick={() => handleReRun(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#83A6CE] hover:bg-[#92b3d8] text-[#0B1B32] rounded-md transition-colors cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Run</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

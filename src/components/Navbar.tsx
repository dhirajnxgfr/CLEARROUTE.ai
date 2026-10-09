import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, Menu, X, Globe, User, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, openAuthModal, logout } = useAuth();

  const navLinks = [
    { label: t.navPlanRoute, path: '/plan' },
    { label: t.navVehicles, path: '/vehicles' },
    { label: t.navRestrictions, path: '/restrictions' },
    { label: t.navReports, path: '/reports' },
    { label: t.navTrips, path: '/trips' },
    { label: t.navCoverage, path: '/coverage' },
  ];

  const isActive = (path: string) => {
    if (path === '/plan' && (location.pathname === '/plan' || location.pathname.startsWith('/plan/'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="relative z-50 bg-[#0B1B32]/95 backdrop-blur-md border-b border-[#26415E] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#83A6CE]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#83A6CE]/30 to-[#C48CB3]/30 border border-[#83A6CE]/50 flex items-center justify-center text-[#83A6CE] group-hover:border-[#C48CB3] group-hover:text-[#E5C9D7] transition-colors shadow-[0_0_15px_rgba(131,166,206,0.2)]">
            <Truck className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg tracking-tight font-black text-[#F8FAFC]">
              CLEAR<span className="text-[#83A6CE]">ROUTE</span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest px-1 py-0.2 bg-[#83A6CE]/15 text-[#E5C9D7] border border-[#83A6CE]/30 rounded">
              AI
            </span>
          </div>
          <span className="hidden xl:inline-block text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#0D1E4C] border border-[#26415E] text-[#E5C9D7]/80">
            {t.brandTagline}
          </span>
        </Link>

        {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  active
                    ? 'text-[#83A6CE] font-semibold border-b-2 border-[#83A6CE]'
                    : 'text-slate-300 hover:text-[#E5C9D7]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher & Primary Action & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dual Language Switcher Pill */}
          <div className="flex items-center rounded-lg bg-[#0D1E4C] border border-[#26415E] p-0.5 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-[#83A6CE] text-[#0B1B32] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch to English"
              aria-label="Switch language to English"
            >
              <span>EN</span>
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-[#83A6CE] text-[#0B1B32] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="हिन्दी में बदलें (Switch to Hindi)"
              aria-label="Switch language to Hindi"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* User Auth Control */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-[#0D1E4C] border border-[#26415E] pl-2.5 pr-1.5 py-1 rounded-lg">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#83A6CE] to-[#C48CB3] flex items-center justify-center text-[11px] font-bold text-[#0B1B32] uppercase shadow-sm">
                {(profile?.displayName || user.displayName || user.email || 'U').charAt(0)}
              </div>
              <div className="flex flex-col text-left max-w-[110px]">
                <span className="text-xs font-semibold text-[#F8FAFC] truncate leading-tight">
                  {profile?.displayName || user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[9px] font-mono text-[#C48CB3] uppercase tracking-wider">
                  {profile?.role === 'fleet_manager'
                    ? (language === 'hi' ? 'फ्लीट प्रबंधक' : 'Fleet Mgr')
                    : (language === 'hi' ? 'चालक' : 'Driver')}
                </span>
              </div>
              <button
                onClick={logout}
                title={t.authSignOut}
                className="p-1 text-slate-400 hover:text-[#C48CB3] rounded hover:bg-[#26415E] transition-colors ml-1"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#83A6CE]/50 bg-[#26415E]/60 hover:bg-[#26415E] text-[#83A6CE] hover:text-[#E5C9D7] text-xs font-semibold transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#83A6CE]" />
              <span>{t.authSignIn}</span>
            </button>
          )}

          <Link
            to="/plan"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#0B1B32] bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] active:opacity-90 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-[#83A6CE]/50"
          >
            {t.planSafeTripBtn}
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#26415E] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-3 border-t border-[#26415E] mt-3 space-y-2 bg-[#0B1B32]">
          {/* Mobile Auth Bar */}
          <div className="px-3 py-2 bg-[#0D1E4C] rounded-xl border border-[#26415E] mx-2">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#83A6CE] to-[#C48CB3] flex items-center justify-center text-xs font-bold text-[#0B1B32] uppercase">
                    {(profile?.displayName || user.displayName || user.email || 'U').charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F8FAFC]">
                      {profile?.displayName || user.displayName || user.email}
                    </div>
                    <div className="text-[10px] font-mono text-[#C48CB3]">
                      {t.authSignedInAs}: {profile?.role === 'fleet_manager' ? t.authRoleFleetManager : t.authRoleDriver}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs text-[#E5C9D7] bg-[#26415E] border border-[#C48CB3]/40 rounded-lg font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{t.authSignOut}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] text-[#0B1B32] font-bold text-xs rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0B1B32]" />
                <span>{t.authSignIn} / {t.authSignUp}</span>
              </button>
            )}
          </div>

          {/* Mobile language switch */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-[#26415E] mb-2">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#83A6CE]" />
              {t.langCurrent}
            </span>
            <div className="flex items-center rounded-lg bg-[#0D1E4C] border border-[#26415E] p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  language === 'en' ? 'bg-[#83A6CE] text-[#0B1B32]' : 'text-slate-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  language === 'hi' ? 'bg-[#83A6CE] text-[#0B1B32]' : 'text-slate-300'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-[#0D1E4C] text-[#83A6CE] font-semibold border-l-2 border-[#83A6CE]'
                  : 'text-slate-300 hover:bg-[#26415E]/50 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 px-3">
            <Link
              to="/plan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center py-2.5 text-xs font-bold text-[#0B1B32] bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] rounded-md shadow-sm"
            >
              {t.planSafeTripBtn}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

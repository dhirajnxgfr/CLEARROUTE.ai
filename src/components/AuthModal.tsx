import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  Truck,
  Building2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInDemo,
  } = useAuth();
  const { t, language } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        setSuccess(t.authSuccessSignIn);
      } else {
        if (!name.trim()) {
          setError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name, role);
        setSuccess(t.authSuccessSignUp);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const code = err.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError(language === 'hi' ? 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।' : 'Invalid email or password. Please try again.');
      } else if (code === 'auth/email-already-in-use') {
        setError(language === 'hi' ? 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।' : 'Email is already registered. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      } else if (code === 'auth/popup-closed-by-user') {
        setError(language === 'hi' ? 'गूगल साइन इन विंडो बंद कर दी गई।' : 'Sign in popup was closed.');
      } else {
        setError(err.message || (language === 'hi' ? 'प्रमाणीकरण विफल रहा।' : 'Authentication failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess(t.authSuccessSignIn);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(language === 'hi' ? 'गूगल साइन इन विफल रहा।' : 'Google Sign In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (selectedRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await signInDemo(selectedRole);
      setSuccess(t.authSuccessSignIn);
    } catch (err: any) {
      setError(language === 'hi' ? 'डेमो लॉगिन विफल रहा।' : 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#0D1E4C] border border-[#26415E] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 text-[#F8FAFC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#26415E] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#83A6CE] to-[#C48CB3] flex items-center justify-center shadow-lg shadow-[#0B1B32]/40 text-[#0B1B32]">
            <Truck className="w-5 h-5 text-[#0B1B32]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-tight text-lg text-white">CLEARROUTE</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#26415E] text-[#E5C9D7] border border-[#83A6CE]/40 rounded">AI AUTH</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#E5C9D7]/80 mb-5 leading-relaxed">
          {t.authModalSubtitle}
        </p>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#0B1B32] rounded-xl border border-[#26415E] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-[#83A6CE] text-[#0B1B32] shadow-md shadow-[#83A6CE]/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.authSignIn}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-[#83A6CE] text-[#0B1B32] shadow-md shadow-[#83A6CE]/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.authSignUp}
          </button>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-[#E5C9D7] uppercase tracking-wider mb-1.5">
                {t.authFullName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#83A6CE] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. सुनील पाटिल' : 'e.g. Sunil Patil'}
                  className="w-full bg-[#0B1B32] border border-[#26415E] focus:border-[#83A6CE] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[#E5C9D7] uppercase tracking-wider mb-1.5">
              {t.authEmail}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#83A6CE] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@transport.in"
                className="w-full bg-[#0B1B32] border border-[#26415E] focus:border-[#83A6CE] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#E5C9D7] uppercase tracking-wider mb-1.5">
              {t.authPassword}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#83A6CE] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B1B32] border border-[#26415E] focus:border-[#83A6CE] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-[#E5C9D7] uppercase tracking-wider mb-1.5">
                {t.authRole}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    role === 'driver'
                      ? 'border-[#83A6CE] bg-[#26415E] text-white font-medium'
                      : 'border-[#26415E] bg-[#0B1B32] text-slate-300 hover:border-[#83A6CE]/50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#83A6CE] shrink-0" />
                  <span className="truncate">{t.authRoleDriver}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('fleet_manager')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                    role === 'fleet_manager'
                      ? 'border-[#C48CB3] bg-[#26415E] text-white font-medium'
                      : 'border-[#26415E] bg-[#0B1B32] text-slate-300 hover:border-[#C48CB3]/50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#C48CB3] shrink-0" />
                  <span className="truncate">{t.authRoleFleetManager}</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] text-[#0B1B32] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0B1B32]/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0B1B32]" />
                <span>{mode === 'signin' ? t.authSigningIn : t.authSigningUp}</span>
              </>
            ) : (
              <span>{mode === 'signin' ? t.authSignIn : t.authSignUp}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#26415E]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-[#0D1E4C] px-2 text-[#E5C9D7]/70">OR</span>
          </div>
        </div>

        {/* Google OAuth & Quick Demo Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-3 bg-[#0B1B32] hover:bg-[#26415E] border border-[#26415E] hover:border-[#83A6CE]/50 text-xs font-medium text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.authContinueWithGoogle}</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSignIn('driver')}
            disabled={loading}
            className="w-full py-2 px-3 bg-[#26415E]/60 hover:bg-[#26415E] border border-[#C48CB3]/50 text-xs font-semibold text-[#E5C9D7] rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C48CB3]" />
            <span>{t.authQuickDemo} (Sunil Patil · MH-46)</span>
          </button>
        </div>

        {/* Footer switch prompt */}
        <div className="mt-4 pt-3 border-t border-[#26415E] text-center text-xs text-slate-300">
          {mode === 'signin' ? (
            <p>
              {t.authDontHaveAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#83A6CE] hover:text-[#E5C9D7] hover:underline font-semibold"
              >
                {t.authSignUp}
              </button>
            </p>
          ) : (
            <p>
              {t.authAlreadyHaveAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#83A6CE] hover:text-[#E5C9D7] hover:underline font-semibold"
              >
                {t.authSignIn}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

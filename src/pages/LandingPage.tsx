import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Clock,
  Layers,
  Radio,
  SlidersHorizontal,
  Navigation,
  FileText,
  Info,
} from 'lucide-react';
import { CorridorMap } from '../components/CorridorMap';
import { CORRIDOR_NODES, DEMO_RESTRICTIONS } from '../data/corridorGraph';
import { RouteOption, RejectedRoute } from '../types/truck';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();

  // Mini preview route data for the hero card
  const sampleLegalRoute: RouteOption = {
    id: 'hero_legal',
    category: 'fastest_legal',
    title: language === 'hi' ? 'NH 48 एक्सप्रेसवे प्रमाणित कॉरिडोर' : 'NH 48 Expressway Legal Corridor',
    subtitle: language === 'hi' ? '35 टन व 4.8 मीटर क्लीयरेंस हेतु अनुमत' : 'Permitted for 35 t · 4.8 m Clearance',
    timeMin: 110,
    distanceKm: 104.8,
    tollInr: 320,
    fuelLiters: 32.5,
    fuelCostInr: 2990,
    totalCostInr: 3310,
    coordinates: [
      [18.9502, 72.9515],
      [18.9880, 73.0180],
      [19.0144, 73.0988],
      [18.9550, 73.1850],
      [18.8450, 73.2880],
      [18.7750, 73.3850],
      [18.7420, 73.4250],
      [18.7300, 73.4680],
      [18.7520, 73.5550],
      [18.7290, 73.6520],
      [18.7350, 73.6850],
      [18.7480, 73.7850],
      [18.7585, 73.8550],
    ],
    edgeIds: [],
    nodeNames: [],
    restrictionsEncountered: [],
    ghatSectionsCount: 1,
    explanation: language === 'hi' ? 'स्वीकृत 6-लेन भारी माल बायपास।' : 'Approved 6-lane freight bypass.',
  };

  const sampleRejectedRoute: RejectedRoute = {
    id: 'hero_rejected',
    name: language === 'hi' ? 'पुराना NH 48 सीधा मार्ग' : 'Old NH 48 Shortest Direct',
    distanceKm: 98.2,
    timeMin: 125,
    blockedReason: language === 'hi' ? '20 टन पुल भार सीमा (ट्रक 35 टन) व 3.8 मीटर कम रेल ऊंचाई' : '20 t Bridge Limit (Truck is 35 t) & 3.8 m Low Rail Clearance',
    violationType: 'weight',
    violatingLocation: language === 'hi' ? 'खोपोली पुराना नहर पुल और अमृतांजन अंडरपास' : 'Khopoli Old Canal Viaduct & Amrutanjan Underpass',
    coordinates: [
      [18.9502, 72.9515],
      [19.0144, 73.0988],
      [18.9180, 73.2500],
      [18.7880, 73.3450],
      [18.7610, 73.3750],
      [18.7580, 73.4020],
      [18.7540, 73.4080],
      [18.7300, 73.4680],
      [18.7350, 73.6850],
      [18.7585, 73.8550],
    ],
  };

  return (
    <div className="min-h-screen bg-[#0B1B32] text-[#F8FAFC]">
      {/* 1. Hero Section */}
      <section className="relative px-4 lg:px-8 pt-10 pb-16 border-b border-[#26415E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Subline, Action CTAs */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0D1E4C] border border-[#83A6CE]/40 text-[11px] font-mono uppercase tracking-wider text-[#E5C9D7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#83A6CE] animate-pulse"></span>
              {t.heroBadge}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.08] text-balance">
              {t.heroTitle1}{' '}
              <span className="text-[#83A6CE]">{t.heroTitleHighlight}</span>
              {t.heroTitle2 ? ` ${t.heroTitle2}` : ''}
            </h1>

            <p className="text-sm sm:text-base text-[#E5C9D7]/85 leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-[#0B1B32] bg-gradient-to-r from-[#83A6CE] to-[#C48CB3] hover:from-[#92b3d8] hover:to-[#ce98bd] rounded-lg shadow-md shadow-[#0B1B32]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#83A6CE]/50"
              >
                <span>{t.heroCtaPlan}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-200 bg-[#0D1E4C] hover:bg-[#26415E] border border-[#26415E] hover:border-[#83A6CE]/50 rounded-lg transition-colors"
              >
                {language === 'hi' ? 'कार्यप्रणाली देखें' : 'See How It Works'}
              </a>
            </div>

            {/* Telemetry row */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#26415E] text-xs text-slate-300">
              <div>
                <span className="block font-mono text-base font-bold text-[#F8FAFC]">35 t</span>
                <span>{language === 'hi' ? 'सकल भार क्षमता' : 'Default Loaded Rating'}</span>
              </div>
              <div>
                <span className="block font-mono text-base font-bold text-[#83A6CE]">100%</span>
                <span>{language === 'hi' ? 'कॉरिडोर सत्यापित' : 'Corridor Verified'}</span>
              </div>
              <div>
                <span className="block font-mono text-base font-bold text-[#C48CB3]">0</span>
                <span>{language === 'hi' ? 'पुल टकराव' : 'Bridge Collisions'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Interactive Map Card with Legal vs Blocked Demo */}
          <div className="lg:col-span-6">
            <div className="bg-[#0D1E4C] rounded-xl border border-[#26415E] p-2.5 shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#26415E] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#83A6CE]"></span>
                  <span className="font-mono text-[#F8FAFC]">
                    {language === 'hi' ? 'जेएनपीटी पोर्ट ➔ चाकण एमआईडीसी' : 'JNPT Port ➔ Chakan MIDC'}
                  </span>
                </div>
                <span className="text-[#E5C9D7] font-mono text-[11px]">
                  {language === 'hi' ? 'लाइव कॉरिडोर ग्राफ' : 'Live Corridor Graph'}
                </span>
              </div>

              <div className="h-[360px] sm:h-[400px] w-full rounded-lg overflow-hidden relative mt-2 border border-[#26415E]">
                <CorridorMap
                  originCoords={[18.9502, 72.9515]}
                  originName="JNPT Port"
                  destCoords={[18.7585, 73.8550]}
                  destName="Chakan MIDC"
                  activeRoute={sampleLegalRoute}
                  rejectedRoutes={[sampleRejectedRoute]}
                  restrictions={DEMO_RESTRICTIONS.slice(0, 3)}
                  className="w-full h-full"
                />

                {/* Floating Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-[#0D1E4C]/95 backdrop-blur-md border border-[#26415E] p-2.5 rounded-md text-xs space-y-1.5 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1 bg-[#83A6CE] rounded-sm inline-block"></span>
                    <span className="text-[#F8FAFC] font-medium text-[11px]">
                      {language === 'hi' ? 'अनुशंसित कानूनी कॉरिडोर (104.8 किमी)' : 'Recommended Legal Route (104.8 km)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-1 border-t-2 border-dashed border-[#C48CB3] inline-block"></span>
                    <span className="text-[#C48CB3] font-medium text-[11px]">
                      {language === 'hi' ? 'अस्वीकृत: 20 टन पुल भार सीमा' : 'Rejected Shortest: 20 t Bridge Limit'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 px-3 py-2 bg-[#26415E]/50 rounded-md border border-[#26415E] text-xs text-slate-200 flex items-center justify-between">
                <span>
                  {language === 'hi' ? 'लदा हुआ वजन: ' : 'Loaded Weight: '}
                  <strong className="text-white">35.0 {language === 'hi' ? 'टन' : 'tonnes'}</strong>
                  {' · '}
                  {language === 'hi' ? 'ऊंचाई: ' : 'Height: '}
                  <strong className="text-white">4.2 {language === 'hi' ? 'मी.' : 'm'}</strong>
                </span>
                <span className="text-[#83A6CE] font-mono font-bold text-[11px] bg-[#0D1E4C] border border-[#83A6CE]/40 px-2 py-0.5 rounded">
                  {language === 'hi' ? '100% स्वीकृत' : '100% Permitted'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works - 4 Numbered Steps */}
      <section id="how-it-works" className="px-4 lg:px-8 py-16 border-b border-[#26415E] bg-[#0B1B32]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#83A6CE]">{t.howSubtitle}</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1.5">
              {t.howTitle}
            </h2>
            <p className="text-[#E5C9D7]/80 text-sm mt-1.5">
              {language === 'hi'
                ? 'CLEARROUTE AI किस तरह कार-नेविगेशन की त्रुटियों को हटाकर सुरक्षित माल परिवहन सुनिश्चित करता है।'
                : 'How CLEARROUTE AI eliminates commercial freight routing hazards without reliance on consumer car maps.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 flex flex-col justify-between space-y-5 hover:border-[#83A6CE]/60 transition-colors">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center font-mono text-sm font-bold text-[#83A6CE]">
                  01
                </div>
                <h3 className="font-display text-base font-semibold text-[#F8FAFC]">{t.step1Title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.step1Desc}</p>
              </div>
              <div className="pt-3 border-t border-[#26415E] font-mono text-[11px] text-[#E5C9D7]/70">
                {language === 'hi' ? 'इनपुट · वाहन व एक्सल विनिर्देश' : 'Input · Specs & Axle Metrics'}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 flex flex-col justify-between space-y-5 hover:border-[#83A6CE]/60 transition-colors">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center font-mono text-sm font-bold text-[#83A6CE]">
                  02
                </div>
                <h3 className="font-display text-base font-semibold text-[#F8FAFC]">{t.step2Title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.step2Desc}</p>
              </div>
              <div className="pt-3 border-t border-[#26415E] font-mono text-[11px] text-[#E5C9D7]/70">
                {language === 'hi' ? 'इनपुट · मार्ग टर्मिनल व समय' : 'Input · Waypoints & Schedule'}
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 flex flex-col justify-between space-y-5 hover:border-[#C48CB3]/60 transition-colors">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#C48CB3]/40 flex items-center justify-center font-mono text-sm font-bold text-[#C48CB3]">
                  03
                </div>
                <h3 className="font-display text-base font-semibold text-[#F8FAFC]">{t.step3Title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.step3Desc}</p>
              </div>
              <div className="pt-3 border-t border-[#26415E] font-mono text-[11px] text-[#E5C9D7]/70">
                {language === 'hi' ? 'इंजन · प्रतिबंध फिल्टर' : 'Engine · Constraint Filter'}
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 flex flex-col justify-between space-y-5 hover:border-[#83A6CE]/60 transition-colors">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center font-mono text-sm font-bold text-[#83A6CE]">
                  04
                </div>
                <h3 className="font-display text-base font-semibold text-[#F8FAFC]">{t.step4Title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.step4Desc}</p>
              </div>
              <div className="pt-3 border-t border-[#26415E] font-mono text-[11px] text-[#E5C9D7]/70">
                {language === 'hi' ? 'आउटपुट · टर्न निर्देश व रडार' : 'Output · Turn & Proximity Radar'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Six-Item Feature Grid */}
      <section className="px-4 lg:px-8 py-16 border-b border-[#26415E]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#83A6CE]">
              {language === 'hi' ? 'इंजन विशेषताएं' : 'Engine Capabilities'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-1.5">
              {t.featuresTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#83A6CE]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center text-[#83A6CE]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'पारदर्शी व्याख्या (Explainable)' : 'Explainable Routing'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t.feature1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#83A6CE]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center text-[#83A6CE]">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'वाहन विनिर्देश प्रोफाइल' : 'Vehicle Profiles'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t.feature2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#C48CB3]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#C48CB3]/40 flex items-center justify-center text-[#C48CB3]">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'सक्रिय री-रूटिंग' : 'Dynamic Rerouting'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t.feature4Desc}</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#C48CB3]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#C48CB3]/40 flex items-center justify-center text-[#C48CB3]">
                <Navigation className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'कैब अलर्ट और चेतावनी' : 'Driver Cab Alerts'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'कम ऊंचाई वाले रेलवे अंडरपास और हेयरपिन मोड़ों से पहले कॉकपिट डिस्प्ले पर अग्रिम चेतावनी।'
                  : 'High-contrast tablet cockpit view with advance proximity radar for approaching low railway gantries and hairpin ghats.'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#83A6CE]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center text-[#83A6CE]">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'सुरक्षित / तीव्र / किफायती विकल्प' : 'Safe / Fast / Cheap Options'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'लदे हुए वजन के आधार पर फास्टैग टोल खर्च और डीजल खपत की सटीक गणना एवं तुलना।'
                  : 'Multi-objective comparison calculating FASTag toll expenditure and diesel consumption curves based on loaded tonnage.'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#0D1E4C] border border-[#26415E] rounded-xl p-5 space-y-2.5 hover:border-[#83A6CE]/40 transition-colors">
              <div className="w-8 h-8 rounded-md bg-[#26415E] border border-[#83A6CE]/30 flex items-center justify-center text-[#83A6CE]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                {language === 'hi' ? 'मार्ग प्रतिबंध अन्वेषक' : 'Restriction Explorer'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Prototype Scope Banner */}
      <section className="px-4 lg:px-8 py-8 bg-[#0B1B32] border-b border-[#26415E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 rounded-xl bg-[#0D1E4C] border border-[#26415E]">
          <div className="flex items-start gap-3 max-w-3xl">
            <Info className="w-4 h-4 text-[#83A6CE] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                {language === 'hi' ? 'प्रोटोटाइप परीक्षण दायरा' : 'Demonstration Scope'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'मुंबई (जेएनपीटी) से पुणे (चाकण एमआईडीसी) औद्योगिक हाईवे नेटवर्क पर 4 वाणिज्यिक वाहन प्रकारों और बुनियादी ढांचा प्रतिबंधों का मॉडल। यह एल्गोरिदम परीक्षण हेतु प्रोटोटाइप है।'
                  : 'Models 4 commercial vehicle types and 4 infrastructure restriction types across the Mumbai (JNPT) to Pune (Chakan MIDC) industrial highway network. Built to demonstrate constraint-driven routing logic; does not claim full nation-wide road data.'}
              </p>
            </div>
          </div>
          <Link
            to="/coverage"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#26415E] hover:bg-[#26415E]/80 border border-[#83A6CE]/30 rounded-md whitespace-nowrap shrink-0 transition-colors"
          >
            {language === 'hi' ? 'कवरेज विवरण देखें' : 'View Scope Details'}
          </Link>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="px-4 lg:px-8 py-6 border-t border-[#26415E] bg-[#0B1B32] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#F8FAFC]">CLEARROUTE AI</span>
            <span>·</span>
            <span className="text-[#E5C9D7]/80">{t.footerTagline}</span>
          </div>
          <div className="font-mono text-center sm:text-right text-[11px] text-[#83A6CE]">
            India NextGen TechFusion 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

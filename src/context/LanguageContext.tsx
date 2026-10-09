import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Common / Navbar
  brandName: string;
  brandTagline: string;
  navPlanRoute: string;
  navVehicles: string;
  navRestrictions: string;
  navReports: string;
  navTrips: string;
  navCoverage: string;
  planSafeTripBtn: string;
  langSwitchEn: string;
  langSwitchHi: string;
  langCurrent: string;

  // Landing Page
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaPlan: string;
  heroCtaVehicles: string;
  heroCardTitle: string;
  heroCardOrigin: string;
  heroCardDest: string;
  heroCardVehicleType: string;
  heroCardTonnage: string;
  heroCardHeight: string;
  heroCardStatus: string;
  heroCardCorridor: string;
  heroCardSaved: string;
  statClearance: string;
  statClearanceDesc: string;
  statBridges: string;
  statBridgesDesc: string;
  statCorridors: string;
  statCorridorsDesc: string;
  statCompliance: string;
  statComplianceDesc: string;

  // Features section
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;

  // How it works
  howTitle: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Test Corridor & Footer
  corridorTitle: string;
  corridorSubtitle: string;
  corridorNote: string;
  footerRights: string;
  footerTagline: string;

  // Plan Page
  planHeaderTitle: string;
  planHeaderDesc: string;
  activeVehiclePreset: string;
  customizeVehicle: string;
  routeEndpoints: string;
  originHub: string;
  destHub: string;
  departureTime: string;
  deadlineTime: string;
  vehicleDimensions: string;
  grossWeight: string;
  heightClearance: string;
  width: string;
  length: string;
  axleCount: string;
  cargoType: string;
  calculateRoutesBtn: string;
  calculatingBtn: string;
  originPlaceholder: string;
  destPlaceholder: string;
  activeHazardsOnCorridor: string;
  mapPreviewTitle: string;

  // Plan Results Page
  resultsTitle: string;
  resultsSubtitle: string;
  backToPlanner: string;
  startNavigation: string;
  certifiedCorridor: string;
  rejectedRoutes: string;
  routeDistance: string;
  estDuration: string;
  dieselEst: string;
  tollEst: string;
  rejectionReason: string;
  legalComplianceCheck: string;
  bridgeAuditPassed: string;
  heightAuditPassed: string;
  axleAuditPassed: string;
  curfewAuditPassed: string;

  // Navigation Page
  navActiveTrip: string;
  speed: string;
  distanceRemaining: string;
  eta: string;
  nextManeuver: string;
  voiceAlertsOn: string;
  voiceAlertsOff: string;
  reportHazardBtn: string;
  rerouteBtn: string;
  clearRoadwayAhead: string;
  activeRestrictionsNotice: string;

  // Vehicles Page
  fleetTitle: string;
  fleetSubtitle: string;
  addVehicle: string;
  presetHeavyHauler: string;
  presetContainer: string;
  presetTanker: string;
  presetMultiAxle: string;
  vehicleName: string;
  regNumber: string;
  saveVehicleBtn: string;
  deleteVehicleBtn: string;
  setActiveForRouting: string;
  activeVehicleBadge: string;
  savedSuccessfully: string;

  // Restrictions Page
  restrictionsTitle: string;
  restrictionsSubtitle: string;
  filterAll: string;
  filterWeight: string;
  filterHeight: string;
  filterTime: string;
  maxWeightLimit: string;
  overheadClearance: string;
  curfewHours: string;
  penaltyWarning: string;

  // Driver Reports Page
  driverReportsTitle: string;
  driverReportsSubtitle: string;
  reportNewIssue: string;
  incidentType: string;
  incidentTitle: string;
  locationDetails: string;
  incidentNotes: string;
  driverName: string;
  submitReportBtn: string;
  activeHazardsList: string;
  verifiedByDrivers: string;
  toggleHazard: string;

  // Trips Page
  tripsTitle: string;
  tripsSubtitle: string;
  planNewRouteBtn: string;
  noTripsYet: string;
  noTripsDesc: string;
  rePlanBtn: string;
  complianceCertified: string;

  // Coverage Page
  coverageTitle: string;
  coverageSubtitle: string;
  disclaimerTitle: string;
  disclaimerText: string;
  corridorScopeTitle: string;
  corridorScopeText: string;

  // Auth
  authSignIn: string;
  authSignUp: string;
  authSignOut: string;
  authEmail: string;
  authPassword: string;
  authFullName: string;
  authRole: string;
  authRoleDriver: string;
  authRoleFleetManager: string;
  authRoleLogistics: string;
  authContinueWithGoogle: string;
  authQuickDemo: string;
  authDontHaveAccount: string;
  authAlreadyHaveAccount: string;
  authWelcomeBack: string;
  authCreateAccount: string;
  authModalSubtitle: string;
  authSuccessSignIn: string;
  authSuccessSignUp: string;
  authSigningIn: string;
  authSigningUp: string;
  authGuestUser: string;
  authSignedInAs: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'CLEARROUTE',
    brandTagline: 'CORRIDOR ENGINE',
    navPlanRoute: 'Plan Route',
    navVehicles: 'Vehicles',
    navRestrictions: 'Restrictions',
    navReports: 'Driver Reports',
    navTrips: 'Trips',
    navCoverage: 'Coverage',
    planSafeTripBtn: 'Plan Safe Trip',
    langSwitchEn: 'English',
    langSwitchHi: 'हिन्दी',
    langCurrent: 'Language',

    heroBadge: 'INDIA NEXTGEN TECHFUSION 2026 · LOGISTICS ENGINE',
    heroTitle1: 'Heavy-Vehicle Smart Routing for',
    heroTitleHighlight: 'Indian Freight Corridors',
    heroTitle2: '',
    heroSubtitle: 'Never get stuck under low railway bridges, collapse weak rural spans, or enter municipal no-entry curfews. Algorithmic multi-constraint navigation built specifically for India’s 16T to 55T multi-axle commercial fleet.',
    heroCtaPlan: 'Plan Certified Route',
    heroCtaVehicles: 'Configure Fleet Specs',
    heroCardTitle: 'Live Corridor Audit',
    heroCardOrigin: 'JNPT Port Container Hub',
    heroCardDest: 'Chakan Auto Cluster (Pune)',
    heroCardVehicleType: '40ft Semi-Trailer (5-Axle)',
    heroCardTonnage: '38.5 T Loaded',
    heroCardHeight: '4.20 m Clearance',
    heroCardStatus: 'CERTIFIED COMPLIANT',
    heroCardCorridor: 'NH 48 Expressway Corridor (142 km)',
    heroCardSaved: 'Saved 2.4 hrs vs Old Ghat Toll Ban',
    statClearance: '4.8 m',
    statClearanceDesc: 'Min tunnel & flyover clearance guarantee on primary freight path',
    statBridges: '100% Audited',
    statBridgesDesc: 'MoRTH axle-load rating checks for all ghat viaducts and culverts',
    statCorridors: 'Mumbai-Pune',
    statCorridorsDesc: 'JNPT Maritime Hub to Chakan Auto Hub verified high-tonnage track',
    statCompliance: 'Zero Penalties',
    statComplianceDesc: 'Dynamic avoidance of municipal entry time-bans in PCMC & Navi Mumbai',

    featuresTitle: 'Built for High-Tonnage Freight Realities',
    featuresSubtitle: 'Standard consumer maps route 40-tonne container trailers through passenger car shortcuts with 3.2m railway underpasses and weak village culverts. CLEARROUTE AI prevents costly re-routings and catastrophic bridge damage.',
    feature1Title: 'Overhead Clearance Auditing',
    feature1Desc: 'Strict mathematical filtering against overhead railway cantilevers, low pedestrian skywalks, and tunnel portals across NH 48 and SH 104.',
    feature2Title: 'Axle-Load Bridge Ratings',
    feature2Desc: 'Validates IRC Class 70R and Class AA loading limits on Western Ghat viaducts before dispatching multi-axle tractor trailers.',
    feature3Title: 'Municipal Curfew Engine',
    feature3Desc: 'Automated temporal scheduling around Navi Mumbai and Pune Municipal Corporation peak-hour commercial vehicle ban windows.',
    feature4Title: 'Crowdsourced Driver Hazards',
    feature4Desc: 'Real-time hazard reports from fellow truck drivers for low hanging high-tension cables, emergency landslides, and bridge diversions.',

    howTitle: 'Four steps from dispatch to compliant destination',
    howSubtitle: 'Corridor Routing Pipeline',
    step1Title: 'Vehicle Envelope Input',
    step1Desc: 'Enter gross vehicle weight (GVW), axle layout, laden height, width, and dangerous cargo classification.',
    step2Title: 'Constraint Graph Search',
    step2Desc: 'Routing engine prunes blocked nodes and computes shortest viable corridor respecting every physical limit.',
    step3Title: 'Clearance & Toll Audit',
    step3Desc: 'Inspect rejected shortcuts with clear explanations: why the old road was blocked, saving you legal fines.',
    step4Title: 'Turn-by-Turn Truck Navigation',
    step4Desc: 'Execute navigation with audible audio advisories before critical ghat descents and overhead limits.',

    corridorTitle: 'Active Benchmark Freight Corridor',
    corridorSubtitle: 'JNPT Port to Chakan MIDC Automotive Belt (142 km)',
    corridorNote: 'Demo benchmark featuring Bhor Ghat, Khandala tunnels, and Talegaon bypass.',
    footerRights: 'CLEARROUTE AI · India NextGen TechFusion 2026. Built for heavy commercial transport safety.',
    footerTagline: 'Engineering prototype for compliant heavy commercial vehicle movement.',

    planHeaderTitle: 'Plan Heavy Vehicle Route',
    planHeaderDesc: 'Define truck specs, weight, overhead clearances, and origin/destination to calculate certified legal corridors.',
    activeVehiclePreset: 'Quick Select Fleet Vehicle',
    customizeVehicle: 'Vehicle & Load Parameters',
    routeEndpoints: 'Route Hubs & Departure Schedule',
    originHub: 'Origin Freight Terminal',
    destHub: 'Destination Hub',
    departureTime: 'Planned Departure Time',
    deadlineTime: 'Delivery Deadline',
    vehicleDimensions: 'Vehicle Envelope & Specs',
    grossWeight: 'Gross Vehicle Weight (Tonnes)',
    heightClearance: 'Total Height Clearance (Meters)',
    width: 'Vehicle Width (Meters)',
    length: 'Vehicle Length (Meters)',
    axleCount: 'Axles Count',
    cargoType: 'Cargo Classification',
    calculateRoutesBtn: 'Compute Certified Corridor',
    calculatingBtn: 'Auditing Corridor Constraints...',
    originPlaceholder: 'Select origin hub...',
    destPlaceholder: 'Select destination hub...',
    activeHazardsOnCorridor: 'Active Hazards on Corridor',
    mapPreviewTitle: 'Interactive Corridor Overview',

    resultsTitle: 'Corridor Evaluation Results',
    resultsSubtitle: 'Multi-criteria corridor analysis for heavy freight compliance.',
    backToPlanner: 'Back to Planner',
    startNavigation: 'Start Turn-by-Turn Navigation',
    certifiedCorridor: 'CERTIFIED RECOMMENDED CORRIDOR',
    rejectedRoutes: 'REJECTED ALTERNATIVES (BLOCKED / NON-COMPLIANT)',
    routeDistance: 'Total Distance',
    estDuration: 'Estimated Travel Time',
    dieselEst: 'Est. Diesel Consumption',
    tollEst: 'Est. FASTag Toll',
    rejectionReason: 'Violating Constraint',
    legalComplianceCheck: 'Regulatory & Physical Compliance Audit',
    bridgeAuditPassed: 'Bridge Axle-Load Rating: PASSED',
    heightAuditPassed: 'Overhead Clearance: PASSED',
    axleAuditPassed: 'Axle Loading Classification: PASSED',
    curfewAuditPassed: 'Municipal Time Bans: NO CONFLICT',

    navActiveTrip: 'ACTIVE TRUCK NAVIGATION',
    speed: 'Current Speed',
    distanceRemaining: 'Distance Left',
    eta: 'Est. Arrival (ETA)',
    nextManeuver: 'Next Maneuver',
    voiceAlertsOn: 'Voice Guidance ON',
    voiceAlertsOff: 'Voice Guidance MUTED',
    reportHazardBtn: 'Report Live Hazard',
    rerouteBtn: 'Recalculate Route',
    clearRoadwayAhead: 'Roadway clear: Next overhead check in 14.2 km',
    activeRestrictionsNotice: 'Heavy Freight Lane Discipline Active',

    fleetTitle: 'Commercial Fleet Manager',
    fleetSubtitle: 'Manage commercial trucks, tractors, container units, and axle ratings for instantaneous dispatch.',
    addVehicle: 'Add New Freight Unit',
    presetHeavyHauler: '55-Tonne Multi-Axle Puller',
    presetContainer: '40ft Semi-Trailer (5-Axle)',
    presetTanker: '3-Axle Petroleum Tanker',
    presetMultiAxle: '4-Axle Rigid Tipper (31T)',
    vehicleName: 'Vehicle Nickname / ID',
    regNumber: 'Registration Plate (e.g. MH-12-AB-1234)',
    saveVehicleBtn: 'Save Vehicle Profile',
    deleteVehicleBtn: 'Delete Profile',
    setActiveForRouting: 'Set as Active Truck',
    activeVehicleBadge: 'ACTIVE FOR DISPATCH',
    savedSuccessfully: 'Vehicle profile updated successfully!',

    restrictionsTitle: 'Corridor Restriction Explorer',
    restrictionsSubtitle: 'Audited physical overhead barriers, bridge tonnage ratings, and municipal commercial curfew schedules.',
    filterAll: 'All Limits',
    filterWeight: 'Bridge Weight',
    filterHeight: 'Low Clearance',
    filterTime: 'Curfew Bans',
    maxWeightLimit: 'Max Gross Tonnes Limit',
    overheadClearance: 'Max Vertical Clearance',
    curfewHours: 'Prohibited Hours Window',
    penaltyWarning: 'Traffic Police Penalties Apply Under Motor Vehicles Act',

    driverReportsTitle: 'Driver Incident & Hazard Network',
    driverReportsSubtitle: 'Live crowdsourced hazard alerts filed by heavy vehicle operators on active corridors.',
    reportNewIssue: 'File Live Hazard Advisory',
    incidentType: 'Hazard Category',
    incidentTitle: 'Incident Headline',
    locationDetails: 'Corridor Landmark / Mile Marker',
    incidentNotes: 'Driver Remarks / Detour Guidance',
    driverName: 'Reported By (Driver ID / Vehicle)',
    submitReportBtn: 'Broadcast Live Hazard',
    activeHazardsList: 'Verified Corridor Reports',
    verifiedByDrivers: 'Verified by Logistics Community',
    toggleHazard: 'Toggle Active Status',

    tripsTitle: 'Commercial Trip Archive',
    tripsSubtitle: 'Audit logs of previously evaluated and executed freight trips.',
    planNewRouteBtn: 'Plan New Corridor',
    noTripsYet: 'No Saved Trips Yet',
    noTripsDesc: 'Evaluate your first heavy freight route from the planner to archive verified corridors.',
    rePlanBtn: 'Re-Plan Corridor',
    complianceCertified: 'CLEARROUTE AUDIT PASSED',

    coverageTitle: 'Coverage Boundaries & Prototype Limitations',
    coverageSubtitle: 'Hackathon Scope & Physical Specification for India NextGen TechFusion 2026',
    disclaimerTitle: 'Important Operational Disclaimer',
    disclaimerText: 'CLEARROUTE AI is an algorithmic engineering prototype demonstrating constraint-based heavy freight graph routing and explainable decision audits. Real-world nation-wide highway coverage is not claimed. Commercial dispatchers must continue to cross-verify oversized cargo with Ministry of Road Transport and Highways (MoRTH) and state PWD gazettes.',
    corridorScopeTitle: 'Geographic Corridor Modeled',
    corridorScopeText: 'The offline road network model simulates the industrial corridor connecting the maritime container port at JNPT / Navi Mumbai across the Sahyadri Western Ghats to the automobile manufacturing belt at Chakan MIDC / Pune.',

    // Auth
    authSignIn: 'Sign In',
    authSignUp: 'Create Account',
    authSignOut: 'Sign Out',
    authEmail: 'Email Address',
    authPassword: 'Password',
    authFullName: 'Full Name',
    authRole: 'Operational Role',
    authRoleDriver: 'Commercial Heavy Driver',
    authRoleFleetManager: 'Fleet & Dispatch Manager',
    authRoleLogistics: 'Logistics Safety Auditor',
    authContinueWithGoogle: 'Continue with Google',
    authQuickDemo: 'Try Demo Driver Login',
    authDontHaveAccount: "Don't have an account?",
    authAlreadyHaveAccount: 'Already registered?',
    authWelcomeBack: 'Welcome Back to ClearRoute',
    authCreateAccount: 'Join ClearRoute Network',
    authModalSubtitle: 'Access personalized corridor clearances, fleet telematics, and saved vehicle specs',
    authSuccessSignIn: 'Signed in successfully',
    authSuccessSignUp: 'Account created successfully',
    authSigningIn: 'Verifying credentials...',
    authSigningUp: 'Creating profile...',
    authGuestUser: 'Guest Driver',
    authSignedInAs: 'Signed in as',
  },

  hi: {
    brandName: 'CLEARROUTE',
    brandTagline: 'कॉरिडोर इंजन',
    navPlanRoute: 'रूट प्लान करें',
    navVehicles: 'वाहन (ट्रक)',
    navRestrictions: 'मार्ग प्रतिबंध',
    navReports: 'चालक रिपोर्ट',
    navTrips: 'यात्राएं',
    navCoverage: 'कवरेज क्षेत्र',
    planSafeTripBtn: 'सुरक्षित रूट बनाएं',
    langSwitchEn: 'English',
    langSwitchHi: 'हिन्दी',
    langCurrent: 'भाषा (Language)',

    heroBadge: 'इण्डिया नेक्स्टजेन टेकफ्यूजन 2026 · लॉजिस्टिक्स इंजन',
    heroTitle1: 'भारी वाहनों के लिए स्मार्ट नेविगेशन',
    heroTitleHighlight: 'भारतीय मालवाहक कॉरिडोर',
    heroTitle2: 'के लिए',
    heroSubtitle: 'कम ऊंचाई वाले रेलवे पुलों के नीचे फंसने, कमजोर ग्रामीण पुलों के टूटने या नगर पालिका के नो-एंट्री कर्फ्यू में चालान से बचें। भारत के 16T से 55T मल्टी-एक्सल भारी वाहनों के लिए विशेष रूप से निर्मित स्मार्ट रूटिंग इंजन।',
    heroCtaPlan: 'प्रमाणित रूट प्लान करें',
    heroCtaVehicles: 'वाहन क्षमता सेट करें',
    heroCardTitle: 'लाइव कॉरिडोर ऑडिट',
    heroCardOrigin: 'जेएनपीटी पोर्ट कंटेनर हब',
    heroCardDest: 'चाकण ऑटो क्लस्टर (पुणे)',
    heroCardVehicleType: '40 फीट सेमी-ट्रेलर (5-एक्सल)',
    heroCardTonnage: '38.5 टन लदा हुआ',
    heroCardHeight: '4.20 मीटर ऊंचाई',
    heroCardStatus: 'प्रमाणित एवं सुरक्षित',
    heroCardCorridor: 'NH 48 एक्सप्रेसवे कॉरिडोर (142 किमी)',
    heroCardSaved: 'पुराने घाट टोल प्रतिबंध से 2.4 घंटे की बचत',
    statClearance: '4.8 मी.',
    statClearanceDesc: 'प्रमुख मालवाहक मार्ग पर न्यूनतम सुरंग व फ्लाईओवर ऊंचाई गारंटी',
    statBridges: '100% जांची गई',
    statBridgesDesc: 'घाट पुलों और पुलियों के लिए MoRTH एक्सल-लोड क्षमता की पूर्ण जांच',
    statCorridors: 'मुंबई-पुणे',
    statCorridorsDesc: 'जेएनपीटी बंदरगाह से चाकण ऑटो हब तक सत्यापित भारी माल मार्ग',
    statCompliance: 'शून्य जुर्माना',
    statComplianceDesc: 'पीसीएमसी और नवी मुंबई में नगर निगम प्रवेश नो-एंट्री समय से पूर्ण बचाव',

    featuresTitle: 'भारी मालवाहक वाहनों की वास्तविकताओं के लिए निर्मित',
    featuresSubtitle: 'सामान्य उपभोक्ता मैप्स 40-टन के कंटेनर ट्रेलरों को कारों वाले शॉर्टकट से भेज देते हैं, जहां 3.2 मीटर के रेलवे अंडरपास और कमजोर पुल होते हैं। CLEARROUTE AI भारी जुर्माने और दुर्घटनाओं से बचाता है।',
    feature1Title: 'ऊंचाई व क्लीयरेंस जांच',
    feature1Desc: 'NH 48 और SH 104 पर रेलवे कैंटिलीवर, पैदल पुलों और सुरंगों के विरुद्ध सटीक ऊंचाई सत्यापन।',
    feature2Title: 'पुल एक्सल-लोड भार क्षमता',
    feature2Desc: 'मल्टी-एक्सल ट्रेलरों को भेजने से पहले पश्चिमी घाट के पुलों पर IRC क्लास 70R और क्लास AA भार सीमाओं का सत्यापन।',
    feature3Title: 'नगर निगम नो-एंट्री कर्फ्यू इंजन',
    feature3Desc: 'नवी मुंबई और पुणे नगर निगम के पीक-ऑवर भारी वाहन प्रतिबंध समय के अनुसार स्वचालित शेड्यूलिंग।',
    feature4Title: 'ट्रक चालकों द्वारा लाइव अलर्ट',
    feature4Desc: 'लटके हुए हाई-टेंशन तार, भूस्खलन, और आपातकालीन डायवर्जन के लिए साथी ट्रक चालकों द्वारा रियल-टाइम सूचनाएं।',

    howTitle: 'लोडिंग से गंतव्य तक 4 सरल चरण',
    howSubtitle: 'कॉरिडोर रूटिंग प्रक्रिया',
    step1Title: 'वाहन विनिर्देश दर्ज करें',
    step1Desc: 'सकल वाहन भार (GVW), एक्सल संख्या, कुल ऊंचाई, चौड़ाई और माल का प्रकार दर्ज करें।',
    step2Title: 'प्रतिबंध ग्राफ विश्लेषण',
    step2Desc: 'रूटिंग इंजन अवरुद्ध सड़कों को हटाकर हर सीमा का पालन करने वाला सबसे छोटा सुरक्षित कॉरिडोर चुनता है।',
    step3Title: 'क्लीयरेंस व टोल ऑडिट',
    step3Desc: 'अस्वीकृत रास्तों का स्पष्ट कारण देखें: पुराना रास्ता क्यों बंद था, ताकि चालान और देरी से बचा जा सके।',
    step4Title: 'टर्न-बाय-टर्न ट्रक नेविगेशन',
    step4Desc: 'खतरनाक घाट ढलानों और ऊंचाई सीमाओं से पहले स्पष्ट ऑडियो दिशा-निर्देशों के साथ सुरक्षित यात्रा करें।',

    corridorTitle: 'सक्रिय बेंचमार्क फ्रेट कॉरिडोर',
    corridorSubtitle: 'जेएनपीटी पोर्ट से चाकण एमआईडीसी ऑटोमोटिव बेल्ट (142 किमी)',
    corridorNote: 'भोर घाट, खंडाला सुरंगें और तालेगांव बाईपास युक्त प्रदर्शन कॉरिडोर।',
    footerRights: 'CLEARROUTE AI · इण्डिया नेक्स्टजेन टेकफ्यूजन 2026. भारी वाणिज्यिक परिवहन सुरक्षा हेतु समर्पित।',
    footerTagline: 'भारी वाणिज्यिक वाहनों के सुरक्षित आवागमन हेतु तकनीकी प्रोटोटाइप।',

    planHeaderTitle: 'भारी वाहन रूट प्लान करें',
    planHeaderDesc: 'कानूनी और सुरक्षित कॉरिडोर खोजने के लिए ट्रक का आकार, वजन, ऊंचाई और स्रोत/गंतव्य चुनें।',
    activeVehiclePreset: 'फ्लीट से वाहन चुनें',
    customizeVehicle: 'वाहन और माल विवरण',
    routeEndpoints: 'रूट टर्मिनल और प्रस्थान समय',
    originHub: 'प्रस्थान माल टर्मिनल (Origin)',
    destHub: 'गंतव्य हब (Destination)',
    departureTime: 'नियोजित प्रस्थान समय',
    deadlineTime: 'डिलीवरी अंतिम समय',
    vehicleDimensions: 'वाहन आयाम और विनिर्देश',
    grossWeight: 'सकल भार (टन में)',
    heightClearance: 'कुल ऊंचाई क्लीयरेंस (मीटर में)',
    width: 'वाहन की चौड़ाई (मीटर में)',
    length: 'वाहन की लंबाई (मीटर में)',
    axleCount: 'एक्सल संख्या',
    cargoType: 'माल का प्रकार (Cargo)',
    calculateRoutesBtn: 'प्रमाणित कॉरिडोर खोजें',
    calculatingBtn: 'कॉरिडोर प्रतिबंधों की जांच जारी...',
    originPlaceholder: 'प्रस्थान हब चुनें...',
    destPlaceholder: 'गंतव्य हब चुनें...',
    activeHazardsOnCorridor: 'मार्ग पर सक्रिय खतरे एवं अवरोध',
    mapPreviewTitle: 'इंटरैक्टिव कॉरिडोर पूर्वावलोकन',

    resultsTitle: 'कॉरिडोर मूल्यांकन परिणाम',
    resultsSubtitle: 'भारी मालवाहक अनुपालन के लिए बहु-मानदंडीय कॉरिडोर विश्लेषण।',
    backToPlanner: 'प्लानर पर वापस जाएं',
    startNavigation: 'टर्न-बाय-टर्न नेविगेशन शुरू करें',
    certifiedCorridor: 'प्रमाणित अनुशंसित कॉरिडोर (स्वीकृत)',
    rejectedRoutes: 'अस्वीकृत विकल्प (अवरुद्ध / गैर-अनुपालन)',
    routeDistance: 'कुल दूरी',
    estDuration: 'अनुमानित समय',
    dieselEst: 'अनुमानित डीजल खपत',
    tollEst: 'अनुमानित फास्टैग टोल',
    rejectionReason: 'अवरोध का कारण',
    legalComplianceCheck: 'नियामक एवं भौतिक अनुपालन ऑडिट',
    bridgeAuditPassed: 'पुल भार क्षमता: स्वीकृत (PASSED)',
    heightAuditPassed: 'ऊंचाई क्लीयरेंस: स्वीकृत (PASSED)',
    axleAuditPassed: 'एक्सल लोड वर्गीकरण: स्वीकृत (PASSED)',
    curfewAuditPassed: 'नगर निगम नो-एंट्री समय: कोई टकराव नहीं',

    navActiveTrip: 'सक्रिय ट्रक नेविगेशन',
    speed: 'वर्तमान गति',
    distanceRemaining: 'शेष दूरी',
    eta: 'अनुमानित आगमन (ETA)',
    nextManeuver: 'अगला मोड़',
    voiceAlertsOn: 'ध्वनि निर्देश चालू',
    voiceAlertsOff: 'ध्वनि निर्देश बंद (मूक)',
    reportHazardBtn: 'खतरे की रिपोर्ट करें',
    rerouteBtn: 'रूट पुनः खोजें',
    clearRoadwayAhead: 'मार्ग सुरक्षित: अगला ऊंचाई निरीक्षण 14.2 किमी में',
    activeRestrictionsNotice: 'भारी मालवाहक लेन अनुशासन लागू',

    fleetTitle: 'वाहन (फ्लीट) प्रबंधन',
    fleetSubtitle: 'त्वरित रूटिंग के लिए ट्रकों, ट्रेलरों और एक्सल रेटिंग का विवरण प्रबंधित करें।',
    addVehicle: 'नया मालवाहक वाहन जोड़ें',
    presetHeavyHauler: '55-टन मल्टी-एक्सल पुलर',
    presetContainer: '40 फीट सेमी-ट्रेलर (5-एक्सल)',
    presetTanker: '3-एक्सल पेट्रोलियम टैंकर',
    presetMultiAxle: '4-एक्सल टिपर (31 टन)',
    vehicleName: 'वाहन का नाम / उपनाम',
    regNumber: 'पंजीकरण नंबर (जैसे MH-12-AB-1234)',
    saveVehicleBtn: 'वाहन प्रोफाइल सुरक्षित करें',
    deleteVehicleBtn: 'प्रोफाइल हटाएं',
    setActiveForRouting: 'रूटिंग के लिए सक्रिय करें',
    activeVehicleBadge: 'सक्रिय वाहन',
    savedSuccessfully: 'वाहन प्रोफाइल सफलतापूर्वक सुरक्षित कर दी गई!',

    restrictionsTitle: 'कॉरिडोर प्रतिबंध अन्वेषक',
    restrictionsSubtitle: 'भौतिक ऊंचाई अवरोधक, पुलों की टन क्षमता और नगर निगम नो-एंट्री कर्फ्यू समय।',
    filterAll: 'सभी प्रतिबंध',
    filterWeight: 'पुल भार सीमा',
    filterHeight: 'ऊंचाई क्लीयरेंस',
    filterTime: 'नो-एंट्री कर्फ्यू',
    maxWeightLimit: 'अधिकतम भार सीमा',
    overheadClearance: 'अधिकतम ऊंचाई सीमा',
    curfewHours: 'प्रतिबंधित समय अवधि',
    penaltyWarning: 'मोटर वाहन अधिनियम के तहत जुर्माना लागू हो सकता है',

    driverReportsTitle: 'चालक दुर्घटना एवं खतरा नेटवर्क',
    driverReportsSubtitle: 'सक्रिय कॉरिडोर पर भारी वाहन चालकों द्वारा दी गई लाइव सूचनाएं।',
    reportNewIssue: 'नई घटना / खतरे की रिपोर्ट करें',
    incidentType: 'खतरे की श्रेणी',
    incidentTitle: 'घटना का शीर्षक',
    locationDetails: 'स्थान / मील का पत्थर',
    incidentNotes: 'चालक की टिप्पणी / वैकल्पिक रास्ता',
    driverName: 'रिपोर्टकर्ता (चालक नाम / वाहन संख्या)',
    submitReportBtn: 'लाइव अलर्ट प्रसारित करें',
    activeHazardsList: 'सत्यापित कॉरिडोर रिपोर्ट',
    verifiedByDrivers: 'लॉजिस्टिक्स समुदाय द्वारा सत्यापित',
    toggleHazard: 'सक्रिय / निष्क्रिय स्थिति बदलें',

    tripsTitle: 'वाणिज्यिक यात्रा अभिलेखागार',
    tripsSubtitle: 'पूर्व में मूल्यांकित और संचालित मालवाहक यात्राओं का विवरण।',
    planNewRouteBtn: 'नया कॉरिडोर बनाएं',
    noTripsYet: 'अभी तक कोई यात्रा नहीं',
    noTripsDesc: 'प्रमाणित कॉरिडोर को सहेजने के लिए प्लानर से अपना पहला रूट जांचें।',
    rePlanBtn: 'पुनः प्लान करें',
    complianceCertified: 'CLEARROUTE ऑडिट स्वीकृत',

    coverageTitle: 'कवरेज क्षेत्र एवं प्रोटोटाइप सीमाएं',
    coverageSubtitle: 'इण्डिया नेक्स्टजेन टेकफ्यूजन 2026 हेतु वास्तुकला विनिर्देश',
    disclaimerTitle: 'महत्वपूर्ण परिचालन अस्वीकरण',
    disclaimerText: 'CLEARROUTE AI एक एल्गोरिथम इंजीनियरिंग प्रोटोटाइप है जो बाधा-आधारित भारी मालवाहक नेविगेशन और पारदर्शी निर्णय प्रदर्शित करता है। देशव्यापी पूर्ण कवरेज का दावा नहीं किया गया है। भारी माल प्रेषकों को सड़क परिवहन और राजमार्ग मंत्रालय (MoRTH) और पीडब्ल्यूडी राजपत्रों से अतिरिक्त सत्यापन जारी रखना चाहिए।',
    corridorScopeTitle: 'प्रदर्शित भौगोलिक कॉरिडोर',
    corridorScopeText: 'यह रोड नेटवर्क मॉडल जेएनपीटी / नवी मुंबई कंटेनर पोर्ट से पश्चिमी घाटों को पार करते हुए चाकण एमआईडीसी / पुणे ऑटोमोबाइल क्षेत्र को जोड़ने वाले औद्योगिक गलियारे का अनुकरण करता है।',

    // Auth
    authSignIn: 'लॉगिन करें',
    authSignUp: 'नया खाता बनाएं',
    authSignOut: 'लॉगआउट',
    authEmail: 'ईमेल पता',
    authPassword: 'पासवर्ड',
    authFullName: 'पूरा नाम',
    authRole: 'कार्यकारी भूमिका',
    authRoleDriver: 'कमर्शियल भारी वाहन चालक',
    authRoleFleetManager: 'फ्लीट व डिस्पैच प्रबंधक',
    authRoleLogistics: 'लॉजिस्टिक्स सुरक्षा ऑडिटर',
    authContinueWithGoogle: 'गूगल से लॉगिन करें',
    authQuickDemo: 'डेमो ड्राइवर लॉगिन',
    authDontHaveAccount: 'खाता नहीं है?',
    authAlreadyHaveAccount: 'पहले से पंजीकृत हैं?',
    authWelcomeBack: 'ClearRoute में स्वागत है',
    authCreateAccount: 'ClearRoute नेटवर्क से जुड़ें',
    authModalSubtitle: 'व्यक्तिगत कॉरिडोर क्लीयरेंस, फ्लीट टेलीमैटिक्स और सेव किए वाहन प्रोफाइल देखें',
    authSuccessSignIn: 'सफलतापूर्वक लॉगिन हो गया',
    authSuccessSignUp: 'खाता सफलतापूर्वक बन गया',
    authSigningIn: 'पहचान जांची जा रही है...',
    authSigningUp: 'खाता बनाया जा रहा है...',
    authGuestUser: 'अतिथि चालक',
    authSignedInAs: 'लॉगिन आईडी',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'clearroute_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

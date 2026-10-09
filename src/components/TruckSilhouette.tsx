import React from 'react';
import { VehicleType } from '../types/truck';

interface TruckSilhouetteProps {
  type: VehicleType;
  className?: string;
  accentColor?: string;
}

export const TruckSilhouette: React.FC<TruckSilhouetteProps> = ({
  type,
  className = 'w-full h-24',
  accentColor = '#83A6CE',
}) => {
  if (type === 'container') {
    return (
      <svg
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Cab */}
        <path
          d="M20 72H68V28H48L32 46V72H20"
          fill="#1E293B"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Cab Window */}
        <path d="M46 34H36L28 46H46V34Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Cab Bumper & Grille */}
        <rect x="16" y="58" width="6" height="14" rx="2" fill="#334155" />
        <line x1="22" y1="54" x2="32" y2="54" stroke="#64748B" strokeWidth="2" />
        {/* Coupling / 5th wheel */}
        <rect x="70" y="66" width="16" height="6" rx="2" fill="#475569" />
        {/* 40ft Container Box */}
        <rect
          x="82"
          y="18"
          width="220"
          height="54"
          rx="3"
          fill="#16202A"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Container corrugated ribs */}
        {[105, 128, 151, 174, 197, 220, 243, 266, 289].map((x) => (
          <line key={x} x1={x} y1="20" x2={x} y2="70" stroke="#334155" strokeWidth="2" />
        ))}
        {/* Container specification markings */}
        <rect x="90" y="24" width="28" height="10" rx="1.5" fill="#1E293B" />
        <line x1="93" y1="29" x2="112" y2="29" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Chassis Rail */}
        <rect x="68" y="72" width="236" height="5" fill="#334155" />
        {/* Axles & Wheels */}
        {/* Steer Axle (Cab) */}
        <circle cx="38" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="38" cy="78" r="4" fill="#38BDF8" />
        {/* Drive Axles (Tractor) */}
        <circle cx="78" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="78" cy="78" r="4" fill="#64748B" />
        {/* Trailer Triple Axle Group */}
        <circle cx="230" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="230" cy="78" r="4" fill="#64748B" />
        <circle cx="258" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="258" cy="78" r="4" fill="#64748B" />
        <circle cx="286" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="286" cy="78" r="4" fill="#64748B" />
      </svg>
    );
  }

  if (type === 'tanker') {
    return (
      <svg
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Cab */}
        <path
          d="M24 72H72V32H54L38 48V72H24"
          fill="#1E293B"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M52 38H42L34 48H52V38Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Hazchem placard */}
        <rect x="74" y="66" width="12" height="6" fill="#475569" />
        {/* Cylindrical Elliptical Tanker Vessel */}
        <rect
          x="88"
          y="24"
          width="212"
          height="48"
          rx="22"
          fill="#1A242E"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Safety catwalk & dome valves */}
        <line x1="120" y1="20" x2="260" y2="20" stroke="#94A3B8" strokeWidth="2" />
        <rect x="145" y="16" width="16" height="8" rx="2" fill="#F59E0B" />
        <rect x="225" y="16" width="16" height="8" rx="2" fill="#F59E0B" />
        {/* Hazmat diamond sign */}
        <polygon points="110,48 118,40 126,48 118,56" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
        {/* Tanker reinforcement bands */}
        <line x1="150" y1="24" x2="150" y2="72" stroke="#334155" strokeWidth="2" />
        <line x1="210" y1="24" x2="210" y2="72" stroke="#334155" strokeWidth="2" />
        <line x1="260" y1="24" x2="260" y2="72" stroke="#334155" strokeWidth="2" />
        {/* Wheels */}
        <circle cx="42" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="42" cy="78" r="4" fill="#38BDF8" />
        <circle cx="82" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="240" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="272" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
      </svg>
    );
  }

  if (type === 'tipper') {
    return (
      <svg
        viewBox="0 0 320 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Heavy Mining Rigid Cab */}
        <path
          d="M26 72H82V26H58L40 44V72H26"
          fill="#1E293B"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M56 32H44L36 44H56V32Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Stone protector canopy above cab */}
        <path d="M78 24H98L110 32H84V24Z" fill="#334155" stroke={accentColor} strokeWidth="1.5" />
        {/* Heavy Tipping Dump Body (High Tensile Steel) */}
        <path
          d="M86 34L100 24H296L282 72H86V34Z"
          fill="#16202A"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Structural stiffener ribs */}
        <line x1="135" y1="28" x2="130" y2="70" stroke="#334155" strokeWidth="2.5" />
        <line x1="180" y1="28" x2="175" y2="70" stroke="#334155" strokeWidth="2.5" />
        <line x1="225" y1="28" x2="220" y2="70" stroke="#334155" strokeWidth="2.5" />
        {/* Hydraulic Cylinder */}
        <line x1="88" y1="62" x2="108" y2="40" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        {/* 4 Heavy Rigid Axles */}
        <circle cx="48" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="48" cy="78" r="4" fill="#38BDF8" />
        <circle cx="196" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="228" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="260" cy="78" r="11" fill="#090D10" stroke="#94A3B8" strokeWidth="3" />
      </svg>
    );
  }

  // flatbed / lowbed
  return (
    <svg
      viewBox="0 0 320 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Heavy Haul Cab */}
      <path
        d="M20 72H68V28H48L32 46V72H20"
        fill="#1E293B"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M46 34H36L28 46H46V34Z" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.5" />
      {/* Gooseneck drop deck */}
      <path
        d="M68 62H94L104 68H296V74H68V62Z"
        fill="#1E293B"
        stroke={accentColor}
        strokeWidth="2"
      />
      {/* Cargo on flatbed (Industrial machinery crated box) */}
      <rect x="115" y="42" width="130" height="26" fill="#18232A" stroke="#475569" strokeWidth="2" />
      <line x1="115" y1="42" x2="245" y2="68" stroke="#334155" strokeWidth="1.5" />
      <line x1="115" y1="68" x2="245" y2="42" stroke="#334155" strokeWidth="1.5" />
      <rect x="160" y="46" width="40" height="10" rx="1.5" fill="#0F172A" />
      {/* Tie down straps */}
      <line x1="135" y1="42" x2="135" y2="68" stroke="#F59E0B" strokeWidth="2" />
      <line x1="225" y1="42" x2="225" y2="68" stroke="#F59E0B" strokeWidth="2" />
      {/* 6 Axles */}
      <circle cx="38" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="38" cy="78" r="3.5" fill="#38BDF8" />
      <circle cx="74" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="218" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="242" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="266" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
      <circle cx="290" cy="78" r="10" fill="#090D10" stroke="#94A3B8" strokeWidth="2.5" />
    </svg>
  );
};

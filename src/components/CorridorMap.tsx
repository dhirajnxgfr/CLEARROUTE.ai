import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Restriction, DriverReport, RouteOption, RejectedRoute } from '../types/truck';

interface CorridorMapProps {
  originCoords?: [number, number];
  originName?: string;
  destCoords?: [number, number];
  destName?: string;
  activeRoute?: RouteOption;
  alternativeRoutes?: RouteOption[];
  rejectedRoutes?: RejectedRoute[];
  restrictions?: Restriction[];
  driverReports?: DriverReport[];
  truckPosition?: [number, number];
  truckHeading?: number;
  interactive?: boolean;
  className?: string;
  highlightedEdgeCoords?: [number, number][];
}

export const CorridorMap: React.FC<CorridorMapProps> = ({
  originCoords,
  originName,
  destCoords,
  destName,
  activeRoute,
  alternativeRoutes = [],
  rejectedRoutes = [],
  restrictions = [],
  driverReports = [],
  truckPosition,
  interactive = true,
  className = 'w-full h-full min-h-[420px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.FeatureGroup | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center: Western Ghats / Khandala pass between Mumbai & Pune
    const map = L.map(mapContainerRef.current, {
      center: [18.84, 73.38],
      zoom: 10,
      zoomControl: interactive,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      attributionControl: false,
    });

    // Dark-themed tile layer using CartoDB Dark Matter (clean GIS base map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    const layersGroup = L.featureGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [interactive]);

  // Update Map Elements when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const boundsPoints: [number, number][] = [];

    // 1. Rejected routes (Dashed Red / Amber)
    rejectedRoutes.forEach((rej) => {
      if (rej.coordinates && rej.coordinates.length > 1) {
        const poly = L.polyline(rej.coordinates, {
          color: rej.violationType === 'time_ban' ? '#D97706' : '#DC2626',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '5, 8',
          lineCap: 'round',
        });
        poly.bindPopup(`
          <div style="font-family: inherit;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 9999px; background: #DC2626;"></span>
              <strong style="color: #DC2626; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;">REJECTED ROUTE</strong>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #F1F3F5; margin-bottom: 4px;">${rej.name}</div>
            <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 6px;">${rej.blockedReason}</div>
            <div style="font-size: 11px; color: #94A3B8;">Location: ${rej.violatingLocation} · ${rej.distanceKm} km</div>
          </div>
        `);
        group.addLayer(poly);
        rej.coordinates.forEach((pt) => boundsPoints.push(pt));
      }
    });

    // 2. Alternative Legal routes (Muted Emerald / Teal)
    alternativeRoutes.forEach((alt) => {
      if (alt.id !== activeRoute?.id && alt.coordinates && alt.coordinates.length > 1) {
        const poly = L.polyline(alt.coordinates, {
          color: '#059669',
          weight: 3.5,
          opacity: 0.7,
          dashArray: '4, 6',
          lineCap: 'round',
        });
        poly.bindPopup(`
          <div style="font-family: inherit;">
            <div style="color: #10B981; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px;">ALTERNATIVE PERMITTED</div>
            <div style="font-size: 13px; font-weight: 600; color: #F1F3F5;">${alt.title}</div>
            <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">${alt.distanceKm} km · ${alt.timeMin} min · ₹${alt.tollInr} toll</div>
          </div>
        `);
        group.addLayer(poly);
        alt.coordinates.forEach((pt) => boundsPoints.push(pt));
      }
    });

    // 3. Active Recommended route (Highway Cobalt)
    if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 1) {
      // Outer casing for high contrast on dark map
      const casing = L.polyline(activeRoute.coordinates, {
        color: '#0B1B32',
        weight: 8,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });
      group.addLayer(casing);

      // Main highway line
      const mainPoly = L.polyline(activeRoute.coordinates, {
        color: '#83A6CE',
        weight: 5,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      });
      mainPoly.bindPopup(`
        <div style="font-family: inherit;">
          <div style="color: #83A6CE; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">CLEARROUTE CERTIFIED CORRIDOR</div>
          <div style="font-size: 13px; font-weight: 600; color: #F1F5F9;">${activeRoute.title}</div>
          <div style="font-size: 12px; color: #CBD5E1; margin-top: 4px;">${activeRoute.subtitle}</div>
          <div style="font-size: 12px; color: #94A3B8; margin-top: 6px;">
            ${activeRoute.distanceKm} km · ${Math.floor(activeRoute.timeMin / 60)}h ${activeRoute.timeMin % 60}m · Toll: ₹${activeRoute.tollInr}
          </div>
        </div>
      `);
      group.addLayer(mainPoly);
      activeRoute.coordinates.forEach((pt) => boundsPoints.push(pt));
    }

    // 4. Restrictions Markers
    restrictions.forEach((res) => {
      let iconHtml = '!';
      let iconBg = '#DC2626';
      let badgeLabel = 'Weight Limit';

      if (res.type === 'max_height_m') {
        iconHtml = 'H';
        iconBg = '#D97706';
        badgeLabel = 'Low Clearance';
      } else if (res.type === 'time_ban') {
        iconHtml = 'T';
        iconBg = '#DC2626';
        badgeLabel = 'Time Ban';
      } else if (res.type === 'max_width_m') {
        iconHtml = 'W';
        iconBg = '#D97706';
        badgeLabel = 'Narrow Road';
      }

      const customIcon = L.divIcon({
        className: 'custom-restriction-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #0F172A;
            border: 1.5px solid ${iconBg};
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.6);
            color: ${iconBg};
            font-weight: 700;
            font-size: 12px;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
          ">
            ${iconHtml}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([res.lat, res.lng], { icon: customIcon });
      marker.bindPopup(`
        <div style="font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: ${iconBg}; text-transform: uppercase;">${badgeLabel}</span>
            <span style="font-size: 10px; color: #64748B;">Demo Data</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #F8FAFC; margin-bottom: 4px;">${res.label}</div>
          <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 6px;">${res.description}</div>
          <div style="font-size: 11px; color: #94A3B8;">${res.locationName}</div>
          ${res.sourceAuthority ? `<div style="font-size: 10px; color: #64748B; margin-top: 4px;">Auth: ${res.sourceAuthority}</div>` : ''}
        </div>
      `);
      group.addLayer(marker);
      boundsPoints.push([res.lat, res.lng]);
    });

    // 5. Driver Hazard Reports
    driverReports.forEach((rep) => {
      const hazardColor = rep.severity === 'blocking' ? '#DC2626' : '#D97706';
      const reportIcon = L.divIcon({
        className: 'custom-hazard-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            background: #0F172A;
            border: 1.5px solid ${hazardColor};
            border-radius: 9999px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            color: ${hazardColor};
            font-size: 13px;
            font-weight: bold;
          ">
            ⚠
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: reportIcon });
      marker.bindPopup(`
        <div style="font-family: inherit;">
          <div style="font-size: 11px; font-weight: 700; color: ${hazardColor}; margin-bottom: 2px;">
            DRIVER COMMUNITY ALERT · ${rep.type.toUpperCase()}
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #F8FAFC; margin-bottom: 4px;">${rep.title}</div>
          <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 4px;">${rep.notes || ''}</div>
          <div style="font-size: 11px; color: #94A3B8;">Reported: ${rep.createdAt} by ${rep.reportedBy}</div>
        </div>
      `);
      group.addLayer(marker);
      boundsPoints.push([rep.lat, rep.lng]);
    });

    // 6. Origin Pin (Highway Green / Emerald)
    if (originCoords) {
      const originIcon = L.divIcon({
        className: 'custom-origin-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: #059669;
            color: #FFFFFF;
            border-radius: 9999px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
            font-weight: 800;
            font-size: 13px;
          ">
            A
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker(originCoords, { icon: originIcon });
      marker.bindPopup(`<div style="font-size: 13px; font-weight: 600;">Trip Origin: ${originName || 'Origin'}</div>`);
      group.addLayer(marker);
      boundsPoints.push(originCoords);
    }

    // 7. Destination Pin (Interstate Blue / Cobalt)
    if (destCoords) {
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: #83A6CE;
            color: #0B1B32;
            border-radius: 9999px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(131, 166, 206, 0.5);
            font-weight: 800;
            font-size: 13px;
          ">
            B
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker(destCoords, { icon: destIcon });
      marker.bindPopup(`<div style="font-size: 13px; font-weight: 600;">Delivery Destination: ${destName || 'Destination'}</div>`);
      group.addLayer(marker);
      boundsPoints.push(destCoords);
    }

    // Auto fit bounds
    if (boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), {
        padding: [45, 45],
        maxZoom: 12,
      });
    }
  }, [
    originCoords,
    originName,
    destCoords,
    destName,
    activeRoute,
    alternativeRoutes,
    rejectedRoutes,
    restrictions,
    driverReports,
  ]);

  // Handle Simulated Truck Marker Position Updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (truckPosition) {
      const truckIcon = L.divIcon({
        className: 'truck-live-marker',
        html: `
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 9999px;
              background: rgba(131, 166, 206, 0.35);
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 6px;
              background: #83A6CE;
              border: 2px solid #FFFFFF;
              color: #0B1B32;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(131, 166, 206, 0.6);
            ">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      if (!truckMarkerRef.current) {
        truckMarkerRef.current = L.marker(truckPosition, { icon: truckIcon }).addTo(map);
      } else {
        truckMarkerRef.current.setLatLng(truckPosition);
      }

      // Smooth pan to keep truck in view
      map.panTo(truckPosition, { animate: true, duration: 0.6 });
    } else if (truckMarkerRef.current) {
      truckMarkerRef.current.remove();
      truckMarkerRef.current = null;
    }
  }, [truckPosition]);

  return (
    <div className={`relative ${className} bg-[#0B1B32] overflow-hidden`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

import { VehicleProfile, DriverReport, RoutingPlan, TripHistoryItem } from '../types/truck';
import { DEMO_VEHICLES, INITIAL_DRIVER_REPORTS } from '../data/corridorGraph';
import { computeTruckRoute } from '../engine/routingEngine';

const STORAGE_KEYS = {
  VEHICLES: 'truckroute_vehicles_v1',
  TRIPS: 'truckroute_trips_v1',
  PLANS: 'truckroute_saved_plans_v1',
  REPORTS: 'truckroute_driver_reports_v1',
  ACTIVE_VEHICLE_ID: 'truckroute_active_vehicle_id',
};

// --- Vehicles ---
export function getSavedVehicles(): VehicleProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse vehicles from localStorage', err);
  }
  // Initialize with demo vehicles
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(DEMO_VEHICLES));
  return DEMO_VEHICLES;
}

export function saveVehicle(vehicle: VehicleProfile): VehicleProfile[] {
  const current = getSavedVehicles();
  const index = current.findIndex((v) => v.id === vehicle.id);
  let updated: VehicleProfile[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = vehicle;
  } else {
    updated = [...current, vehicle];
  }
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
  return updated;
}

export function deleteVehicle(id: string): VehicleProfile[] {
  const current = getSavedVehicles();
  const updated = current.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(updated));
  return updated;
}

export function getActiveVehicleId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_VEHICLE_ID) || 'veh_container_40ft';
}

export function setActiveVehicleId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_VEHICLE_ID, id);
}

// --- Driver Reports ---
export function getSavedReports(): DriverReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse reports from localStorage', err);
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DRIVER_REPORTS));
  return INITIAL_DRIVER_REPORTS;
}

export function addDriverReport(report: Omit<DriverReport, 'id' | 'createdAt'>): DriverReport {
  const current = getSavedReports();
  const newReport: DriverReport = {
    ...report,
    id: `rep_${Date.now()}`,
    createdAt: 'Just now',
  };
  const updated = [newReport, ...current];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  return newReport;
}

export function toggleReportActive(reportId: string): DriverReport[] {
  const current = getSavedReports();
  const updated = current.map((r) => (r.id === reportId ? { ...r, active: !r.active } : r));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  return updated;
}

// --- Plans & Trips ---
export function getSavedPlan(planId: string): RoutingPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (raw) {
      const parsed: Record<string, RoutingPlan> = JSON.parse(raw);
      if (parsed[planId]) return parsed[planId];
    }
  } catch (err) {
    console.warn('Error fetching plan', err);
  }

  // If requesting the standard demo plan 'demo_default', generate on the fly!
  if (planId === 'demo_default' || planId.startsWith('trip_demo')) {
    const defaultVehicle = getSavedVehicles()[0];
    const demoPlan = computeTruckRoute(
      'jnpt_gate',
      'chakan_midc',
      defaultVehicle,
      '08:30',
      '18:00',
      getSavedReports()
    );
    demoPlan.id = planId;
    savePlan(demoPlan);
    return demoPlan;
  }

  return null;
}

export function savePlan(plan: RoutingPlan): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    const existing: Record<string, RoutingPlan> = raw ? JSON.parse(raw) : {};
    existing[plan.id] = plan;
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(existing));

    // Also append to trip history
    addTripHistoryItem({
      id: plan.id,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      originName: plan.origin.name,
      destinationName: plan.destination.name,
      vehicleName: plan.vehicle.name,
      vehicleType: plan.vehicle.type,
      distanceKm: plan.routes[0]?.distanceKm || 105,
      durationMin: plan.routes[0]?.timeMin || 110,
      status: 'planned',
      costInr: plan.routes[0]?.totalCostInr || 2850,
    });
  } catch (err) {
    console.warn('Error saving plan', err);
  }
}

// --- Trip History ---
export function getTripHistory(): TripHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading trips', err);
  }

  // Pre-seed realistic past trips
  const seededTrips: TripHistoryItem[] = [
    {
      id: 'trip_demo_1',
      date: 'Today, 08:30 AM',
      originName: 'JNPT Port Container Terminal 4',
      destinationName: 'Chakan MIDC Phase 2 (Auto Cluster)',
      vehicleName: 'BharatBenz 4028T Container (40ft High-Cube)',
      vehicleType: 'container',
      distanceKm: 104.8,
      durationMin: 112,
      status: 'active',
      costInr: 2940,
    },
    {
      id: 'trip_hist_2',
      date: 'Yesterday, 14:15 PM',
      originName: 'Uran CFS Logistics Park',
      destinationName: 'Talegaon Industrial Estate',
      vehicleName: 'Tata Signa 2823.K Petroleum Tanker',
      vehicleType: 'tanker',
      distanceKm: 86.4,
      durationMin: 95,
      status: 'completed',
      costInr: 2150,
    },
    {
      id: 'trip_hist_3',
      date: '06 Oct 2026, 21:00 PM',
      originName: 'Kalamboli / Panvel Freight Hub',
      destinationName: 'Bhosari MIDC Logistics Gate',
      vehicleName: 'Mahindra Blazo X 49 Multi-Axle Flatbed Trailer',
      vehicleType: 'flatbed',
      distanceKm: 98.6,
      durationMin: 108,
      status: 'completed',
      costInr: 3200,
    },
  ];

  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(seededTrips));
  return seededTrips;
}

export function addTripHistoryItem(item: TripHistoryItem): void {
  const current = getTripHistory();
  // Filter duplicate ids
  const filtered = current.filter((t) => t.id !== item.id);
  const updated = [item, ...filtered];
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updated.slice(0, 20)));
}

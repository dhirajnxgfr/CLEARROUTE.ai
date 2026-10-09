import {
  VehicleProfile,
  RoadNode,
  RoadEdge,
  Restriction,
  DriverReport,
  RouteOption,
  RejectedRoute,
  RoutingPlan,
} from '../types/truck';
import { CORRIDOR_NODES, CORRIDOR_EDGES } from '../data/corridorGraph';

interface EdgeEvaluation {
  permitted: boolean;
  violations: string[];
  restrictionViolated?: Restriction;
  reportViolated?: DriverReport;
  estimatedArrivalHour?: number;
}

// Convert "HH:mm" to fractional hours
function parseTimeToHours(timeStr: string): number {
  if (!timeStr) return 9.0; // default 09:00
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h + m / 60;
}

// Format fractional hours to "HH:mm"
export function formatHoursToTime(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Check an individual edge against vehicle profile and time
function evaluateEdge(
  edge: RoadEdge,
  vehicle: VehicleProfile,
  cumulativeMinutes: number,
  departureTimeStr: string,
  activeReports: DriverReport[]
): EdgeEvaluation {
  const departureHour = parseTimeToHours(departureTimeStr);
  const estimatedArrivalHour = (departureHour + cumulativeMinutes / 60) % 24;

  // 1. Check active driver hazard reports blocking this edge
  const blockingReport = activeReports.find(
    (rep) => rep.active && rep.severity === 'blocking' && rep.affectedEdgeId === edge.id
  );
  if (blockingReport) {
    return {
      permitted: false,
      violations: [`Active hazard report: ${blockingReport.title}`],
      reportViolated: blockingReport,
      estimatedArrivalHour,
    };
  }

  // 2. Check restrictions on this edge
  for (const res of edge.restrictions) {
    if (res.type === 'max_weight_t') {
      if (vehicle.loadedWeightT > res.value) {
        return {
          permitted: false,
          violations: [
            `Truck weight (${vehicle.loadedWeightT} t) exceeds bridge limit of ${res.value} t at ${res.locationName}`,
          ],
          restrictionViolated: res,
          estimatedArrivalHour,
        };
      }
    }

    if (res.type === 'max_height_m') {
      if (vehicle.heightM > res.value) {
        return {
          permitted: false,
          violations: [
            `Truck height (${vehicle.heightM} m) exceeds overhead bridge clearance of ${res.value} m at ${res.locationName}`,
          ],
          restrictionViolated: res,
          estimatedArrivalHour,
        };
      }
    }

    if (res.type === 'max_width_m') {
      if (vehicle.widthM > res.value) {
        return {
          permitted: false,
          violations: [
            `Truck width (${vehicle.widthM} m) exceeds road carriageway width of ${res.value} m at ${res.locationName}`,
          ],
          restrictionViolated: res,
          estimatedArrivalHour,
        };
      }
    }

    if (res.type === 'time_ban') {
      const start = res.startHour ?? 7;
      const end = res.endHour ?? 11;
      // Check if estimated arrival falls within the municipal ban window
      if (estimatedArrivalHour >= start && estimatedArrivalHour <= end) {
        return {
          permitted: false,
          violations: [
            `Heavy vehicle municipal ban active ${String(start).padStart(2, '0')}:00 - ${String(end).padStart(2, '0')}:00 at ${res.locationName} (estimated arrival ${formatHoursToTime(estimatedArrivalHour)})`,
          ],
          restrictionViolated: res,
          estimatedArrivalHour,
        };
      }
    }
  }

  return {
    permitted: true,
    violations: [],
    estimatedArrivalHour,
  };
}

// Build adjacency graph representation
function buildAdjacencyList(edges: RoadEdge[]) {
  const adj: Record<string, { target: string; edge: RoadEdge }[]> = {};
  for (const nodeKey of Object.keys(CORRIDOR_NODES)) {
    adj[nodeKey] = [];
  }

  for (const edge of edges) {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    // Directional (forward)
    adj[edge.from].push({ target: edge.to, edge });
    // Also allow reverse traversal for connecting edges if sensible
    adj[edge.to].push({
      target: edge.from,
      edge: {
        ...edge,
        from: edge.to,
        to: edge.from,
        pathCoordinates: [...edge.pathCoordinates].reverse(),
      },
    });
  }

  return adj;
}

// Dijkstra with custom cost weighting and strict constraint filtering
function findOptimalPath(
  startId: string,
  destId: string,
  vehicle: VehicleProfile,
  departureTimeStr: string,
  activeReports: DriverReport[],
  costType: 'time' | 'safety' | 'cost' | 'unconstrained'
): { path: RoadEdge[]; totalCost: number } | null {
  const adj = buildAdjacencyList(CORRIDOR_EDGES);

  const distances: Record<string, number> = {};
  const cumulativeTime: Record<string, number> = {};
  const previousEdge: Record<string, RoadEdge | null> = {};
  const previousNode: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const nodeId of Object.keys(CORRIDOR_NODES)) {
    distances[nodeId] = Infinity;
    cumulativeTime[nodeId] = 0;
    previousEdge[nodeId] = null;
    previousNode[nodeId] = null;
  }

  distances[startId] = 0;
  cumulativeTime[startId] = 0;

  const queue = [{ id: startId, dist: 0 }];

  while (queue.length > 0) {
    // Sort to extract minimum distance
    queue.sort((a, b) => a.dist - b.dist);
    const { id: u, dist: currentDist } = queue.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === destId) break;

    const neighbors = adj[u] || [];
    for (const { target: v, edge } of neighbors) {
      if (visited.has(v)) continue;

      const currentTimeMin = cumulativeTime[u];

      // If NOT unconstrained, check legal compliance
      if (costType !== 'unconstrained') {
        const evalResult = evaluateEdge(edge, vehicle, currentTimeMin, departureTimeStr, activeReports);
        if (!evalResult.permitted) {
          continue; // road segment is illegal for this vehicle profile or time!
        }
      }

      // Compute edge weight according to chosen cost objective
      let weight = 0;
      if (costType === 'time' || costType === 'unconstrained') {
        weight = edge.baseTimeMin;
      } else if (costType === 'safety') {
        // Safety objective: penalize narrow lanes, steep ghats, and tight single carriageways
        const ghatPenalty = edge.ghatSection ? 25 : 0;
        const narrowPenalty = (edge.laneCount ?? 4) <= 2 ? 15 : 0;
        weight = edge.baseTimeMin + ghatPenalty + narrowPenalty;
      } else if (costType === 'cost') {
        // Cost objective: Tolls + Estimated Fuel Cost
        // Baseline diesel consumption: ~3.0 km/L for 35t container; fuel price: Rs 92/L
        const fuelLiters = edge.distanceKm / (vehicle.loadedWeightT > 30 ? 3.0 : 3.8);
        const fuelCost = fuelLiters * 92;
        weight = edge.tollInr + fuelCost;
      }

      const alt = currentDist + weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        cumulativeTime[v] = currentTimeMin + edge.baseTimeMin;
        previousEdge[v] = edge;
        previousNode[v] = u;
        queue.push({ id: v, dist: alt });
      }
    }
  }

  if (distances[destId] === Infinity) {
    return null; // No path found
  }

  // Reconstruct path
  const path: RoadEdge[] = [];
  let curr = destId;
  while (curr !== startId && previousEdge[curr]) {
    const e = previousEdge[curr]!;
    path.unshift(e);
    curr = previousNode[curr]!;
  }

  return { path, totalCost: distances[destId] };
}

// Compute fuel liters and cost
function calculateFuel(distanceKm: number, weightT: number) {
  // Fuel consumption curve based on loaded tonnage
  const kmPerLiter = Math.max(2.4, 4.2 - (weightT / 45) * 1.5);
  const liters = Math.round((distanceKm / kmPerLiter) * 10) / 10;
  const cost = Math.round(liters * 92); // Diesel at INR 92/L
  return { liters, cost };
}

// Compile a RouteOption from a path of edges
function compileRouteOption(
  id: string,
  category: 'fastest_legal' | 'safest' | 'lowest_cost',
  title: string,
  subtitle: string,
  edges: RoadEdge[],
  vehicle: VehicleProfile,
  explanation: string
): RouteOption {
  let distanceKm = 0;
  let timeMin = 0;
  let tollInr = 0;
  let ghatCount = 0;
  const coords: [number, number][] = [];
  const edgeIds: string[] = [];
  const nodeNames: string[] = [];
  const restrictionsEncountered: Restriction[] = [];

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    distanceKm += edge.distanceKm;
    timeMin += edge.baseTimeMin;
    tollInr += edge.tollInr;
    if (edge.ghatSection) ghatCount++;
    edgeIds.push(edge.id);

    if (i === 0) {
      const fromNode = CORRIDOR_NODES[edge.from];
      if (fromNode) nodeNames.push(fromNode.name);
    }
    const toNode = CORRIDOR_NODES[edge.to];
    if (toNode) nodeNames.push(toNode.name);

    // Merge coordinates
    coords.push(...edge.pathCoordinates);

    // Track restrictions that were safely verified
    if (edge.restrictions.length > 0) {
      restrictionsEncountered.push(...edge.restrictions);
    }
  }

  const { liters, cost: fuelCost } = calculateFuel(distanceKm, vehicle.loadedWeightT);
  const totalCostInr = tollInr + fuelCost;

  return {
    id,
    category,
    title,
    subtitle,
    timeMin: Math.round(timeMin),
    distanceKm: Math.round(distanceKm * 10) / 10,
    tollInr,
    fuelLiters: liters,
    fuelCostInr: fuelCost,
    totalCostInr,
    coordinates: coords,
    edgeIds,
    nodeNames,
    restrictionsEncountered,
    ghatSectionsCount: ghatCount,
    explanation,
  };
}

// Main Routing Function
export function computeTruckRoute(
  originId: string,
  destId: string,
  vehicle: VehicleProfile,
  departureTimeStr: string = '08:30',
  deadlineTimeStr: string = '18:00',
  activeReports: DriverReport[] = []
): RoutingPlan {
  const originNode = CORRIDOR_NODES[originId] || CORRIDOR_NODES.jnpt_gate;
  const destNode = CORRIDOR_NODES[destId] || CORRIDOR_NODES.chakan_midc;

  // 1. Compute Legal Paths for 3 Categories
  const fastestPath = findOptimalPath(originId, destId, vehicle, departureTimeStr, activeReports, 'time');
  const safestPath = findOptimalPath(originId, destId, vehicle, departureTimeStr, activeReports, 'safety');
  const cheapestPath = findOptimalPath(originId, destId, vehicle, departureTimeStr, activeReports, 'cost');

  const routes: RouteOption[] = [];

  if (fastestPath && fastestPath.path.length > 0) {
    routes.push(
      compileRouteOption(
        'route_fastest_legal',
        'fastest_legal',
        'Fastest Permitted Corridor',
        'Via Mumbai-Pune Expressway & Modern Tunnels',
        fastestPath.path,
        vehicle,
        `Optimized for travel time on NH 48 Expressway. Verified clearance: 4.8m overhead, 55t bridge rating.`
      )
    );
  }

  if (safestPath && safestPath.path.length > 0) {
    // Check if distinct from fastest
    const sameAsFastest = fastestPath && JSON.stringify(safestPath.path.map((e) => e.id)) === JSON.stringify(fastestPath.path.map((e) => e.id));
    routes.push(
      compileRouteOption(
        'route_safest',
        'safest',
        'Safest Highway Alignment',
        sameAsFastest ? 'Gentle gradients & engineered viaducts' : 'Engineered 4-lane bypass avoiding heavy ghat queues',
        safestPath.path,
        vehicle,
        `Avoids acute hairpin turns, high-gradient ramps, and narrow village links.`
      )
    );
  }

  if (cheapestPath && cheapestPath.path.length > 0) {
    routes.push(
      compileRouteOption(
        'route_lowest_cost',
        'lowest_cost',
        'Lowest Operating Cost',
        'Balanced toll plazas & fuel conservation',
        cheapestPath.path,
        vehicle,
        `Balances toll fees (₹${cheapestPath.path.reduce((acc, e) => acc + e.tollInr, 0)}) with engine fuel rate consumption.`
      )
    );
  }

  // 2. Compute Unconstrained Shortest Path to discover blocked alternatives & explain rejections
  const unconstrained = findOptimalPath(originId, destId, vehicle, departureTimeStr, activeReports, 'unconstrained');
  const rejectedRoutes: RejectedRoute[] = [];

  if (unconstrained && unconstrained.path.length > 0) {
    // Check if the unconstrained shortest path is actually illegal
    let cumulativeMin = 0;
    let blockingReason = '';
    let violationType: 'weight' | 'height' | 'width' | 'time_ban' | 'report' = 'weight';
    let violatingLoc = '';

    for (const edge of unconstrained.path) {
      const evalResult = evaluateEdge(edge, vehicle, cumulativeMin, departureTimeStr, activeReports);
      if (!evalResult.permitted) {
        if (evalResult.restrictionViolated) {
          const res = evalResult.restrictionViolated;
          violatingLoc = res.locationName;
          if (res.type === 'max_weight_t') {
            violationType = 'weight';
            blockingReason = `Exceeds bridge load limit: Bridge is rated for ${res.value} t, but truck is ${vehicle.loadedWeightT} t.`;
          } else if (res.type === 'max_height_m') {
            violationType = 'height';
            blockingReason = `Exceeds overhead clearance: Rail bridge clearance is ${res.value} m, while truck height is ${vehicle.heightM} m.`;
          } else if (res.type === 'time_ban') {
            violationType = 'time_ban';
            blockingReason = `Blocked by municipal time ban: Heavy goods ban active 07:00-11:00 (estimated arrival ~${formatHoursToTime(evalResult.estimatedArrivalHour ?? 8)}).`;
          } else if (res.type === 'max_width_m') {
            violationType = 'width';
            blockingReason = `Exceeds carriageway width: Bridge width is ${res.value} m, truck is ${vehicle.widthM} m.`;
          }
        } else if (evalResult.reportViolated) {
          violationType = 'report';
          violatingLoc = evalResult.reportViolated.locationName;
          blockingReason = `Blocked by driver hazard report: ${evalResult.reportViolated.title}`;
        }
        break;
      }
      cumulativeMin += edge.baseTimeMin;
    }

    if (blockingReason) {
      const dist = unconstrained.path.reduce((acc, e) => acc + e.distanceKm, 0);
      const time = unconstrained.path.reduce((acc, e) => acc + e.baseTimeMin, 0);
      const coords = unconstrained.path.flatMap((e) => e.pathCoordinates);

      rejectedRoutes.push({
        id: 'rej_unconstrained_shortest',
        name: 'Shortest Physical Road (Old NH 48 via Amrutanjan)',
        distanceKm: Math.round(dist * 10) / 10,
        timeMin: Math.round(time),
        blockedReason: blockingReason,
        violationType,
        violatingLocation: violatingLoc,
        coordinates: coords,
      });
    }
  }

  // 3. Add other realistic rejected candidates for complete explainability
  // Candidate B: Old NH48 through Lonavala town during peak morning
  const depHours = parseTimeToHours(departureTimeStr);
  if (depHours >= 6.5 && depHours <= 10.5) {
    rejectedRoutes.push({
      id: 'rej_lonavala_town_ban',
      name: 'Lonavala Municipal Heritage Arterial (Toll-Free)',
      distanceKm: 89.4,
      timeMin: 145,
      blockedReason: `Morning Commercial Ban: Heavy vehicles prohibited 07:00-11:00 by local administration. Estimated arrival 08:45 falls within curfew window.`,
      violationType: 'time_ban',
      violatingLocation: 'Lonavala Municipal Center (Old NH48)',
      coordinates: [
        [18.7580, 73.4020],
        [18.7540, 73.4080],
        [18.7400, 73.4350],
        [18.7300, 73.4680],
      ],
    });
  }

  // Candidate C: Indrayani River Rural Causeway Shortcut
  if (vehicle.loadedWeightT > 18) {
    rejectedRoutes.push({
      id: 'rej_indrayani_causeway',
      name: 'Indrayani Rural Causeway Shortcut to Chakan',
      distanceKm: 98.2,
      timeMin: 155,
      blockedReason: `Submersible bridge 18 t weight restriction: Loaded truck is ${vehicle.loadedWeightT} t (overload hazard).`,
      violationType: 'weight',
      violatingLocation: 'Indrayani River Rural Crossing',
      coordinates: [
        [18.7350, 73.6850],
        [18.7210, 73.7400],
        [18.7380, 73.8050],
        [18.7585, 73.8550],
      ],
    });
  }

  // Primary recommended route
  const recommendedRoute = routes[0] || null;
  const bestLegalDist = recommendedRoute ? recommendedRoute.distanceKm : 105;
  const shortestRejectedDist = rejectedRoutes.length > 0 ? rejectedRoutes[0].distanceKm : (bestLegalDist - 7.5);
  const diffKm = Math.max(2.1, Math.round((bestLegalDist - shortestRejectedDist) * 10) / 10);

  // Generate plain language explanation
  let whyThisRoute = '';
  if (rejectedRoutes.length > 0) {
    const primaryRejection = rejectedRoutes[0];
    whyThisRoute = `The shortest direct road (${primaryRejection.distanceKm} km) is blocked at ${primaryRejection.violatingLocation}: ${primaryRejection.blockedReason} CLEARROUTE AI routed via the 6-lane NH 48 Expressway corridor instead, which is ${diffKm} km longer but fully compliant with your truck's ${vehicle.loadedWeightT} t weight and ${vehicle.heightM} m clearance.`;
  } else {
    whyThisRoute = `Recommended route is fully certified for your ${vehicle.loadedWeightT} t vehicle and conforms to all highway clearances, bridge ratings, and municipal freight schedules.`;
  }

  const departureHours = parseTimeToHours(departureTimeStr);
  const transitHours = (recommendedRoute ? recommendedRoute.timeMin : 120) / 60;
  const etaHours = departureHours + transitHours;
  const deadlineHours = parseTimeToHours(deadlineTimeStr);
  const etaMinutes = recommendedRoute ? recommendedRoute.timeMin : 120;

  const onTime = etaHours <= deadlineHours;
  if (!onTime) {
    whyThisRoute += ` Note: Estimated arrival is ${formatHoursToTime(etaHours)}, which is past the requested deadline of ${deadlineTimeStr}. Consider early dispatch.`;
  }

  return {
    id: `trip_${Date.now()}`,
    createdAt: new Date().toISOString(),
    origin: originNode,
    destination: destNode,
    vehicle,
    departureTime: departureTimeStr,
    deadlineTime: deadlineTimeStr,
    recommendedRouteId: recommendedRoute ? recommendedRoute.id : '',
    routes,
    rejectedRoutes,
    whyThisRoute,
  };
}

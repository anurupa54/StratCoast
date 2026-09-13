/**
 * StratCoast — AI Charter Strategy Optimizer & Maritime Engine
 * Hydrographic Clearance, Delivered Cost Waterfall, Port Scoring & Explainable AI Engine
 */

import {
  PORTS,
  PORTS_BY_NAME,
  FLEET_CLASSES,
  CANDIDATE_VESSEL_NAMES,
  PORT_DISTANCE_DELTAS,
  ORIGIN_BASE_DISTANCES,
  COMMODITY_FACTORS,
  INR_EXCHANGE_RATE
} from "./data.js";

/**
 * Calculates voyage distance in Nautical Miles (NM)
 */
export function calculateVoyageDistance(origin, destination) {
  const base = ORIGIN_BASE_DISTANCES[origin] ?? 3000;
  const delta = PORT_DISTANCE_DELTAS[destination] ?? 0;
  return base + delta;
}

/**
 * Calculates base ocean freight rate in USD/t
 */
export function calculateBaseFreightRate(origin, portName, commodity, vessel) {
  const distance = calculateVoyageDistance(origin, portName);
  const commodityFactor = COMMODITY_FACTORS[commodity] ?? 0.40;
  return 11.20 + (distance * 0.0022) + commodityFactor + vessel.rateFactor;
}

/**
 * Checks physical and operational vessel compatibility against a port & cargo
 */
export function checkSuitability(vessel, port, commodity, quantity) {
  if (quantity > vessel.capacity) {
    return { label: "Not suitable · capacity limit", tone: "warning" };
  }
  if (vessel.draft > port.maxDraft) {
    return { label: "Not suitable · draft restriction", tone: "warning" };
  }
  if (!port.vesselTypes.includes(vessel.className)) {
    return { label: "Restricted · vessel size", tone: "muted" };
  }
  if (!vessel.cargoTypes.includes(commodity) || !port.cargoTypes.includes(commodity)) {
    return { label: "Not suitable · cargo handling", tone: "warning" };
  }
  return { label: "Suitable · feasible", tone: "good" };
}

/**
 * Evaluates all candidate vessel classes for a specific destination port
 */
export function evaluateVesselsForPort(origin, port, commodity, quantity, bunkerIndex, portCongestion) {
  return FLEET_CLASSES.map((vessel, idx) => {
    const suitability = checkSuitability(vessel, port, commodity, quantity);
    const isGood = suitability.tone === "good";
    
    // Indicative rate sensitive to bunker fuel index and congestion variance
    const rate = calculateBaseFreightRate(origin, port.name, commodity, vessel) 
      + ((bunkerIndex - 612) * 0.014) 
      + ((portCongestion - port.congestion) * 0.018);

    // Dynamic ETA load date (simulated based on waiting time and vessel availability)
    const etaDate = 19 + idx + Math.round(port.waitingDays);

    // Route fit percentage (21% to 98%)
    const draftPenalty = Math.max(0, vessel.draft - port.maxDraft) * 5;
    const capacityPenalty = Math.max(0, quantity - vessel.capacity) / 2000;
    const fit = Math.max(
      21,
      Math.round(
        100 - (isGood ? 0 : 35) - draftPenalty - capacityPenalty 
        - (port.congestion * 0.18) - (port.waitingDays * 2) + (port.bulkHandling * 0.08)
      )
    );

    return {
      ...vessel,
      name: CANDIDATE_VESSEL_NAMES[idx] || `Vessel-${idx + 1}`,
      rate: Math.max(8, rate),
      eta: `${etaDate} Oct`,
      fit,
      suitable: isGood,
      status: suitability.label,
      statusTone: suitability.tone
    };
  });
}

/**
 * Evaluates a destination port under current simulated market parameters
 */
export function evaluatePort(origin, port, commodity, quantity, bunkerIndex, portCongestion) {
  const evaluatedVessels = evaluateVesselsForPort(origin, port, commodity, quantity, bunkerIndex, portCongestion);
  
  // Best vessel is the feasible vessel with lowest freight rate
  const suitableVessels = evaluatedVessels.filter(v => v.suitable).sort((a, b) => a.rate - b.rate);
  const bestVessel = suitableVessels[0] ?? null;

  // Waiting demurrage and tariff components
  const waitingCost = port.waitingDays * 0.42;
  const tariffCost = port.portCharge * 0.18;
  const baseFreight = bestVessel ? bestVessel.rate : calculateBaseFreightRate(origin, port.name, commodity, FLEET_CLASSES[2]);
  const deliveredCost = baseFreight + waitingCost + tariffCost;

  // Composite multi-factor port fit score (18 to 98)
  const score = Math.max(
    18,
    Math.min(
      98,
      Math.round(
        (bestVessel ? bestVessel.fit * 0.45 : 20)
        + (port.bulkHandling * 0.20)
        + ((100 - port.congestion) * 0.18)
        + Math.max(0, 20 - (port.waitingDays * 3))
        - (port.portCharge * 2)
      )
    )
  );

  // Operational risk exposure percentage (0 to 92%)
  const risk = Math.min(
    92,
    Math.round((port.congestion * 0.55) + (port.waitingDays * 4) + (bestVessel ? 7 : 25))
  );

  return {
    port,
    bestVessel,
    suitable: Boolean(bestVessel),
    score,
    deliveredCost,
    risk,
    status: bestVessel ? "Feasible" : "Constraint flagged"
  };
}

/**
 * Optimizes the overall fixture strategy and synthesizes explainable verdict
 */
export function optimizeStrategy(shipment, bunkerIndex, portCongestion) {
  const quantityNum = Number(String(shipment.quantity).replace(/,/g, "")) || 70000;
  const selectedPort = PORTS_BY_NAME[shipment.destination] || PORTS[0];

  // Evaluate selected port
  const selectedAssessment = evaluatePort(
    shipment.origin,
    selectedPort,
    shipment.commodity,
    quantityNum,
    bunkerIndex,
    portCongestion
  );

  // Evaluate all East Coast ports for benchmarking
  const allPortAssessments = PORTS.map(p => {
    const isSelected = p.name === selectedPort.name;
    return evaluatePort(
      shipment.origin,
      p,
      shipment.commodity,
      quantityNum,
      bunkerIndex,
      isSelected ? portCongestion : p.congestion
    );
  }).sort((a, b) => b.score - a.score);

  // Decision logic: If selected port is feasible, recommend it; otherwise divert to top feasible port
  const recommendedPort = selectedAssessment.suitable ? selectedPort : allPortAssessments[0].port;
  const primaryAssessment = allPortAssessments.find(a => a.port.name === recommendedPort.name) || selectedAssessment;
  const recommendedVessel = primaryAssessment.bestVessel;

  // Timing Signals: Early Cover vs Spot Optionality vs Balanced Cover
  const isHighPressure = (portCongestion > selectedPort.congestion + 24) || (bunkerIndex > 700);
  const isSoftMarket = (bunkerIndex < 580) && (portCongestion < 25);

  let timing = "Book 10–14 days out";
  let timingLabel = "Balanced cover";
  if (isHighPressure) {
    timing = "Book 21–28 days out";
    timingLabel = "Early cover";
  } else if (isSoftMarket) {
    timing = "Book 5–7 days out";
    timingLabel = "Spot optionality";
  }

  const deliveredRate = primaryAssessment.deliveredCost;
  const isPortDiverted = recommendedPort.name !== selectedPort.name;
  const riskScore = Math.min(96, primaryAssessment.risk + (isPortDiverted ? 5 : 0));
  const compositeScore = Math.max(32, Math.round(primaryAssessment.score - (isHighPressure ? 3 : 0)));

  // Explainable AI Verdict synthesis
  if (recommendedVessel) {
    const strategyTitle = isPortDiverted
      ? `Use ${recommendedPort.name} for the direct call`
      : `Charter ${recommendedVessel.className} via ${recommendedPort.name}`;

    const copy = isPortDiverted
      ? `${selectedPort.name} is constrained for this cargo. ${recommendedPort.name} preserves a feasible ${recommendedVessel.className} call with a lower combined waiting and draft risk.`
      : `${recommendedPort.name} is the strongest fit for this cargo and vessel size. Its bulk handling profile and reference draft keep the expected logistics cost in range.`;

    const reason = isPortDiverted
      ? `${selectedPort.name} is removed by the constraint check; ${recommendedPort.name} scores ${primaryAssessment.score}/100 on handling, draft fit, cost and simulated congestion.`
      : `${recommendedPort.name} supports the ${recommendedVessel.className} draft and capacity while keeping simulated waiting risk below the alternative ports.`;

    const strategyMessage = portCongestion > selectedPort.congestion + 24
      ? "Higher simulated congestion is increasing waiting exposure."
      : bunkerIndex > 700
      ? "Higher simulated bunker pressure favours earlier cover."
      : "The market is balanced enough to preserve a little optionality.";

    return {
      selectedPort,
      recommendedPort,
      selectedPortAssessment: selectedAssessment,
      recommendedVessel,
      timing,
      timingLabel,
      score: compositeScore,
      rate: deliveredRate,
      risk: riskScore,
      strategyTitle,
      strategyShort: timingLabel,
      copy,
      reason,
      strategyMessage,
      allPortAssessments
    };
  } else {
    // No vessel found feasible (extreme constraint)
    return {
      selectedPort,
      recommendedPort,
      selectedPortAssessment: selectedAssessment,
      recommendedVessel: null,
      timing,
      timingLabel,
      score: 31,
      rate: deliveredRate,
      risk: riskScore,
      strategyTitle: `No direct fit at ${selectedPort.name}`,
      strategyShort: "Constraint flagged",
      copy: `${selectedPort.name} cannot receive a ${quantityNum.toLocaleString()} MT ${shipment.commodity} stem with the current vessel and draft assumptions. Compare a smaller parcel or use an alternate port.`,
      reason: `The port's ${selectedPort.maxDraft.toFixed(1)} m reference draft and vessel restrictions remove every candidate from the direct-call shortlist.`,
      strategyMessage: "A port change is more important than a timing change for this scenario.",
      allPortAssessments
    };
  }
}

/**
 * Generates 7-month predictive corridor bar values matching Replit app
 */
export function calculate7MonthTrend(quantityNum, bunkerIndex, selectedPortCongestion, currentCongestion) {
  const quantityFactor = Math.max(0.78, Math.min(1.20, (quantityNum / 70000) || 0.78));
  const baseMonths = [44, 51, 57, 54, 63, 72, 69];

  return baseMonths.map((val, idx) => {
    const isNow = idx === 6;
    const bar = Math.min(
      94,
      Math.round(
        (val * quantityFactor) 
        + ((bunkerIndex - 612) * 0.12) 
        + (selectedPortCongestion * 0.06) 
        + (isNow ? currentCongestion * 0.08 : 0)
      )
    );
    return Math.max(15, bar);
  });
}

/**
 * Format currency with USD/INR conversion
 */
export function formatCurrencyValue(amountUsd, currency = "USD", isPerTon = true) {
  const isINR = currency === "INR";
  const rate = isINR ? INR_EXCHANGE_RATE : 1.0;
  const symbol = isINR ? "₹" : "$";
  const suffix = isPerTon ? (isINR ? " / टन" : " / metric ton") : "";
  const converted = amountUsd * rate;

  return {
    symbol,
    formatted: converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    suffix,
    raw: converted
  };
}

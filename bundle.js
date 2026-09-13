/**
 * StratCoast — Consolidated Standalone Production Bundle
 * Fully self-contained, zero-CORS runtime
 */
(function () {
  "use strict";

  // ==========================================
  // 1. DATA LAYER
  // ==========================================
  /**
 * StratCoast — AI Charter Strategy Optimizer & Maritime Intelligence
 * Reference datasets: East Coast India Ports, Fleet Classes, Distance Offsets & Commodities
 * Grounded on Ministry of Ports, Shipping and Waterways (MoPSW) & Port Authorities data
 */

// Available Origin Countries
const ORIGINS = [
  "Australia",
  "Indonesia",
  "Mozambique",
  "USA",
  "Russia"
];

// East Coast India Ports Dataset
const PORTS = [
  {
    name: "Paradip",
    state: "Odisha",
    code: "INPAR",
    portType: "Major deep-draft port",
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal"],
    maxDraft: 16.0,
    bulkHandling: 96,
    vesselTypes: ["Supramax", "Panamax", "Kamsarmax"],
    congestionLabel: "Low–Medium",
    congestion: 34,
    waitingDays: 1.5,
    portCharge: 2.6,
    remarks: "Strong dry-bulk infrastructure and a broad vessel window."
  },
  {
    name: "Dhamra",
    state: "Odisha",
    code: "INDHM",
    portType: "Deep-draft bulk port",
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal"],
    maxDraft: 17.0,
    bulkHandling: 94,
    vesselTypes: ["Panamax", "Kamsarmax", "Capesize"],
    congestionLabel: "Low–Medium",
    congestion: 29,
    waitingDays: 1.2,
    portCharge: 2.8,
    remarks: "Deep approach and strong dry-bulk fit for larger carriers."
  },
  {
    name: "Gopalpur",
    state: "Odisha",
    code: "INGOP",
    portType: "Bulk cargo port",
    cargoTypes: ["Iron Ore", "Steam Coal", "Limestone"],
    maxDraft: 14.5,
    bulkHandling: 78,
    vesselTypes: ["Handysize", "Supramax", "Panamax", "Kamsarmax"],
    congestionLabel: "Medium",
    congestion: 49,
    waitingDays: 2.2,
    portCharge: 2.4,
    remarks: "Bulk capable, with vessel choice more sensitive to draft."
  },
  {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    code: "INVTZ",
    portType: "Major multipurpose port",
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal", "Limestone"],
    maxDraft: 16.5,
    bulkHandling: 92,
    vesselTypes: ["Supramax", "Panamax", "Kamsarmax"],
    congestionLabel: "Medium",
    congestion: 46,
    waitingDays: 2.1,
    portCharge: 3.0,
    remarks: "Major East Coast gateway with strong mineral and coal handling."
  },
  {
    name: "Gangavaram",
    state: "Andhra Pradesh",
    code: "INGVV",
    portType: "Deep-water bulk port",
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal"],
    maxDraft: 18.0,
    bulkHandling: 95,
    vesselTypes: ["Panamax", "Kamsarmax", "Capesize"],
    congestionLabel: "Low–Medium",
    congestion: 31,
    waitingDays: 1.4,
    portCharge: 3.1,
    remarks: "Deep-water profile supports large dry-bulk carriers."
  },
  {
    name: "Kakinada",
    state: "Andhra Pradesh",
    code: "INKAK",
    portType: "Multi-product port",
    cargoTypes: ["Steam Coal", "Coking Coal", "Limestone"],
    maxDraft: 11.0,
    bulkHandling: 70,
    vesselTypes: ["Handysize", "Supramax"],
    congestionLabel: "Medium",
    congestion: 54,
    waitingDays: 2.8,
    portCharge: 2.2,
    remarks: "Bulk and agri gateway with tighter draft and size limits."
  },
  {
    name: "Krishnapatnam",
    state: "Andhra Pradesh",
    code: "INKRI",
    portType: "Deep-water private port",
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal", "Limestone"],
    maxDraft: 16.0,
    bulkHandling: 88,
    vesselTypes: ["Panamax", "Kamsarmax"],
    congestionLabel: "Low–Medium",
    congestion: 36,
    waitingDays: 1.7,
    portCharge: 2.9,
    remarks: "Deep-water option with useful bulk flexibility."
  },
  {
    name: "Haldia Dock Complex",
    state: "West Bengal",
    code: "INHAL",
    portType: "River / estuarine port system",
    cargoTypes: ["Coking Coal", "Steam Coal", "Limestone"],
    maxDraft: 9.5,
    bulkHandling: 72,
    vesselTypes: ["Handysize", "Supramax"],
    congestionLabel: "Medium–High",
    congestion: 68,
    waitingDays: 3.8,
    portCharge: 2.5,
    remarks: "Estuarine access makes draft and congestion important constraints."
  },
  {
    name: "Sagar-Sandheads",
    state: "West Bengal",
    code: "INSAG",
    portType: "Offshore / estuarine region",
    cargoTypes: ["Coking Coal", "Steam Coal", "Iron Ore"],
    maxDraft: 12.0,
    bulkHandling: 60,
    vesselTypes: ["Handysize", "Supramax"],
    congestionLabel: "Medium–High",
    congestion: 63,
    waitingDays: 3.4,
    portCharge: 2.1,
    remarks: "Separate Sagar region reference with offshore and draft constraints."
  }
];

// Ports Map indexed by name
const PORTS_BY_NAME = Object.fromEntries(PORTS.map(p => [p.name, p]));

// Bulk Fleet Classes
const FLEET_CLASSES = [
  {
    className: "Handysize",
    capacity: 40000,
    draft: 10.5,
    size: "38,000 DWT",
    availability: 78,
    rateFactor: 1.08,
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal", "Limestone"]
  },
  {
    className: "Supramax",
    capacity: 58000,
    draft: 12.5,
    size: "57,000 DWT",
    availability: 84,
    rateFactor: 0.98,
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal", "Limestone"]
  },
  {
    className: "Panamax",
    capacity: 75000,
    draft: 13.5,
    size: "74,000 DWT",
    availability: 76,
    rateFactor: 0.90,
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal"]
  },
  {
    className: "Kamsarmax",
    capacity: 82000,
    draft: 14.2,
    size: "81,000 DWT",
    availability: 66,
    rateFactor: 0.86,
    cargoTypes: ["Iron Ore", "Coking Coal", "Steam Coal"]
  },
  {
    className: "Capesize",
    capacity: 150000,
    draft: 16.8,
    size: "150,000 DWT",
    availability: 48,
    rateFactor: 0.72,
    cargoTypes: ["Iron Ore", "Coking Coal"]
  }
];

// Candidate Vessel Names (5 classes)
const CANDIDATE_VESSEL_NAMES = [
  "Eastern Horizon",
  "Coral Meridian",
  "Bay Navigator",
  "Odisha Star",
  "Coastal Resolve"
];

// Port Nautical Mile Deltas relative to Paradip benchmark
const PORT_DISTANCE_DELTAS = {
  "Paradip": 0,
  "Dhamra": 35,
  "Gopalpur": 220,
  "Visakhapatnam": 390,
  "Gangavaram": 415,
  "Kakinada": 470,
  "Krishnapatnam": 680,
  "Haldia Dock Complex": -130,
  "Sagar-Sandheads": -115
};

// Base Nautical Distance from Export Origins to Bay of Bengal benchmark
const ORIGIN_BASE_DISTANCES = {
  "Australia": 2700,
  "Indonesia": 1900,
  "Mozambique": 3500,
  "USA": 8500,
  "Russia": 6000
};

// Commodity Freight Multipliers
const COMMODITY_FACTORS = {
  "Iron Ore": 0.45,
  "Coking Coal": 0.80,
  "Steam Coal": 0.25,
  "Limestone": 0.10
};

// Initial Default Shipment Brief
const DEFAULT_SHIPMENT = {
  origin: "Australia",
  destination: "Paradip",
  commodity: "Iron Ore",
  quantity: "70,000",
  laycan: "14–24 Oct 2026"
};

// Default Simulation Constants
const DEFAULT_BUNKER_INDEX = 612; // USD/t VLSFO
const INR_EXCHANGE_RATE = 86.5;    // USD to INR conversion


  // ==========================================
  // 2. ENGINE LAYER
  // ==========================================
  /**
 * StratCoast — AI Charter Strategy Optimizer & Maritime Engine
 * Hydrographic Clearance, Delivered Cost Waterfall, Port Scoring & Explainable AI Engine
 */

// [import stripped]

/**
 * Calculates voyage distance in Nautical Miles (NM)
 */
function calculateVoyageDistance(origin, destination) {
  const base = ORIGIN_BASE_DISTANCES[origin] ?? 3000;
  const delta = PORT_DISTANCE_DELTAS[destination] ?? 0;
  return base + delta;
}

/**
 * Calculates base ocean freight rate in USD/t
 */
function calculateBaseFreightRate(origin, portName, commodity, vessel) {
  const distance = calculateVoyageDistance(origin, portName);
  const commodityFactor = COMMODITY_FACTORS[commodity] ?? 0.40;
  return 11.20 + (distance * 0.0022) + commodityFactor + vessel.rateFactor;
}

/**
 * Checks physical and operational vessel compatibility against a port & cargo
 */
function checkSuitability(vessel, port, commodity, quantity) {
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
function evaluateVesselsForPort(origin, port, commodity, quantity, bunkerIndex, portCongestion) {
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
function evaluatePort(origin, port, commodity, quantity, bunkerIndex, portCongestion) {
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
function optimizeStrategy(shipment, bunkerIndex, portCongestion) {
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
function calculate7MonthTrend(quantityNum, bunkerIndex, selectedPortCongestion, currentCongestion) {
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
function formatCurrencyValue(amountUsd, currency = "USD", isPerTon = true) {
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


  // ==========================================
  // 3. APPLICATION CONTROLLER
  // ==========================================
  /**
 * StratCoast — AI Charter Strategy Optimizer & Operations Cockpit
 * Main Application Controller & Reactive UI Orchestrator
 */

// [import stripped]

// [import stripped]

// Application State
const state = {
  origin: DEFAULT_SHIPMENT.origin,
  destination: DEFAULT_SHIPMENT.destination,
  commodity: DEFAULT_SHIPMENT.commodity,
  quantity: DEFAULT_SHIPMENT.quantity,
  bunkerIndex: DEFAULT_BUNKER_INDEX,
  congestion: 34,
  runCount: 1,
  currency: "USD", // "USD" | "INR"
  activeSection: "shipment"
};

// DOM Element References
const DOM = {
  // Inputs
  selectOrigin: document.getElementById("origin"),
  selectDest: document.getElementById("destination"),
  selectCommodity: document.getElementById("commodity"),
  inputQuantity: document.getElementById("quantity"),
  btnOptimize: document.getElementById("btn-optimize"),
  formRouteNote: document.getElementById("form-route-note"),

  // Route Strip
  textOriginCode: document.getElementById("text-origin-code"),
  textOriginName: document.getElementById("text-origin-name"),
  textDestCode: document.getElementById("text-destination-code"),
  textDestName: document.getElementById("text-destination-name"),

  // Topbar / Tools
  runEyebrow: document.getElementById("run-eyebrow"),
  btnToggleCurrency: document.getElementById("btn-toggle-currency"),
  currencyLabel: document.getElementById("currency-label"),
  btnToggleDensity: document.getElementById("btn-toggle-density"),
  btnExportDossier: document.getElementById("btn-export-dossier"),

  // Market Signals
  signalsCaption: document.getElementById("signals-caption"),
  forecastRateVal: document.getElementById("forecast-rate-val"),
  forecastRateSuffix: document.getElementById("forecast-rate-suffix"),
  forecastBarChart: document.getElementById("forecast-bar-chart"),
  forecastFloor: document.getElementById("forecast-floor-bound"),
  forecastMid: document.getElementById("forecast-mid-bound"),
  forecastCeil: document.getElementById("forecast-ceil-bound"),

  vesselAvailMetric: document.getElementById("vessel-avail-metric"),
  vesselAvailDetail: document.getElementById("vessel-avail-detail"),
  sparklineVessel: document.getElementById("sparkline-vessel"),

  portCongestionMetric: document.getElementById("port-congestion-metric"),
  portCongestionDetail: document.getElementById("port-congestion-detail"),
  sparklineCongestion: document.getElementById("sparkline-congestion"),

  bunkerIndexMetric: document.getElementById("bunker-index-metric"),
  sparklineBunker: document.getElementById("sparkline-bunker"),

  portFitMetric: document.getElementById("port-fit-metric"),
  portFitDetail: document.getElementById("port-fit-detail"),
  sparklineFit: document.getElementById("sparkline-fit"),

  // Tables
  vesselTableBody: document.getElementById("vessel-table-body"),
  portTableBody: document.getElementById("port-table-body"),

  // Strategy Desk
  timingFillNow: document.getElementById("timing-fill-now"),
  timingStatusNow: document.getElementById("timing-status-now"),
  timingFillMid: document.getElementById("timing-fill-mid"),
  timingStatusMid: document.getElementById("timing-status-mid"),
  timingFillLong: document.getElementById("timing-fill-long"),
  timingStatusLong: document.getElementById("timing-status-long"),

  textStrategyTitle: document.getElementById("text-strategy-title"),
  strategyTagPill: document.getElementById("strategy-tag-pill"),
  strategyTagText: document.getElementById("strategy-tag-text"),
  textStrategyExplanation: document.getElementById("text-strategy-explanation"),
  reasonWhyWins: document.getElementById("reason-why-wins"),
  reasonExposure: document.getElementById("reason-exposure"),

  // Simulator
  fuelRange: document.getElementById("fuel-range"),
  textFuelValue: document.getElementById("text-fuel-value"),
  congestionRange: document.getElementById("congestion-range"),
  textCongestionValue: document.getElementById("text-congestion-value"),
  textSimScore: document.getElementById("text-sim-score"),
  simScenarioLabel: document.getElementById("sim-scenario-label"),
  simCopyHeadline: document.getElementById("sim-copy-headline"),
  simCopyBody: document.getElementById("sim-copy-body"),
  presetChips: document.querySelectorAll(".preset-chip"),

  // Map & Footer
  mapNodes: document.querySelectorAll(".map-node"),
  footerAuditNote: document.getElementById("footer-audit-note"),
  railLinks: document.querySelectorAll(".rail-link")
};

/**
 * Initialize Dropdowns and Event Handlers
 */
function init() {
  // Populate Origin options
  DOM.selectOrigin.innerHTML = ORIGINS.map(
    o => `<option value="${o}" ${o === state.origin ? "selected" : ""}>${o}</option>`
  ).join("");

  // Populate Destination options
  DOM.selectDest.innerHTML = PORTS.map(
    p => `<option value="${p.name}" ${p.name === state.destination ? "selected" : ""}>${p.name}</option>`
  ).join("");

  // Set default port congestion from destination
  const defaultPort = PORTS_BY_NAME[state.destination] || PORTS[0];
  state.congestion = defaultPort.congestion;
  DOM.congestionRange.value = state.congestion;

  // Bind Form Listeners
  DOM.selectOrigin.addEventListener("change", e => {
    state.origin = e.target.value;
    updateApp();
  });

  DOM.selectDest.addEventListener("change", e => {
    state.destination = e.target.value;
    const p = PORTS_BY_NAME[state.destination];
    if (p) {
      state.congestion = p.congestion;
      DOM.congestionRange.value = p.congestion;
    }
    updateApp();
  });

  DOM.selectCommodity.addEventListener("change", e => {
    state.commodity = e.target.value;
    updateApp();
  });

  DOM.inputQuantity.addEventListener("input", e => {
    const clean = e.target.value.replace(/[^\d,]/g, "");
    state.quantity = clean;
    DOM.inputQuantity.value = clean;
    updateApp();
  });

  // Optimize Button Click
  DOM.btnOptimize.addEventListener("click", () => {
    state.runCount += 1;
    DOM.runEyebrow.textContent = `Decision workspace · run ${String(state.runCount).padStart(2, "0")}`;
    updateApp();

    // Visual pulse
    DOM.btnOptimize.style.transform = "scale(0.96)";
    setTimeout(() => {
      DOM.btnOptimize.style.transform = "";
    }, 150);
  });

  // What-If Simulator Sliders
  DOM.fuelRange.addEventListener("input", e => {
    state.bunkerIndex = Number(e.target.value);
    updateApp();
  });

  DOM.congestionRange.addEventListener("input", e => {
    state.congestion = Number(e.target.value);
    updateApp();
  });

  // Scenario Preset Chips
  DOM.presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      DOM.presetChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      if (chip.id === "preset-capesize") {
        state.quantity = "150,000";
        DOM.inputQuantity.value = "150,000";
        state.destination = "Gangavaram";
        DOM.selectDest.value = "Gangavaram";
        state.bunkerIndex = 612;
        state.congestion = 31;
      } else {
        const b = chip.getAttribute("data-bunker");
        const c = chip.getAttribute("data-congestion");
        if (b) state.bunkerIndex = Number(b);
        if (c) state.congestion = Number(c);
      }

      DOM.fuelRange.value = state.bunkerIndex;
      DOM.congestionRange.value = state.congestion;
      updateApp();
    });
  });

  // Interactive Corridor Map Node Click
  DOM.mapNodes.forEach(node => {
    node.addEventListener("click", () => {
      const portName = node.getAttribute("data-port");
      if (portName && PORTS_BY_NAME[portName]) {
        state.destination = portName;
        DOM.selectDest.value = portName;
        const p = PORTS_BY_NAME[portName];
        state.congestion = p.congestion;
        DOM.congestionRange.value = p.congestion;
        updateApp();

        // Smooth scroll to shipment card
        document.getElementById("shipment")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Topbar Currency Switch
  DOM.btnToggleCurrency.addEventListener("click", () => {
    state.currency = state.currency === "USD" ? "INR" : "USD";
    DOM.currencyLabel.textContent = state.currency === "USD" ? "$ USD" : "₹ INR";
    DOM.btnToggleCurrency.classList.toggle("active", state.currency === "INR");
    updateApp();
  });

  // Topbar Density Switch
  DOM.btnToggleDensity.addEventListener("click", () => {
    const isCompact = document.body.classList.toggle("compact-mode");
    DOM.btnToggleDensity.classList.toggle("active", isCompact);
    DOM.btnToggleDensity.querySelector("span").textContent = isCompact ? "Standard" : "Compact";
  });

  // Export Dossier
  DOM.btnExportDossier.addEventListener("click", () => {
    exportExecutiveDossier();
  });

  // Sidebar Rail Navigation Smooth Scrolling
  DOM.railLinks.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;

      DOM.railLinks.forEach(b => {
        b.classList.remove("active");
        const caret = b.querySelector(".rail-link-caret");
        if (caret) caret.style.display = "none";
      });
      btn.classList.add("active");
      const caret = btn.querySelector(".rail-link-caret");
      if (caret) caret.style.display = "";

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    });
  });

  // IntersectionObserver Scroll Spy to sync sidebar active state when scrolling
  if ("IntersectionObserver" in window) {
    const sectionIds = ["shipment", "signals", "strategy", "simulator", "corridor-map", "data-section"];
    const observerOptions = {
      root: null,
      rootMargin: "-90px 0px -60% 0px",
      threshold: 0.1
    };

    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          DOM.railLinks.forEach(btn => {
            const isMatch = btn.getAttribute("data-target") === id;
            btn.classList.toggle("active", isMatch);
            const caret = btn.querySelector(".rail-link-caret");
            if (caret) caret.style.display = isMatch ? "" : "none";
          });
        }
      });
    }, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) spyObserver.observe(el);
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    const key = e.key;
    if (key === "1") document.querySelector('.rail-link[data-target="shipment"]')?.click();
    if (key === "2") document.querySelector('.rail-link[data-target="signals"]')?.click();
    if (key === "3") document.querySelector('.rail-link[data-target="strategy"]')?.click();
    if (key === "4") document.querySelector('.rail-link[data-target="simulator"]')?.click();
    if (key === "5") document.querySelector('.rail-link[data-target="corridor-map"]')?.click();
    if (key.toLowerCase() === "r") DOM.btnOptimize.click();
  });

  // Initial Execution
  updateApp();
}

/**
 * Main Reactive Re-render Function
 */
function updateApp() {
  const quantityNum = Number(String(state.quantity).replace(/,/g, "")) || 70000;
  const selectedPort = PORTS_BY_NAME[state.destination] || PORTS[0];

  // Run Optimization Engine
  const strategy = optimizeStrategy(
    {
      origin: state.origin,
      destination: state.destination,
      commodity: state.commodity,
      quantity: state.quantity
    },
    state.bunkerIndex,
    state.congestion
  );

  // Evaluate candidate vessels for the selected port
  const candidateVessels = evaluateVesselsForPort(
    state.origin,
    selectedPort,
    state.commodity,
    quantityNum,
    state.bunkerIndex,
    state.congestion
  );

  // Update Route Strip & Form Note
  updateRouteStrip(selectedPort);

  // Update Market Signals Cards
  updateSignals(quantityNum, selectedPort, strategy);

  // Update Comparison Tables
  updateVesselTable(candidateVessels);
  updatePortTable(strategy.allPortAssessments);

  // Update Strategy Desk ("When to move" & Recommendation)
  updateStrategyDesk(strategy);

  // Update Simulator Sliders & Callout
  updateSimulator(strategy);

  // Update Corridor Map Highlighting
  updateCorridorMap(strategy);

  // Update Footer Audit Note
  DOM.footerAuditNote.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:middle;margin-right:5px;">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    Reference-grounded synthetic demo · no live market, vessel, or port data connected · last optimization used ${quantityNum.toLocaleString()} MT from ${state.origin} to ${state.destination}
  `;
}

/**
 * Updates Route Strip and Guidance Text
 */
function updateRouteStrip(port) {
  const originCode = state.origin.slice(0, 3).toUpperCase();
  DOM.textOriginCode.textContent = originCode;
  DOM.textOriginName.textContent = state.origin;
  DOM.textDestCode.textContent = port.code;
  DOM.textDestName.textContent = port.name;

  DOM.formRouteNote.innerHTML = `
    Reference route: <strong>${state.origin} → ${port.name}</strong> · ${port.state} · ${port.maxDraft.toFixed(1)} m reference draft · editable demo assumptions.
  `;
}

/**
 * Updates 02 Market Signals
 */
function updateSignals(quantityNum, selectedPort, strategy) {
  DOM.signalsCaption.textContent = `Reference-grounded route indicators for ${quantityNum.toLocaleString()} MT. All numeric market values are simulated.`;

  // 1. Freight Forecast Metric
  const formattedRate = formatCurrencyValue(strategy.rate, state.currency, true);
  DOM.forecastRateVal.textContent = `${formattedRate.symbol}${formattedRate.formatted}`;
  DOM.forecastRateSuffix.textContent = formattedRate.suffix;

  // 7-Month Predictive Trend Bars
  const bars = calculate7MonthTrend(quantityNum, state.bunkerIndex, selectedPort.congestion, state.congestion);
  const months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOW"];
  DOM.forecastBarChart.innerHTML = bars.map((val, idx) => {
    const isCurrent = idx === 6;
    return `
      <div class="bar-wrap">
        <div class="bar ${isCurrent ? "current" : ""}" style="height: ${val}%;" title="${months[idx]}: ${val}% corridor"></div>
        <span class="bar-month">${months[idx]}</span>
      </div>
    `;
  }).join("");

  const floorVal = formatCurrencyValue(16.80, state.currency, false);
  const ceilVal = formatCurrencyValue(25.40, state.currency, false);
  DOM.forecastFloor.textContent = `Floor ${floorVal.symbol}${floorVal.formatted}`;
  DOM.forecastMid.textContent = `Route case ${formattedRate.symbol}${formattedRate.formatted}`;
  DOM.forecastCeil.textContent = `Ceiling ${ceilVal.symbol}${ceilVal.formatted}`;

  // 2. Vessel Availability
  const vesselClass = strategy.recommendedVessel ? strategy.recommendedVessel.className : "No direct fit";
  const vesselAvail = strategy.recommendedVessel ? strategy.recommendedVessel.availability : 0;
  DOM.vesselAvailMetric.innerHTML = `${vesselAvail} <span class="metric-suffix">index</span>`;
  DOM.vesselAvailDetail.innerHTML = `${vesselClass}<br />reference open-tonnage signal`;

  // 3. Port Congestion
  DOM.portCongestionMetric.innerHTML = `${state.congestion} <span class="metric-suffix">/ 100</span>`;
  DOM.portCongestionDetail.innerHTML = `${selectedPort.congestionLabel}<br />simulated at ${selectedPort.name}`;
  DOM.sparklineCongestion.children[0].style.height = `${Math.max(20, 100 - state.congestion)}%`;

  // 4. Bunker Index
  DOM.bunkerIndexMetric.innerHTML = `${state.bunkerIndex} <span class="metric-suffix">USD/t</span>`;

  // 5. Port Fit
  const portScore = strategy.selectedPortAssessment.score;
  const portStatus = strategy.selectedPortAssessment.status;
  DOM.portFitMetric.innerHTML = `${portScore} <span class="metric-suffix">/ 100</span>`;
  DOM.portFitDetail.innerHTML = `${portStatus}<br />cargo + draft check`;
}

/**
 * Updates Candidate Vessels Table
 */
function updateVesselTable(candidateVessels) {
  DOM.vesselTableBody.innerHTML = candidateVessels.map((v, idx) => {
    const rateFormatted = formatCurrencyValue(v.rate, state.currency, false);
    const badgeHtml = v.suitable
      ? `<span class="best-badge">Suitable</span>`
      : `<span class="table-value muted">${v.status}</span>`;

    return `
      <tr data-testid="row-vessel-${idx}">
        <td>
          <div class="vessel-name">
            <span class="vessel-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
            </span>
            <span>
              ${v.name}
              <span class="vessel-sub">${v.className}</span>
            </span>
          </div>
        </td>
        <td class="table-value muted">${v.capacity.toLocaleString()} T · ${v.draft.toFixed(1)} m</td>
        <td class="table-value">${rateFormatted.symbol}${rateFormatted.formatted}/t</td>
        <td class="table-value">${v.eta}</td>
        <td class="table-value">${v.fit}%</td>
        <td>${badgeHtml}</td>
      </tr>
    `;
  }).join("");
}

/**
 * Updates East Coast Destinations Benchmarking Table
 */
function updatePortTable(portAssessments) {
  const topPorts = portAssessments.slice(0, 6);

  DOM.portTableBody.innerHTML = topPorts.map(p => {
    const costFormatted = formatCurrencyValue(p.deliveredCost, state.currency, false);
    const isSelected = p.port.name === state.destination;

    let badgeHtml = "";
    if (isSelected) {
      badgeHtml = `<span class="best-badge">Selected · ${p.score}</span>`;
    } else if (p.suitable) {
      badgeHtml = `<span class="table-value muted">${p.score}/100</span>`;
    } else {
      badgeHtml = `<span class="table-value muted">Constraint flagged</span>`;
    }

    return `
      <tr data-testid="row-port-${p.port.name}" class="${isSelected ? "row-selected" : ""}">
        <td>
          <div class="vessel-name">
            <span class="vessel-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><path d="M12 2L2 7l10 5 10-5-10-5z"/>
              </svg>
            </span>
            <span>
              ${p.port.name}
              <span class="vessel-sub">${p.port.remarks}</span>
            </span>
          </div>
        </td>
        <td class="table-value muted">${p.port.state} · ${p.port.portType}</td>
        <td class="table-value">${p.port.maxDraft.toFixed(1)} m</td>
        <td class="table-value">${p.port.waitingDays.toFixed(1)} d</td>
        <td class="table-value">${costFormatted.symbol}${costFormatted.formatted}/t</td>
        <td>${badgeHtml}</td>
      </tr>
    `;
  }).join("");

  // Allow clicking on any destination row to quickly pivot to that port
  DOM.portTableBody.querySelectorAll("tr").forEach((row, i) => {
    row.addEventListener("click", () => {
      const portName = topPorts[i].port.name;
      if (portName !== state.destination) {
        state.destination = portName;
        DOM.selectDest.value = portName;
        state.congestion = topPorts[i].port.congestion;
        DOM.congestionRange.value = state.congestion;
        updateApp();
      }
    });
  });
}

/**
 * Updates 03 Strategy Desk ("When to move" & Explainable Verdict)
 */
function updateStrategyDesk(strategy) {
  // Timing Probability Bars
  if (strategy.timingLabel === "Spot optionality") {
    DOM.timingFillNow.style.width = "76%";
    DOM.timingStatusNow.textContent = "soft market option";
    DOM.timingFillMid.style.width = "62%";
    DOM.timingFillLong.style.width = "48%";
  } else if (strategy.timingLabel === "Early cover") {
    DOM.timingFillNow.style.width = "38%";
    DOM.timingStatusNow.textContent = "rate floor forming";
    DOM.timingFillMid.style.width = "65%";
    DOM.timingFillLong.style.width = "86%";
    DOM.timingStatusLong.textContent = "priority lock-in";
  } else {
    // Balanced cover
    DOM.timingFillNow.style.width = "43%";
    DOM.timingStatusNow.textContent = "rate floor forming";
    DOM.timingFillMid.style.width = "82%";
    DOM.timingStatusMid.textContent = "best balance";
    DOM.timingFillLong.style.width = "56%";
    DOM.timingStatusLong.textContent = "premium for certainty";
  }

  // Explainable Recommendation Card
  DOM.textStrategyTitle.textContent = strategy.strategyTitle;
  DOM.strategyTagText.textContent = `${strategy.strategyShort} · ${strategy.score}/100 fit · ${strategy.risk}% risk`;
  DOM.textStrategyExplanation.textContent = strategy.copy;
  DOM.reasonWhyWins.textContent = strategy.reason;

  const costFormatted = formatCurrencyValue(strategy.rate, state.currency, false);
  DOM.reasonExposure.textContent = `${costFormatted.symbol}${costFormatted.formatted} / t delivered estimate · ${strategy.timing} · ${strategy.strategyMessage}`;
}

/**
 * Updates What-If Simulator range slider progress and score
 */
function updateSimulator(strategy) {
  // Fuel Range progress gradient
  const fuelProgress = ((state.bunkerIndex - 540) / (760 - 540)) * 100;
  DOM.fuelRange.style.setProperty("--range-progress", `${fuelProgress}%`);
  DOM.textFuelValue.textContent = `${state.bunkerIndex} USD/t`;

  // Congestion Range progress gradient
  const congProgress = state.congestion;
  DOM.congestionRange.style.setProperty("--range-progress", `${congProgress}%`);
  DOM.textCongestionValue.textContent = `${state.congestion} / 100`;

  // Circular Score Badge & Context Copy
  DOM.textSimScore.textContent = strategy.score;
  DOM.simScenarioLabel.textContent = `Selected scenario: ${strategy.strategyShort}`;
  DOM.simCopyHeadline.textContent = `${strategy.strategyTitle}.`;
  DOM.simCopyBody.textContent = ` ${strategy.strategyMessage} Use this signal as a conversation starter, not a live quote.`;
}

/**
 * Updates Interactive Maritime Map Highlighting
 */
function updateCorridorMap(strategy) {
  DOM.mapNodes.forEach(node => {
    const portName = node.getAttribute("data-port");
    const circle = node.querySelector("circle:last-of-type");
    const text = node.querySelector("text");
    if (!circle || !text) return;

    if (portName === state.destination) {
      circle.setAttribute("fill", "#f1a432");
      circle.setAttribute("r", "8");
      text.setAttribute("fill", "#f1a432");
      text.setAttribute("font-weight", "800");
    } else if (portName === strategy.recommendedPort.name && strategy.recommendedPort.name !== state.destination) {
      circle.setAttribute("fill", "#31aa7e");
      circle.setAttribute("r", "7.5");
      text.setAttribute("fill", "#31aa7e");
      text.setAttribute("font-weight", "800");
    } else {
      circle.setAttribute("fill", "#167b88");
      circle.setAttribute("r", "5.5");
      text.setAttribute("fill", "#a0b3c0");
      text.setAttribute("font-weight", "500");
    }
  });
}

/**
 * Export Executive Fixture Briefing (JSON)
 */
function exportExecutiveDossier() {
  const strategy = optimizeStrategy(
    {
      origin: state.origin,
      destination: state.destination,
      commodity: state.commodity,
      quantity: state.quantity
    },
    state.bunkerIndex,
    state.congestion
  );

  const dossier = {
    platform: "StratCoast AI Charter Strategy Optimizer",
    generatedAt: new Date().toISOString(),
    runId: `RUN-${String(state.runCount).padStart(2, "0")}`,
    shipment: {
      origin: state.origin,
      destination: state.destination,
      commodity: state.commodity,
      quantityMt: Number(String(state.quantity).replace(/,/g, "")) || 70000,
      laycan: "14–24 Oct 2026"
    },
    simulatedAssumptions: {
      bunkerIndexUsdPerTon: state.bunkerIndex,
      simulatedPortCongestion: state.congestion
    },
    executiveVerdict: {
      recommendation: strategy.strategyTitle,
      strategyMode: strategy.strategyShort,
      timingWindow: strategy.timing,
      fitScore: strategy.score,
      riskExposurePercent: strategy.risk,
      deliveredRateUsd: strategy.rate,
      whyThisWins: strategy.reason,
      operationalTradeoff: strategy.copy
    },
    recommendedVessel: strategy.recommendedVessel
      ? {
          class: strategy.recommendedVessel.className,
          capacityDwt: strategy.recommendedVessel.capacity,
          designDraftM: strategy.recommendedVessel.draft,
          indicativeRateUsd: strategy.recommendedVessel.rate
        }
      : null
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossier, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `StratCoast-Fixture-Brief-${state.destination}-${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Kick off when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();

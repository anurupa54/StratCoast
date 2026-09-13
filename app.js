/**
 * StratCoast — AI Charter Strategy Optimizer & Operations Cockpit
 * Main Application Controller & Reactive UI Orchestrator
 */

import {
  ORIGINS,
  PORTS,
  PORTS_BY_NAME,
  DEFAULT_SHIPMENT,
  DEFAULT_BUNKER_INDEX,
  INR_EXCHANGE_RATE
} from "./data.js";

import {
  calculateVoyageDistance,
  evaluateVesselsForPort,
  evaluatePort,
  optimizeStrategy,
  calculate7MonthTrend,
  formatCurrencyValue
} from "./engine.js";

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

/**
 * StratCoast - Maritime Visual Analytics & Charting Components
 * Pure SVG & HTML5 Canvas high-density analytical renderers.
 */

import { PORTS, PORTS_BY_NAME } from "./data.js";

/**
 * Renders the East Coast India Maritime Corridor Map
 */
export function renderMaritimeMap(containerId, activeDestination, recommendedPortName, onPortClick) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Normalized coordinate projection for East Coast India (Lat 13.5°N - 23°N, Lng 79.5°E - 89°E)
  const minLat = 13.5, maxLat = 22.8;
  const minLng = 79.5, maxLng = 88.8;
  const width = 540, height = 480;

  function project(lat, lng) {
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 120) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 80) + 40;
    return { x: Math.round(x), y: Math.round(y) };
  }

  // Coastline approximation points along East Coast India
  const coastPoints = [
    project(22.8, 88.6),
    project(22.0, 88.1), // Haldia
    project(21.6, 88.0), // Sagar
    project(21.2, 87.1),
    project(20.8, 87.0), // Dhamra
    project(20.2, 86.7), // Paradip
    project(19.8, 85.8),
    project(19.3, 85.0), // Gopalpur
    project(18.5, 84.1),
    project(17.7, 83.3), // Vizag / Gangavaram
    project(17.0, 82.3), // Kakinada
    project(16.2, 81.5),
    project(15.5, 80.4),
    project(14.3, 80.1), // Krishnapatnam
    project(13.5, 80.2)  // Chennai south
  ];

  const coastPathD = coastPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  // Land fill polygon
  const landPathD = `${coastPathD} L 0,${height} L 0,0 L ${coastPoints[0].x},0 Z`;

  // Shipping lane approach vector from ocean into selected/recommended port
  const targetPort = PORTS_BY_NAME[activeDestination] || PORTS[0];
  const targetCoord = project(targetPort.lat, targetPort.lng);

  const oceanApproachStart = { x: width - 20, y: height - 60 };
  const oceanApproachMid = { x: width - 110, y: targetCoord.y + 50 };

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" class="maritime-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="East Coast India Maritime Corridor Chart">
      <defs>
        <!-- Gradients -->
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#091322" />
          <stop offset="60%" stop-color="#0b1a2f" />
          <stop offset="100%" stop-color="#0e233f" />
        </linearGradient>

        <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d1522" />
          <stop offset="100%" stop-color="#141e30" />
        </linearGradient>

        <linearGradient id="routeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="1" />
        </linearGradient>

        <!-- Filters -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Ocean Background (Bay of Bengal) -->
      <rect width="${width}" height="${height}" fill="url(#oceanGrad)" />

      <!-- Depth Grid Lines -->
      <g class="depth-grid" stroke="rgba(56, 189, 248, 0.05)" stroke-width="1" stroke-dasharray="2 4">
        <line x1="120" y1="0" x2="120" y2="${height}" />
        <line x1="240" y1="0" x2="240" y2="${height}" />
        <line x1="360" y1="0" x2="360" y2="${height}" />
        <line x1="480" y1="0" x2="480" y2="${height}" />
        <line x1="0" y1="120" x2="${width}" y2="120" />
        <line x1="0" y1="240" x2="${width}" y2="240" />
        <line x1="0" y1="360" x2="${width}" y2="360" />
      </g>

      <!-- Landmass (Indian Subcontinent) -->
      <path d="${landPathD}" fill="url(#landGrad)" stroke="#1e293b" stroke-width="1.5" />

      <!-- Coastline Glow -->
      <path d="${coastPathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.4" filter="url(#glow)" />
      <path d="${coastPathD}" fill="none" stroke="#60a5fa" stroke-width="1.2" />

      <!-- Bay of Bengal Label -->
      <text x="${width - 130}" y="140" fill="rgba(148, 163, 184, 0.25)" font-size="13" font-weight="700" letter-spacing="4" text-anchor="middle">
        BAY OF BENGAL
      </text>
      <text x="${width - 130}" y="160" fill="rgba(56, 189, 248, 0.25)" font-size="9" font-family="monospace" letter-spacing="2" text-anchor="middle">
        DEEP DRAFT MARITIME CORRIDOR
      </text>

      <!-- Shipping Lane Track -->
      <path d="M ${oceanApproachStart.x},${oceanApproachStart.y} Q ${oceanApproachMid.x},${oceanApproachMid.y} ${targetCoord.x},${targetCoord.y}"
            fill="none"
            stroke="url(#routeGrad)"
            stroke-width="2.5"
            stroke-dasharray="6 4"
            class="animated-shipping-lane" />

      <!-- Active Approach Indicator Dot -->
      <circle cx="${oceanApproachStart.x}" cy="${oceanApproachStart.y}" r="4" fill="#38bdf8" filter="url(#glow)" />
      <text x="${oceanApproachStart.x - 8}" y="${oceanApproachStart.y + 16}" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="end">
        INBOUND CORRIDOR
      </text>

      <!-- Port Nodes -->
      <g class="port-nodes">
        ${PORTS.map(p => {
          const pt = project(p.lat, p.lng);
          const isSelected = p.name === activeDestination;
          const isRecommended = p.name === recommendedPortName;

          // Congestion color
          let congColor = "#10b981"; // green
          if (p.congestion > 55) congColor = "#f43f5e"; // red
          else if (p.congestion > 35) congColor = "#f59e0b"; // amber

          const radius = isSelected ? 8 : (isRecommended ? 7 : 5);
          const textAnchor = pt.x > width / 2 ? "end" : "start";
          const labelOffsetX = pt.x > width / 2 ? -12 : 12;

          return `
            <g class="port-marker-group" data-port="${p.name}" style="cursor: pointer;">
              <!-- Pulsing Congestion Halo -->
              <circle cx="${pt.x}" cy="${pt.y}" r="${radius + 5}" fill="${congColor}" fill-opacity="${isSelected ? '0.35' : '0.18'}" class="pulse-ring" />
              
              <!-- Selection Highlight Ring -->
              ${isSelected ? `<circle cx="${pt.x}" cy="${pt.y}" r="${radius + 3}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 2" />` : ''}
              ${isRecommended && !isSelected ? `<circle cx="${pt.x}" cy="${pt.y}" r="${radius + 3}" fill="none" stroke="#10b981" stroke-width="1.8" />` : ''}

              <!-- Core Node Circle -->
              <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${isSelected ? '#38bdf8' : (isRecommended ? '#10b981' : '#1e293b')}" stroke="${congColor}" stroke-width="2" />

              <!-- Port Name and Draft Tag -->
              <g transform="translate(${pt.x + labelOffsetX}, ${pt.y - 2})">
                <rect x="${textAnchor === 'end' ? -100 : 0}" y="-11" width="100" height="22" rx="3" fill="rgba(15, 23, 42, 0.85)" stroke="${isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.15)'}" stroke-width="1" />
                <text x="${textAnchor === 'end' ? -6 : 6}" y="0" fill="${isSelected ? '#38bdf8' : (isRecommended ? '#10b981' : '#f1f5f9')}" font-size="10" font-weight="600" text-anchor="${textAnchor}" dominant-baseline="central">
                  ${p.name}
                </text>
                <text x="${textAnchor === 'end' ? -6 : 6}" y="8" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="${textAnchor}" dominant-baseline="central">
                  ${p.maxDraft}m · ${p.waitingDays}d
                </text>
              </g>
            </g>
          `;
        }).join("")}
      </g>
    </svg>
  `;

  container.innerHTML = svg;

  // Add click events to port markers
  container.querySelectorAll(".port-marker-group").forEach(el => {
    el.addEventListener("click", () => {
      const portName = el.getAttribute("data-port");
      if (portName && onPortClick) {
        onPortClick(portName);
      }
    });
  });
}

/**
 * Renders the 2D Sensitivity Heatmap Grid
 */
export function renderSensitivityHeatmap(containerId, matrixData, currentBunker, currentCongestion) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const bunkerHeaders = [540, 590, 640, 690, 740];

  const html = `
    <div class="sensitivity-heatmap-wrap">
      <div class="heatmap-legend">
        <span class="legend-item"><span class="legend-box level-opt"></span> Optimal (< $18.50)</span>
        <span class="legend-item"><span class="legend-box level-mid"></span> Moderate ($18.50 - $22.50)</span>
        <span class="legend-item"><span class="legend-box level-high"></span> Elevated ($22.50 - $26.00)</span>
        <span class="legend-item"><span class="legend-box level-crit"></span> Severe (> $26.00)</span>
        <span class="legend-current"><span class="current-indicator-dot"></span> Active Parameter</span>
      </div>

      <table class="heatmap-table" role="grid" aria-label="Bunker vs Congestion Delivered Cost Sensitivity Grid">
        <thead>
          <tr>
            <th class="heatmap-corner" scope="col">
              <span class="axis-y">Congestion ↓</span>
              <span class="axis-x">Bunker ($/t) →</span>
            </th>
            ${bunkerHeaders.map(b => `<th scope="col" class="${Math.abs(currentBunker - b) < 25 ? 'col-active' : ''}">${b}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${matrixData.map(row => {
            const isRowActive = Math.abs(currentCongestion - row.congestion) < 10;
            return `
              <tr>
                <th scope="row" class="row-header ${isRowActive ? 'row-active' : ''}">
                  ${row.congestion}%
                </th>
                ${row.cells.map(cell => {
                  const isCellActive = isRowActive && Math.abs(currentBunker - cell.bunker) < 25;
                  
                  // Color level class
                  let levelClass = "level-opt";
                  if (cell.rate > 26.0) levelClass = "level-crit";
                  else if (cell.rate > 22.5) levelClass = "level-high";
                  else if (cell.rate > 18.5) levelClass = "level-mid";

                  return `
                    <td class="heatmap-cell ${levelClass} ${isCellActive ? 'cell-active-crosshair' : ''}" 
                        title="Bunker: $${cell.bunker}/t | Congestion: ${cell.congestion}% | Delivered: $${cell.rate}/t | Risk: ${cell.risk}% | Recommended: ${cell.vessel}">
                      <div class="cell-rate">$${cell.rate.toFixed(2)}</div>
                      <div class="cell-meta">${cell.vessel} · ${cell.risk}%</div>
                      ${isCellActive ? `<div class="active-badge-dot"></div>` : ''}
                    </td>
                  `;
                }).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renders the 7-Day Freight Forecast Corridor Line Chart
 */
export function renderForecastChart(containerId, forecastSeries) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = 480, height = 180;
  const padLeft = 45, padRight = 20, padTop = 20, padBottom = 30;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Extract min and max values
  let minVal = Infinity, maxVal = -Infinity;
  forecastSeries.forEach(d => {
    if (d.floor < minVal) minVal = d.floor;
    if (d.ceiling > maxVal) maxVal = d.ceiling;
  });

  // Give 5% padding to scale
  const range = (maxVal - minVal) || 1;
  const domainMin = Math.floor(minVal - range * 0.05);
  const domainMax = Math.ceil(maxVal + range * 0.05);

  function getX(index) {
    return padLeft + (index / (forecastSeries.length - 1)) * chartWidth;
  }

  function getY(val) {
    return padTop + chartHeight - ((val - domainMin) / (domainMax - domainMin)) * chartHeight;
  }

  // Generate Area Path for Floor to Ceiling Band
  const topPoints = forecastSeries.map((d, i) => `${getX(i)},${getY(d.ceiling)}`);
  const bottomPoints = forecastSeries.slice().reverse().map((d, i) => {
    const revIdx = forecastSeries.length - 1 - i;
    return `${getX(revIdx)},${getY(d.floor)}`;
  });
  const bandPathD = `M ${topPoints[0]} L ${topPoints.join(" L ")} L ${bottomPoints.join(" L ")} Z`;

  // Midline path
  const midPoints = forecastSeries.map((d, i) => `${getX(i)},${getY(d.mid)}`);
  const midLineD = `M ${midPoints.join(" L ")}`;

  // Active "Today (Fix)" day index (index 3)
  const fixIndex = 3;
  const fixX = getX(fixIndex);

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" class="forecast-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.04" />
        </linearGradient>
      </defs>

      <!-- Horizontal grid lines -->
      <g class="forecast-grid" stroke="rgba(148, 163, 184, 0.1)" stroke-width="1">
        <line x1="${padLeft}" y1="${getY(domainMin)}" x2="${width - padRight}" y2="${getY(domainMin)}" />
        <line x1="${padLeft}" y1="${getY((domainMin + domainMax) / 2)}" x2="${width - padRight}" y2="${getY((domainMin + domainMax) / 2)}" />
        <line x1="${padLeft}" y1="${getY(domainMax)}" x2="${width - padRight}" y2="${getY(domainMax)}" />
      </g>

      <!-- Y Axis Labels -->
      <text x="${padLeft - 8}" y="${getY(domainMin)}" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end" dominant-baseline="central">
        $${domainMin.toFixed(1)}
      </text>
      <text x="${padLeft - 8}" y="${getY((domainMin + domainMax) / 2)}" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end" dominant-baseline="central">
        $${((domainMin + domainMax) / 2).toFixed(1)}
      </text>
      <text x="${padLeft - 8}" y="${getY(domainMax)}" fill="#64748b" font-size="9" font-family="monospace" text-anchor="end" dominant-baseline="central">
        $${domainMax.toFixed(1)}
      </text>

      <!-- Shaded Confidence Band -->
      <path d="${bandPathD}" fill="url(#bandGrad)" />

      <!-- Floor & Ceiling Border Lines -->
      <path d="M ${topPoints.join(" L ")}" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.6" />
      <path d="M ${forecastSeries.map((d, i) => `${getX(i)},${getY(d.floor)}`).join(" L ")}" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.6" />

      <!-- Midline (Expected Route Case) -->
      <path d="${midLineD}" fill="none" stroke="#38bdf8" stroke-width="2.2" />

      <!-- Today Fix Vertical Marker -->
      <line x1="${fixX}" y1="${padTop}" x2="${fixX}" y2="${height - padBottom}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3" />
      <text x="${fixX}" y="${padTop - 6}" fill="#10b981" font-size="8" font-family="monospace" font-weight="700" text-anchor="middle">
        FIX WINDOW
      </text>

      <!-- Data Circles -->
      ${forecastSeries.map((d, i) => {
        const x = getX(i);
        const y = getY(d.mid);
        const isFix = i === fixIndex;
        return `
          <g class="data-point">
            <circle cx="${x}" cy="${y}" r="${isFix ? 5 : 3.5}" fill="${isFix ? '#10b981' : '#0f172a'}" stroke="${isFix ? '#10b981' : '#38bdf8'}" stroke-width="2" />
            <text x="${x}" y="${height - padBottom + 14}" fill="${isFix ? '#10b981' : '#94a3b8'}" font-size="8" font-weight="${isFix ? '700' : '500'}" font-family="monospace" text-anchor="middle">
              ${d.day.replace("Day ", "D")}
            </text>
          </g>
        `;
      }).join("")}
    </svg>
  `;

  container.innerHTML = svg;
}

/**
 * Renders the Delivered Cost Waterfall Breakdown Progress Bar
 */
export function renderCostWaterfall(containerId, costBreakdown) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const total = costBreakdown.deliveredCostPerTon || 20;
  const seaPct = ((costBreakdown.seaFreightPerTon / total) * 100).toFixed(1);
  const bunkerPct = ((costBreakdown.bunkerSurchargePerTon / total) * 100).toFixed(1);
  const portPct = ((costBreakdown.portChargesPerTon / total) * 100).toFixed(1);
  const demurragePct = ((costBreakdown.demurragePerTon / total) * 100).toFixed(1);

  const html = `
    <div class="waterfall-component">
      <div class="waterfall-bar-track">
        <div class="waterfall-segment seg-freight" style="width: ${seaPct}%" title="Base Ocean Freight: $${costBreakdown.seaFreightPerTon.toFixed(2)}/t (${seaPct}%)"></div>
        <div class="waterfall-segment seg-bunker" style="width: ${bunkerPct}%" title="Bunker Adjustment: $${costBreakdown.bunkerSurchargePerTon.toFixed(2)}/t (${bunkerPct}%)"></div>
        <div class="waterfall-segment seg-port" style="width: ${portPct}%" title="Port Disbursements: $${costBreakdown.portChargesPerTon.toFixed(2)}/t (${portPct}%)"></div>
        <div class="waterfall-segment seg-demurrage" style="width: ${demurragePct}%" title="Demurrage Exposure: $${costBreakdown.demurragePerTon.toFixed(2)}/t (${demurragePct}%)"></div>
      </div>

      <div class="waterfall-legend-grid">
        <div class="waterfall-col">
          <div class="wf-dot-label">
            <span class="wf-dot dot-freight"></span> Ocean Freight
          </div>
          <div class="wf-value">$${costBreakdown.seaFreightPerTon.toFixed(2)}/t</div>
          <div class="wf-pct">${seaPct}% of total</div>
        </div>

        <div class="waterfall-col">
          <div class="wf-dot-label">
            <span class="wf-dot dot-bunker"></span> Fuel Delta
          </div>
          <div class="wf-value">$${costBreakdown.bunkerSurchargePerTon.toFixed(2)}/t</div>
          <div class="wf-pct">${bunkerPct}% of total</div>
        </div>

        <div class="waterfall-col">
          <div class="wf-dot-label">
            <span class="wf-dot dot-port"></span> Port Tariffs
          </div>
          <div class="wf-value">$${costBreakdown.portChargesPerTon.toFixed(2)}/t</div>
          <div class="wf-pct">${portPct}% of total</div>
        </div>

        <div class="waterfall-col">
          <div class="wf-dot-label">
            <span class="wf-dot dot-demurrage"></span> Turnaround/Wait
          </div>
          <div class="wf-value">$${costBreakdown.demurragePerTon.toFixed(2)}/t</div>
          <div class="wf-pct">${demurragePct}% of total</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

# StratCoast — AI Charter Strategy Optimizer & Maritime Operations Cockpit

A high-fidelity, enterprise-grade remake of the **AI Charter Strategy Optimizer** ([ai-charter-strategy-optimizer-1--mook17429.replit.app](https://ai-charter-strategy-optimizer-1--mook17429.replit.app/)) engineered for dry-bulk chartering desks and maritime logistics operations in the **East Coast India corridor** (Bay of Bengal).

---

## 🚢 Core Capabilities & Workspaces

### 1. Shipment Intake & Dynamic Route Vector (`01`)
- **Intake Controls**: Origin Country (Australia, Indonesia, Mozambique, USA, Russia), Destination Port (Paradip, Dhamra, Gopalpur, Visakhapatnam, Gangavaram, Kakinada, Krishnapatnam, Haldia Dock Complex, Sagar-Sandheads), Commodity (Iron Ore, Coking Coal, Steam Coal, Limestone), and Quantity in MT.
- **Dynamic Route Strip**: Displays origin airport/seaport code, destination port code, and real-time nautical transit guidance.
- **Run Counter**: Increments with each optimization run (`Decision workspace · run 01`).

### 2. Real-Time Market Signals (`02`)
- **Freight Forecast Card**: Landed freight rate per MT, delta indicator, dynamic 7-month trend bar chart (MAY through NOW) with month highlight, and floor/ceiling confidence corridor.
- **Vessel Availability Card**: Open-tonnage index with class callout and dynamic sparklines.
- **Port Congestion Card**: Simulated congestion score (0–100) with status label and queue sparkline.
- **Bunker Index Card**: Synthetic VLSFO fuel index ($/t) and cost impact telemetry.
- **Port Fit Card**: Hydrographic and cargo compatibility score (0–100) with status badge.

### 3. Vessel & Port Benchmarking Comparison
- **Candidate Vessel Matrix**: Evaluates Handysize (38k DWT), Supramax (57k DWT), Panamax (74k DWT), Kamsarmax (81k DWT), and Capesize (150k DWT) against draft, deadweight, rate, ETA, route fit %, and suitability status.
- **East Coast Destination Matrix**: Compares top ports on draft limits, waiting days, all-in delivered cost, and suitability ranking. Click any port row to pivot instantly.

### 4. Interactive Hydrographic Corridor Map
- **Bay of Bengal Coastal Vector**: Interactive SVG visualization connecting West Bengal, Odisha, and Andhra Pradesh terminals. Highlights the active destination and optimal diversion corridors with draft depths and radar halos.

### 5. Strategy Desk & Explainable Verdict (`03`)
- **Charter Timing Panel ("When to move")**: Visual probability bars for *Now* (spot), *10–14 days* (balanced), and *21+ days* (early cover) with dynamic market commentary.
- **Explainable Recommendation Dossier**: Headline fixture recommendation, confidence score, risk indicator, structured rationale ("Why this wins"), and expected landed exposure.

### 6. Interactive What-If Simulator (`05`)
- Dual-slider stress testing for **Bunker Index** (540–760 USD/t) and **Port Congestion** (0–100).
- Real-time reactive score recalculation, scenario classification, and contextual market guidance.
- **Quick Presets**: *Base Case ($612/t)*, *Bunker Spike ($740/t)*, *Monsoon Congestion (+78%)*, *Clear Berth Window ($560/t)*, and *Capesize 150k MT Pivot*.

### 7. Executive Telemetry & Power Tools
- **Currency Valuation**: Seamless one-click switch between `$ USD` and `₹ INR` across all rates and tables.
- **Analytical Density**: Toggle between *Standard* and *Compact* analytical mode for high-density trading desks.
- **Export Dossier**: Download structured executive briefing (`.json`).
- **Keyboard Shortcuts**:
  - `1`: Jump to Shipment Brief
  - `2`: Jump to Market Signals
  - `3`: Jump to Strategy Desk
  - `4`: Jump to What-if Simulator
  - `R`: Re-run Optimization Engine

---

## 🚀 Quick Start

StratCoast is built with zero external dependencies and runs in any modern web browser.

### Option A: Direct Browser Launch
Open `index.html` directly in your browser:
```bash
open /Users/AnurupaDas/Desktop/StratCoast/index.html
```

### Option B: Local Web Server
Run Python's built-in web server:
```bash
cd /Users/AnurupaDas/Desktop/StratCoast
python3 -m http.server 8000
```
Then navigate to: **`http://localhost:8000`**

---

## 📁 Repository Structure

```
/Users/AnurupaDas/Desktop/StratCoast/
├── index.html              # Core analytical application shell
├── css/
│   └── styles.css          # Design system matching Replit (Manrope/DM Mono, dark rail, cards)
├── js/
│   ├── data.js             # Port registry, fleet classes, distance tables, commodity factors
│   ├── engine.js           # Hydrographic draft clearance, cost waterfall, explainable AI verdict
│   ├── app.js              # Reactive UI controller, event listeners, map updates, export handlers
│   └── bundle.js           # Consolidated zero-CORS runtime bundle for direct & offline execution
└── README.md               # Operator manual & system documentation
```

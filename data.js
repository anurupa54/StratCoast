/**
 * StratCoast — AI Charter Strategy Optimizer & Maritime Intelligence
 * Reference datasets: East Coast India Ports, Fleet Classes, Distance Offsets & Commodities
 * Grounded on Ministry of Ports, Shipping and Waterways (MoPSW) & Port Authorities data
 */

// Available Origin Countries
export const ORIGINS = [
  "Australia",
  "Indonesia",
  "Mozambique",
  "USA",
  "Russia"
];

// East Coast India Ports Dataset
export const PORTS = [
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
export const PORTS_BY_NAME = Object.fromEntries(PORTS.map(p => [p.name, p]));

// Bulk Fleet Classes
export const FLEET_CLASSES = [
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
export const CANDIDATE_VESSEL_NAMES = [
  "Eastern Horizon",
  "Coral Meridian",
  "Bay Navigator",
  "Odisha Star",
  "Coastal Resolve"
];

// Port Nautical Mile Deltas relative to Paradip benchmark
export const PORT_DISTANCE_DELTAS = {
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
export const ORIGIN_BASE_DISTANCES = {
  "Australia": 2700,
  "Indonesia": 1900,
  "Mozambique": 3500,
  "USA": 8500,
  "Russia": 6000
};

// Commodity Freight Multipliers
export const COMMODITY_FACTORS = {
  "Iron Ore": 0.45,
  "Coking Coal": 0.80,
  "Steam Coal": 0.25,
  "Limestone": 0.10
};

// Initial Default Shipment Brief
export const DEFAULT_SHIPMENT = {
  origin: "Australia",
  destination: "Paradip",
  commodity: "Iron Ore",
  quantity: "70,000",
  laycan: "14–24 Oct 2026"
};

// Default Simulation Constants
export const DEFAULT_BUNKER_INDEX = 612; // USD/t VLSFO
export const INR_EXCHANGE_RATE = 86.5;    // USD to INR conversion

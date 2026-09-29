import type { CalcFormula } from "./calcEngine";

// Complete formula library – 12 modules, 80+ formulas
export const FORMULAS: CalcFormula[] = [
  // 0 – URS / Capacity
  { id: "annual-capacity", name: "Annual Capacity (units/yr)", category: "URS", moduleId: "0", unit: "units/yr", standardRef: "ISPE Baseline Guide – OEE method", marginPct: 10, expression: "batchSize * fillSpeed * 60 * hoursPerShift * shiftsPerDay * workingDays * OEE / 100 * (1 - rejectPct/100)", inputs: [
    { id: "batchSize", label: "Batch size (vials)", value: 5000, unit: "vials", defaultVal: 5000, editable: true },
    { id: "fillSpeed", label: "Fill speed (vpm)", value: 200, unit: "vials/min", defaultVal: 200, editable: true },
    { id: "hoursPerShift", label: "Hours/shift", value: 8, unit: "h", defaultVal: 8, editable: true },
    { id: "shiftsPerDay", label: "Shifts/day", value: 2, unit: "-", defaultVal: 2, editable: true },
    { id: "workingDays", label: "Working days/yr", value: 300, unit: "days", defaultVal: 300, editable: true },
    { id: "OEE", label: "OEE (%)", value: 65, unit: "%", defaultVal: 65, editable: true },
    { id: "rejectPct", label: "Reject %", value: 3, unit: "%", defaultVal: 3, editable: true },
  ]},
  { id: "batches-per-year", name: "Batches per Year", category: "URS", moduleId: "0", unit: "batches", standardRef: "Capacity planning", marginPct: 5, expression: "annualDemand / batchSize", inputs: [
    { id: "annualDemand", label: "Annual demand (units)", value: 20000000, unit: "units", defaultVal: 20000000, editable: true },
    { id: "batchSize", label: "Batch size", value: 5000, unit: "vials", defaultVal: 5000, editable: true },
  ]},

  // 1 – Architecture
  { id: "area-gradeA", name: "Grade A Area (m²)", category: "Architecture", moduleId: "1", unit: "m²", standardRef: "Annex 1 – isolator footprint", marginPct: 15, expression: "isoLength * isoWidth * (1 + circulationPct/100)", inputs: [
    { id: "isoLength", label: "Isolator length (m)", value: 6, unit: "m", defaultVal: 6, editable: true },
    { id: "isoWidth", label: "Isolator width (m)", value: 2.2, unit: "m", defaultVal: 2.2, editable: true },
    { id: "circulationPct", label: "Circulation add-on %", value: 40, unit: "%", defaultVal: 40, editable: true },
  ]},
  { id: "airlock-area", name: "Airlock Area (m²)", category: "Architecture", moduleId: "1", unit: "m²", standardRef: "ISPE / Annex 1 cascade", marginPct: 10, expression: "persons * 2.5 + trolleys * 4", inputs: [
    { id: "persons", label: "Persons in airlock", value: 2, unit: "-", defaultVal: 2, editable: true },
    { id: "trolleys", label: "Trolleys", value: 1, unit: "-", defaultVal: 1, editable: true },
  ]},

  // 2 – HVAC
  { id: "air-volume", name: "Room Air Volume Flow (m³/h)", category: "HVAC", moduleId: "2", unit: "m³/h", standardRef: "ISO 14644-4 – ACH method", marginPct: 10, expression: "roomVolume * ACH", inputs: [
    { id: "roomVolume", label: "Room volume (m³)", value: 120, unit: "m³", defaultVal: 120, editable: true },
    { id: "ACH", label: "ACH (1/h)", value: 30, unit: "1/h", defaultVal: 30, editable: true },
  ]},
  { id: "hepa-count", name: "Terminal HEPA Count (H14 600×600)", category: "HVAC", moduleId: "2", unit: "nos", standardRef: "Filter face velocity 0.45 m/s", marginPct: 10, expression: "airVolume / (3600 * hepaArea * faceVelocity)", inputs: [
    { id: "airVolume", label: "Air volume (m³/h)", value: 3600, unit: "m³/h", defaultVal: 3600, editable: true },
    { id: "hepaArea", label: "HEPA face area (m²)", value: 0.36, unit: "m²", defaultVal: 0.36, editable: true },
    { id: "faceVelocity", label: "Face velocity (m/s)", value: 0.45, unit: "m/s", defaultVal: 0.45, editable: true },
  ]},
  { id: "cooling-load-sensible", name: "Sensible Cooling Load (kW)", category: "HVAC", moduleId: "2", unit: "kW", standardRef: "ASHRAE Fundamentals", marginPct: 15, expression: "peopleLoad + equipmentLoad + lightingLoad + transmissionLoad + freshAirSensible", inputs: [
    { id: "peopleLoad", label: "People load (kW)", value: 1.2, unit: "kW", defaultVal: 1.2, editable: true },
    { id: "equipmentLoad", label: "Equipment load (kW)", value: 8, unit: "kW", defaultVal: 8, editable: true },
    { id: "lightingLoad", label: "Lighting load (kW)", value: 1.5, unit: "kW", defaultVal: 1.5, editable: true },
    { id: "transmissionLoad", label: "Transmission (kW)", value: 2, unit: "kW", defaultVal: 2, editable: true },
    { id: "freshAirSensible", label: "Fresh air sensible (kW)", value: 6, unit: "kW", defaultVal: 6, editable: true },
  ]},
  { id: "cooling-load-total", name: "Total Cooling Load (TR)", category: "HVAC", moduleId: "2", unit: "TR", standardRef: "1 TR = 3.517 kW", marginPct: 15, expression: "(sensibleLoad + latentLoad) / 3.517", inputs: [
    { id: "sensibleLoad", label: "Sensible (kW)", value: 18.7, unit: "kW", defaultVal: 18.7, editable: true },
    { id: "latentLoad", label: "Latent (kW)", value: 4.5, unit: "kW", defaultVal: 4.5, editable: true },
  ]},
  { id: "ahu-airflow", name: "AHU Supply Airflow (m³/h)", category: "HVAC", moduleId: "2", unit: "m³/h", standardRef: "Q = 3.6·Cooling(kW) / (ρ·cp·ΔT)", marginPct: 10, expression: "3600 * coolingKW / (1.2 * 1.006 * deltaT)", inputs: [
    { id: "coolingKW", label: "Cooling (kW)", value: 23.2, unit: "kW", defaultVal: 23.2, editable: true },
    { id: "deltaT", label: "ΔT supply-room (K)", value: 10, unit: "K", defaultVal: 10, editable: true },
  ]},
  { id: "recovery-time", name: "Recovery Time (min)", category: "HVAC", moduleId: "2", unit: "min", standardRef: "ISO 14644-3 – 100:1 recovery", marginPct: 0, expression: "-60 / ACH * log(0.01) / log(10)", inputs: [
    { id: "ACH", label: "ACH", value: 30, unit: "1/h", defaultVal: 30, editable: true },
  ]},
  { id: "chiller-capacity", name: "Chiller Capacity (TR) – N+1", category: "HVAC", moduleId: "2", unit: "TR", standardRef: "ISPE – N+1 redundancy", marginPct: 20, expression: "totalTR * (1 + redundancyPct/100)", inputs: [
    { id: "totalTR", label: "Total TR", value: 420, unit: "TR", defaultVal: 420, editable: true },
    { id: "redundancyPct", label: "Redundancy %", value: 25, unit: "%", defaultVal: 25, editable: true },
  ]},
  { id: "fan-power", name: "AHU Fan Power (kW)", category: "HVAC", moduleId: "2", unit: "kW", standardRef: "P = Q·ΔP / (η·1000)", marginPct: 10, expression: "airflow_m3s * staticPa / (fanEff * 1000)", inputs: [
    { id: "airflow_m3s", label: "Airflow (m³/s)", value: 2.5, unit: "m³/s", defaultVal: 2.5, editable: true },
    { id: "staticPa", label: "Static pressure (Pa)", value: 900, unit: "Pa", defaultVal: 900, editable: true },
    { id: "fanEff", label: "Fan efficiency", value: 0.68, unit: "-", defaultVal: 0.68, editable: true },
  ]},

  // 3 – Process
  { id: "compounding-volume", name: "Compounding Vessel Volume (L)", category: "Process", moduleId: "3", unit: "L", standardRef: "20–30% headspace", marginPct: 20, expression: "batchLitres / (1 - headspacePct/100)", inputs: [
    { id: "batchLitres", label: "Batch (L)", value: 250, unit: "L", defaultVal: 250, editable: true },
    { id: "headspacePct", label: "Headspace %", value: 25, unit: "%", defaultVal: 25, editable: true },
  ]},
  { id: "filtration-area", name: "Sterilising Filtration Area (m²)", category: "Process", moduleId: "3", unit: "m²", standardRef: "Flux 400–800 LMH", marginPct: 25, expression: "batchLitres / (fluxLMH * filtrationHours)", inputs: [
    { id: "batchLitres", label: "Batch (L)", value: 250, unit: "L", defaultVal: 250, editable: true },
    { id: "fluxLMH", label: "Flux (L/m²·h)", value: 600, unit: "LMH", defaultVal: 600, editable: true },
    { id: "filtrationHours", label: "Filtration time (h)", value: 0.5, unit: "h", defaultVal: 0.5, editable: true },
  ]},
  { id: "f0-value", name: "F0 Value (min)", category: "Process", moduleId: "3", unit: "min", standardRef: "F0 = Δt·Σ10^((T-121.1)/z) ; z=10°C", marginPct: 0, expression: "dt * pow(10, (T - 121.1)/z)", inputs: [
    { id: "dt", label: "Δt hold (min)", value: 15, unit: "min", defaultVal: 15, editable: true },
    { id: "T", label: "Hold temp (°C)", value: 121.1, unit: "°C", defaultVal: 121.1, editable: true },
    { id: "z", label: "z value (°C)", value: 10, unit: "°C", defaultVal: 10, editable: true },
  ]},
  { id: "lyo-shelf-area", name: "Lyophiliser Shelf Area (m²)", category: "Process", moduleId: "3", unit: "m²", standardRef: "Vial packing calculation", marginPct: 15, expression: "vialsPerBatch * vialFootprint / packingEff", inputs: [
    { id: "vialsPerBatch", label: "Vials/batch", value: 8000, unit: "vials", defaultVal: 8000, editable: true },
    { id: "vialFootprint", label: "Vial footprint (m²)", value: 0.0012, unit: "m²", defaultVal: 0.0012, editable: true },
    { id: "packingEff", label: "Packing efficiency", value: 0.75, unit: "-", defaultVal: 0.75, editable: true },
  ]},
  { id: "lyo-ice-load", name: "Lyo Ice Load (kg)", category: "Process", moduleId: "3", unit: "kg", standardRef: "Fill volume × vials", marginPct: 10, expression: "vialsPerBatch * fillVolumeMl / 1000", inputs: [
    { id: "vialsPerBatch", label: "Vials/batch", value: 8000, unit: "vials", defaultVal: 8000, editable: true },
    { id: "fillVolumeMl", label: "Fill vol (mL)", value: 5, unit: "mL", defaultVal: 5, editable: true },
  ]},
  { id: "lyo-condenser", name: "Condenser Capacity (kg)", category: "Process", moduleId: "3", unit: "kg", standardRef: "1.2× ice load", marginPct: 20, expression: "iceLoad * 1.2", inputs: [
    { id: "iceLoad", label: "Ice load (kg)", value: 40, unit: "kg", defaultVal: 40, editable: true },
  ]},
  { id: "autoclave-volume", name: "Autoclave Chamber Volume (m³)", category: "Process", moduleId: "3", unit: "m³", standardRef: "Load factor 0.6", marginPct: 15, expression: "loadVolume / 0.6", inputs: [
    { id: "loadVolume", label: "Load volume (m³)", value: 0.8, unit: "m³", defaultVal: 0.8, editable: true },
  ]},

  // 4 – Water
  { id: "pw-demand", name: "Purified Water Demand (L/day)", category: "Water", moduleId: "4", unit: "L/day", standardRef: "ISPE Water Baseline", marginPct: 20, expression: "formulationL + cipL + washingL + cleaningL + gowningL", inputs: [
    { id: "formulationL", label: "Formulation (L/d)", value: 2000, unit: "L/d", defaultVal: 2000, editable: true },
    { id: "cipL", label: "CIP (L/d)", value: 3500, unit: "L/d", defaultVal: 3500, editable: true },
    { id: "washingL", label: "Component washing (L/d)", value: 4000, unit: "L/d", defaultVal: 4000, editable: true },
    { id: "cleaningL", label: "Area cleaning (L/d)", value: 1500, unit: "L/d", defaultVal: 1500, editable: true },
    { id: "gowningL", label: "Gowning/laundry (L/d)", value: 800, unit: "L/d", defaultVal: 800, editable: true },
  ]},
  { id: "pw-storage", name: "PW Storage Tank (L) – 1 day + 20% ", category: "Water", moduleId: "4", unit: "L", standardRef: "USP <1231>", marginPct: 10, expression: "dailyDemand * storageDays * (1 + marginPct2/100)", inputs: [
    { id: "dailyDemand", label: "Daily demand (L/d)", value: 11800, unit: "L/d", defaultVal: 11800, editable: true },
    { id: "storageDays", label: "Storage (days)", value: 1, unit: "days", defaultVal: 1, editable: true },
    { id: "marginPct2", label: "Margin %", value: 20, unit: "%", defaultVal: 20, editable: true },
  ]},
  { id: "wfi-still-capacity", name: "WFI Still Capacity (kg/h)", category: "Water", moduleId: "4", unit: "kg/h", standardRef: "Multi-effect distillation", marginPct: 15, expression: "dailyWFI / operatingHours", inputs: [
    { id: "dailyWFI", label: "Daily WFI (kg/d)", value: 6000, unit: "kg/d", defaultVal: 6000, editable: true },
    { id: "operatingHours", label: "Operating h/d", value: 16, unit: "h", defaultVal: 16, editable: true },
  ]},
  { id: "ro-recovery", name: "RO Permeate Flow (m³/h)", category: "Water", moduleId: "4", unit: "m³/h", standardRef: "Recovery 75%", marginPct: 10, expression: "feedFlow * recoveryPct/100", inputs: [
    { id: "feedFlow", label: "Feed flow (m³/h)", value: 2, unit: "m³/h", defaultVal: 2, editable: true },
    { id: "recoveryPct", label: "Recovery %", value: 75, unit: "%", defaultVal: 75, editable: true },
  ]},
  { id: "loop-velocity", name: "WFI Loop Velocity (m/s)", category: "Water", moduleId: "4", unit: "m/s", standardRef: "≥1.0–1.5 m/s ; Re ≥10,000", marginPct: 0, expression: "flowM3h / 3600 / (pi * pow(diaM,2)/4)", inputs: [
    { id: "flowM3h", label: "Loop flow (m³/h)", value: 3, unit: "m³/h", defaultVal: 3, editable: true },
    { id: "diaM", label: "Pipe ID (m)", value: 0.025, unit: "m", defaultVal: 0.025, editable: true },
    { id: "pi", label: "π", value: 3.14159265, unit: "-", defaultVal: 3.14159265, editable: false },
  ]},
  { id: "pure-steam-capacity", name: "Pure Steam Generator (kg/h)", category: "Water", moduleId: "4", unit: "kg/h", standardRef: "SIP + humidification", marginPct: 15, expression: "sipDemand + humidDemand + steriliserDemand", inputs: [
    { id: "sipDemand", label: "SIP (kg/h)", value: 180, unit: "kg/h", defaultVal: 180, editable: true },
    { id: "humidDemand", label: "AHU humid (kg/h)", value: 60, unit: "kg/h", defaultVal: 60, editable: true },
    { id: "steriliserDemand", label: "Autoclaves (kg/h)", value: 120, unit: "kg/h", defaultVal: 120, editable: true },
  ]},

  // 5 – Compressed air / gases / steam
  { id: "compressed-air", name: "Compressed Air Demand (CFM)", category: "Utilities", moduleId: "5", unit: "CFM", standardRef: "ISO 8573-1 Cl 1.2.1", marginPct: 20, expression: "connectedCFM * diversityPct/100", inputs: [
    { id: "connectedCFM", label: "Connected (CFM)", value: 520, unit: "CFM", defaultVal: 520, editable: true },
    { id: "diversityPct", label: "Diversity %", value: 70, unit: "%", defaultVal: 70, editable: true },
  ]},
  { id: "air-receiver", name: "Air Receiver Volume (m³)", category: "Utilities", moduleId: "5", unit: "m³", standardRef: "t=2 min @ ΔP", marginPct: 10, expression: "flowM3min * timeMin * Patm / deltaPbar", inputs: [
    { id: "flowM3min", label: "Flow (m³/min)", value: 10.3, unit: "m³/min", defaultVal: 10.3, editable: true },
    { id: "timeMin", label: "Reserve time (min)", value: 2, unit: "min", defaultVal: 2, editable: true },
    { id: "Patm", label: "Patm (bar)", value: 1.013, unit: "bar", defaultVal: 1.013, editable: true },
    { id: "deltaPbar", label: "ΔP (bar)", value: 1, unit: "bar", defaultVal: 1, editable: true },
  ]},
  { id: "boiler-capacity", name: "Industrial Steam Boiler (TPH)", category: "Utilities", moduleId: "5", unit: "TPH", standardRef: "IBR – 1 TPH = 1000 kg/h", marginPct: 15, expression: "totalSteamKgH / 1000", inputs: [
    { id: "totalSteamKgH", label: "Total steam (kg/h)", value: 2400, unit: "kg/h", defaultVal: 2400, editable: true },
  ]},
  { id: "n2-demand", name: "Nitrogen Demand (Nm³/h)", category: "Utilities", moduleId: "5", unit: "Nm³/h", standardRef: "Blanketing + inerting", marginPct: 15, expression: "blanketingNm3h + purgingNm3h", inputs: [
    { id: "blanketingNm3h", label: "Blanketing (Nm³/h)", value: 12, unit: "Nm³/h", defaultVal: 12, editable: true },
    { id: "purgingNm3h", label: "Purging (Nm³/h)", value: 8, unit: "Nm³/h", defaultVal: 8, editable: true },
  ]},

  // 6 – Electrical
  { id: "max-demand", name: "Maximum Demand (kVA)", category: "Electrical", moduleId: "6", unit: "kVA", standardRef: "CEA Regs – demand & diversity", marginPct: 15, expression: "connectedKW * demandFactor/100 * diversityFactor/100 / powerFactor", inputs: [
    { id: "connectedKW", label: "Connected (kW)", value: 2450, unit: "kW", defaultVal: 2450, editable: true },
    { id: "demandFactor", label: "Demand factor %", value: 80, unit: "%", defaultVal: 80, editable: true },
    { id: "diversityFactor", label: "Diversity %", value: 85, unit: "%", defaultVal: 85, editable: true },
    { id: "powerFactor", label: "PF", value: 0.92, unit: "-", defaultVal: 0.92, editable: true },
  ]},
  { id: "transformer-size", name: "Transformer (kVA) – next std rating", category: "Electrical", moduleId: "6", unit: "kVA", standardRef: "IS 2026 – loading ≤80%", marginPct: 0, expression: "maxDemandKVA / 0.8", inputs: [
    { id: "maxDemandKVA", label: "Max demand (kVA)", value: 1800, unit: "kVA", defaultVal: 1800, editable: true },
  ]},
  { id: "dg-size", name: "DG Set (kVA) – critical load 100%", category: "Electrical", moduleId: "6", unit: "kVA", standardRef: "IS 10002 – derating", marginPct: 10, expression: "criticalKW / powerFactor / deratingFactor", inputs: [
    { id: "criticalKW", label: "Critical load (kW)", value: 1100, unit: "kW", defaultVal: 1100, editable: true },
    { id: "powerFactor", label: "PF", value: 0.8, unit: "-", defaultVal: 0.8, editable: true },
    { id: "deratingFactor", label: "Derating (alt+temp)", value: 0.92, unit: "-", defaultVal: 0.92, editable: true },
  ]},
  { id: "ups-size", name: "UPS (kVA)", category: "Electrical", moduleId: "6", unit: "kVA", standardRef: "30 min autonomy", marginPct: 20, expression: "criticalITkW / pfUps / effUps", inputs: [
    { id: "criticalITkW", label: "IT/automation (kW)", value: 85, unit: "kW", defaultVal: 85, editable: true },
    { id: "pfUps", label: "UPS PF", value: 0.9, unit: "-", defaultVal: 0.9, editable: true },
    { id: "effUps", label: "Efficiency", value: 0.94, unit: "-", defaultVal: 0.94, editable: true },
  ]},
  { id: "apfc-kvar", name: "APFC (kVAr)", category: "Electrical", moduleId: "6", unit: "kVAr", standardRef: "Qc = P(tanφ1−tanφ2)", marginPct: 10, expression: "maxDemandKVA * powerFactor * (tan(acos(pf1)) - tan(acos(pf2)))", inputs: [
    { id: "maxDemandKVA", label: "Max demand (kVA)", value: 1800, unit: "kVA", defaultVal: 1800, editable: true },
    { id: "powerFactor", label: "P (kW) helper – not used", value: 1656, unit: "kW", defaultVal: 1656, editable: true },
    { id: "pf1", label: "Present PF", value: 0.82, unit: "-", defaultVal: 0.82, editable: true },
    { id: "pf2", label: "Target PF", value: 0.98, unit: "-", defaultVal: 0.98, editable: true },
  ]},
  { id: "cable-size-isc", name: "Min Cable Size by SC (mm²)", category: "Electrical", moduleId: "6", unit: "mm²", standardRef: "I²t = k²S² ; IS 3961", marginPct: 0, expression: "iscKA*1000 * sqrt(tripSec) / kFactor", inputs: [
    { id: "iscKA", label: "Isc (kA)", value: 35, unit: "kA", defaultVal: 35, editable: true },
    { id: "tripSec", label: "Trip time (s)", value: 0.2, unit: "s", defaultVal: 0.2, editable: true },
    { id: "kFactor", label: "k (Cu/XLPE)", value: 143, unit: "-", defaultVal: 143, editable: true },
  ]},
  { id: "volt-drop", name: "Voltage Drop (%)", category: "Electrical", moduleId: "6", unit: "%", standardRef: "≤3% feeder / ≤5% total", marginPct: 0, expression: "1.732 * currentA * lengthM * (resistOhmKm * cosPhi + reactOhmKm * sinPhi) / 1000 / voltageV * 100", inputs: [
    { id: "currentA", label: "Current (A)", value: 180, unit: "A", defaultVal: 180, editable: true },
    { id: "lengthM", label: "Length (m)", value: 85, unit: "m", defaultVal: 85, editable: true },
    { id: "resistOhmKm", label: "R (Ω/km)", value: 0.32, unit: "Ω/km", defaultVal: 0.32, editable: true },
    { id: "reactOhmKm", label: "X (Ω/km)", value: 0.08, unit: "Ω/km", defaultVal: 0.08, editable: true },
    { id: "cosPhi", label: "cos φ", value: 0.85, unit: "-", defaultVal: 0.85, editable: true },
    { id: "sinPhi", label: "sin φ", value: 0.527, unit: "-", defaultVal: 0.527, editable: true },
    { id: "voltageV", label: "Voltage (V)", value: 415, unit: "V", defaultVal: 415, editable: true },
  ]},
  { id: "lighting-watts", name: "Lighting Load (W) – lumen method", category: "Electrical", moduleId: "6", unit: "W", standardRef: "IS 3646; 300–500 lux cleanroom", marginPct: 10, expression: "lux * areaM2 / (utilFactor * maintFactor * lumensPerWatt)", inputs: [
    { id: "lux", label: "Lux", value: 400, unit: "lux", defaultVal: 400, editable: true },
    { id: "areaM2", label: "Area (m²)", value: 120, unit: "m²", defaultVal: 120, editable: true },
    { id: "utilFactor", label: "UF", value: 0.65, unit: "-", defaultVal: 0.65, editable: true },
    { id: "maintFactor", label: "MF", value: 0.8, unit: "-", defaultVal: 0.8, editable: true },
    { id: "lumensPerWatt", label: "lm/W", value: 110, unit: "lm/W", defaultVal: 110, editable: true },
  ]},

  // 7 – Instrumentation
  { id: "cv-liquid", name: "Control Valve Cv (liquid)", category: "Instrumentation", moduleId: "7", unit: "Cv", standardRef: "ISA / IEC 60534", marginPct: 20, expression: "flowM3h * sqrt(sg / deltaPbar)", inputs: [
    { id: "flowM3h", label: "Flow (m³/h)", value: 5, unit: "m³/h", defaultVal: 5, editable: true },
    { id: "sg", label: "Specific gravity", value: 1, unit: "-", defaultVal: 1, editable: true },
    { id: "deltaPbar", label: "ΔP (bar)", value: 1.2, unit: "bar", defaultVal: 1.2, editable: true },
  ]},
  { id: "orifice-dp", name: "Orifice ΔP (mbar)", category: "Instrumentation", moduleId: "7", unit: "mbar", standardRef: "ISO 5167", marginPct: 0, expression: "800 * pow(flowM3h / (beta2 * diaM2 * sqrt(density)), 2) / 100", inputs: [
    { id: "flowM3h", label: "Flow (m³/h)", value: 10, unit: "m³/h", defaultVal: 10, editable: true },
    { id: "beta2", label: "β² factor", value: 0.25, unit: "-", defaultVal: 0.25, editable: true },
    { id: "diaM2", label: "Pipe area proxy", value: 1, unit: "-", defaultVal: 1, editable: true },
    { id: "density", label: "Density (kg/m³)", value: 997, unit: "kg/m³", defaultVal: 997, editable: true },
  ]},
  { id: "io-count", name: "Total I/O Count", category: "Instrumentation", moduleId: "7", unit: "points", standardRef: "ISA 5.1", marginPct: 20, expression: "ai + ao + di + do + rtd", inputs: [
    { id: "ai", label: "AI", value: 120, unit: "-", defaultVal: 120, editable: true },
    { id: "ao", label: "AO", value: 45, unit: "-", defaultVal: 45, editable: true },
    { id: "di", label: "DI", value: 220, unit: "-", defaultVal: 220, editable: true },
    { id: "do", label: "DO", value: 180, unit: "-", defaultVal: 180, editable: true },
    { id: "rtd", label: "RTD/TC", value: 60, unit: "-", defaultVal: 60, editable: true },
  ]},

  // 8 – BMS/EMS/Safety
  { id: "cctv-storage", name: "CCTV Storage (TB)", category: "BMS", moduleId: "8", unit: "TB", standardRef: "Bitrate × days", marginPct: 10, expression: "cameras * bitrateMbps * 3600*24 * days / 8 / 1e6", inputs: [
    { id: "cameras", label: "Cameras", value: 48, unit: "-", defaultVal: 48, editable: true },
    { id: "bitrateMbps", label: "Bitrate (Mbps)", value: 4, unit: "Mbps", defaultVal: 4, editable: true },
    { id: "days", label: "Retention (days)", value: 30, unit: "days", defaultVal: 30, editable: true },
  ]},
  { id: "fire-pump-flow", name: "Fire Pump Flow (L/min)", category: "BMS", moduleId: "8", unit: "L/min", standardRef: "NFPA 20 / NBC 2016", marginPct: 10, expression: "sprinklerDemand + hydrantDemand", inputs: [
    { id: "sprinklerDemand", label: "Sprinkler (L/min)", value: 1800, unit: "L/min", defaultVal: 1800, editable: true },
    { id: "hydrantDemand", label: "Hydrant (L/min)", value: 1800, unit: "L/min", defaultVal: 1800, editable: true },
  ]},
  { id: "sprinkler-heads", name: "Sprinkler Heads (nos)", category: "BMS", moduleId: "8", unit: "nos", standardRef: "NFPA 13 – spacing & density", marginPct: 10, expression: "areaM2 / coverageM2", inputs: [
    { id: "areaM2", label: "Area (m²)", value: 3200, unit: "m²", defaultVal: 3200, editable: true },
    { id: "coverageM2", label: "Coverage/head (m²)", value: 12, unit: "m²", defaultVal: 12, editable: true },
  ]},

  // 9 – Mechanical/Piping
  { id: "pipe-dia", name: "Pipe ID (mm) – velocity method", category: "Mechanical", moduleId: "9", unit: "mm", standardRef: "Darcy–Weisbach velocity 1–2.5 m/s", marginPct: 0, expression: "1000 * sqrt(4 * flowM3h/3600 / (pi * velocity))", inputs: [
    { id: "flowM3h", label: "Flow (m³/h)", value: 5, unit: "m³/h", defaultVal: 5, editable: true },
    { id: "velocity", label: "Velocity (m/s)", value: 1.5, unit: "m/s", defaultVal: 1.5, editable: true },
    { id: "pi", label: "π", value: 3.14159265, unit: "-", defaultVal: 3.14159265, editable: false },
  ]},
  { id: "pump-bhp", name: "Pump BHP (kW)", category: "Mechanical", moduleId: "9", unit: "kW", standardRef: "P = Q·H·ρ·g / (η·1000)", marginPct: 15, expression: "flowM3s * headM * 9.81 * density / (pumpEff * 1000)", inputs: [
    { id: "flowM3s", label: "Flow (m³/s)", value: 0.00139, unit: "m³/s", defaultVal: 0.00139, editable: true },
    { id: "headM", label: "Head (m)", value: 28, unit: "m", defaultVal: 28, editable: true },
    { id: "density", label: "Density (kg/m³)", value: 997, unit: "kg/m³", defaultVal: 997, editable: true },
    { id: "pumpEff", label: "Pump eff", value: 0.68, unit: "-", defaultVal: 0.68, editable: true },
  ]},
  { id: "npsha", name: "NPSHa (m)", category: "Mechanical", moduleId: "9", unit: "m", standardRef: "NPSHa > NPSHr + 0.5 m", marginPct: 0, expression: "staticHead + atmHead - vapourHead - frictionHead", inputs: [
    { id: "staticHead", label: "Static head (m)", value: 3, unit: "m", defaultVal: 3, editable: true },
    { id: "atmHead", label: "Atm head (m)", value: 9.7, unit: "m", defaultVal: 9.7, editable: true },
    { id: "vapourHead", label: "Vapour head (m)", value: 0.5, unit: "m", defaultVal: 0.5, editable: true },
    { id: "frictionHead", label: "Friction head (m)", value: 1.2, unit: "m", defaultVal: 1.2, editable: true },
  ]},
  { id: "insulation-thk", name: "Insulation Thickness (mm) – economic", category: "Mechanical", moduleId: "9", unit: "mm", standardRef: "IS 3346 / ASHRAE", marginPct: 10, expression: "kWmK * deltaT * 1000 / (heatGainWm2)", inputs: [
    { id: "kWmK", label: "k (W/m·K)", value: 0.038, unit: "W/mK", defaultVal: 0.038, editable: true },
    { id: "deltaT", label: "ΔT (K)", value: 25, unit: "K", defaultVal: 25, editable: true },
    { id: "heatGainWm2", label: "Allowable gain (W/m²)", value: 15, unit: "W/m²", defaultVal: 15, editable: true },
  ]},

  // 10 – Validation
  { id: "maco", name: "MACO (mg) – ADE based", category: "Validation", moduleId: "10", unit: "mg", standardRef: "EMA / PDE / ADE guideline", marginPct: 0, expression: "ADEmg * batchSizeKgNext / (maxDailyDoseKg * safetyFactor)", inputs: [
    { id: "ADEmg", label: "ADE (mg)", value: 1.5, unit: "mg", defaultVal: 1.5, editable: true },
    { id: "batchSizeKgNext", label: "Next batch (kg)", value: 250, unit: "kg", defaultVal: 250, editable: true },
    { id: "maxDailyDoseKg", label: "Max daily dose next (kg)", value: 0.01, unit: "kg", defaultVal: 0.01, editable: true },
    { id: "safetyFactor", label: "Safety factor", value: 100, unit: "-", defaultVal: 100, editable: true },
  ]},
  { id: "media-fill-units", name: "Media Fill Units (APS)", category: "Validation", moduleId: "10", unit: "units", standardRef: "Annex 1 – ≥5,000–10,000", marginPct: 0, expression: "max(5000, batchSizeUnits)", inputs: [
    { id: "batchSizeUnits", label: "Batch size (units)", value: 5000, unit: "units", defaultVal: 5000, editable: true },
  ]},

  // 11 – Cost / Schedule
  { id: "capex", name: "CAPEX (INR Cr)", category: "Cost", moduleId: "11", unit: "INR Cr", standardRef: "m² rate + equipment", marginPct: 15, expression: "areaM2 * ratePerM2 / 1e7 + equipmentCr", inputs: [
    { id: "areaM2", label: "Built-up area (m²)", value: 6500, unit: "m²", defaultVal: 6500, editable: true },
    { id: "ratePerM2", label: "Civil+MEP rate (INR/m²)", value: 95000, unit: "INR/m²", defaultVal: 95000, editable: true },
    { id: "equipmentCr", label: "Equipment (INR Cr)", value: 85, unit: "INR Cr", defaultVal: 85, editable: true },
  ]},
  { id: "opex-power", name: "Annual Power Cost (INR Cr)", category: "Cost", moduleId: "11", unit: "INR Cr", standardRef: "kWh × tariff", marginPct: 10, expression: "connectedKW * loadFactor * hoursPerYear * tariffPerKwh / 1e7", inputs: [
    { id: "connectedKW", label: "Connected (kW)", value: 2450, unit: "kW", defaultVal: 2450, editable: true },
    { id: "loadFactor", label: "Load factor", value: 0.62, unit: "-", defaultVal: 0.62, editable: true },
    { id: "hoursPerYear", label: "Hours/yr", value: 7200, unit: "h", defaultVal: 7200, editable: true },
    { id: "tariffPerKwh", label: "Tariff (INR/kWh)", value: 8.5, unit: "INR/kWh", defaultVal: 8.5, editable: true },
  ]},
  { id: "carbon", name: "Annual CO₂ (tCO₂e)", category: "Cost", moduleId: "11", unit: "tCO₂e", standardRef: "CEA emission factor", marginPct: 0, expression: "annualKwh * emissionFactor", inputs: [
    { id: "annualKwh", label: "Annual kWh", value: 10936800, unit: "kWh", defaultVal: 10936800, editable: true },
    { id: "emissionFactor", label: "EF (tCO₂/kWh)", value: 0.00082, unit: "t/kWh", defaultVal: 0.00082, editable: true },
  ]},
  { id: "solar-payback", name: "Solar Payback (years)", category: "Cost", moduleId: "11", unit: "years", standardRef: "kWp × yield", marginPct: 0, expression: "capexLakh * 1e5 / (kWp * yieldKwhPerKwp * tariffPerKwh)", inputs: [
    { id: "capexLakh", label: "Solar capex (lakh)", value: 180, unit: "lakh", defaultVal: 180, editable: true },
    { id: "kWp", label: "kWp", value: 320, unit: "kWp", defaultVal: 320, editable: true },
    { id: "yieldKwhPerKwp", label: "Yield (kWh/kWp·yr)", value: 1450, unit: "kWh/kWp", defaultVal: 1450, editable: true },
    { id: "tariffPerKwh", label: "Tariff (INR/kWh)", value: 8.5, unit: "INR/kWh", defaultVal: 8.5, editable: true },
  ]},
];

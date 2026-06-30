/**
 * NurseCalc — Calculation Engine
 * ------------------------------------------------------------------
 * Pure functions only. No DOM, no React, no side effects.
 * Every function returns: { value, unit, steps: [], methods: {...} }
 * so the UI can render the answer AND the worked solution in all 3 methods.
 *
 * Formulas grounded in open references: the Open RN / OpenStax
 * dosage-calculation curriculum (CC BY) and standard dimensional-analysis
 * method (D = Desired, H = on-Hand, Q = Quantity).
 *
 * Conventions:
 *   D = Desired dose (ordered)   H = on-Hand dose (available strength)
 *   Q = Quantity / Vehicle (mL or tablets the H is contained in)
 * ------------------------------------------------------------------
 */

const round = (n, dp = 2) => {
  const f = Math.pow(10, dp);
  return Math.round((n + Number.EPSILON) * f) / f;
};

// --- shared helpers ---------------------------------------------------------

export function lbToKg(lb) {
  return lb / 2.2;
}

export function mgToMcg(mg) {
  return mg * 1000;
}

export function concentration(totalDrug, totalVolumeMl) {
  // returns drug units per mL (same unit as totalDrug)
  return totalDrug / totalVolumeMl;
}

// =====================================================================
// PART 1 — GENERAL DOSING
// =====================================================================

/** 1.1 Oral / tablet:  tablets = D / H */
export function oralTablet({ desired, onHand }) {
  const value = desired / onHand;
  return {
    value: round(value, 2),
    unit: "tablet(s)",
    methods: {
      formula: `Tablets = D ÷ H = ${desired} ÷ ${onHand} = ${round(value, 2)}`,
      ratioProportion: `${onHand} mg : 1 tab :: ${desired} mg : x tab  →  x = ${round(value, 2)} tab`,
      dimensionalAnalysis: `${desired} mg × (1 tab / ${onHand} mg) = ${round(value, 2)} tab`,
    },
    steps: [
      `Desired (D) = ${desired} mg`,
      `On hand (H) = ${onHand} mg per tablet`,
      `Tablets = ${desired} ÷ ${onHand} = ${round(value, 2)}`,
    ],
  };
}

/** 1.2 / 1.3 Liquid or injectable:  mL = (D / H) × Q */
export function liquidDose({ desired, onHand, perVolume }) {
  const value = (desired / onHand) * perVolume;
  return {
    value: round(value, 2),
    unit: "mL",
    methods: {
      formula: `mL = (D ÷ H) × Q = (${desired} ÷ ${onHand}) × ${perVolume} = ${round(value, 2)} mL`,
      ratioProportion: `${onHand} mg : ${perVolume} mL :: ${desired} mg : x mL  →  x = ${round(value, 2)} mL`,
      dimensionalAnalysis: `${desired} mg × (${perVolume} mL / ${onHand} mg) = ${round(value, 2)} mL`,
    },
    steps: [
      `Desired (D) = ${desired} mg`,
      `On hand (H) = ${onHand} mg per ${perVolume} mL`,
      `mL = (${desired} ÷ ${onHand}) × ${perVolume} = ${round(value, 2)} mL`,
    ],
  };
}

/** 1.4 Weight-based:  dose = dosePerKg × weight(kg) */
export function weightBased({ dosePerKg, weight, weightUnit = "kg", unitLabel = "mg" }) {
  const kg = weightUnit === "lb" ? lbToKg(weight) : weight;
  const value = dosePerKg * kg;
  return {
    value: round(value, 2),
    unit: unitLabel,
    weightKg: round(kg, 2),
    methods: {
      formula: `Dose = ${dosePerKg} ${unitLabel}/kg × ${round(kg, 2)} kg = ${round(value, 2)} ${unitLabel}`,
      dimensionalAnalysis: `${dosePerKg} ${unitLabel}/kg × ${round(kg, 2)} kg = ${round(value, 2)} ${unitLabel}`,
    },
    steps: [
      weightUnit === "lb"
        ? `Convert weight: ${weight} lb ÷ 2.2 = ${round(kg, 2)} kg`
        : `Weight = ${weight} kg`,
      `Dose = ${dosePerKg} ${unitLabel}/kg × ${round(kg, 2)} kg = ${round(value, 2)} ${unitLabel}`,
    ],
  };
}

// =====================================================================
// PART 2 — IV FLOW / TIME
// =====================================================================

/** 1.5 Pump rate:  mL/hr = volume ÷ time(hr) */
export function pumpRate({ volumeMl, timeHr }) {
  const value = volumeMl / timeHr;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    methods: {
      formula: `Rate = Volume ÷ Time = ${volumeMl} mL ÷ ${timeHr} hr = ${round(value, 1)} mL/hr`,
      dimensionalAnalysis: `${volumeMl} mL × (1 / ${timeHr} hr) = ${round(value, 1)} mL/hr`,
    },
    steps: [`Rate = ${volumeMl} ÷ ${timeHr} = ${round(value, 1)} mL/hr`],
  };
}

/** 1.6 Gravity drip:  gtt/min = (volume × dropFactor) ÷ time(min). Round WHOLE. */
export function dripRate({ volumeMl, timeMin, dropFactor }) {
  const raw = (volumeMl * dropFactor) / timeMin;
  const value = Math.round(raw); // cannot give a fraction of a drop
  return {
    value,
    rawValue: round(raw, 2),
    unit: "gtt/min",
    methods: {
      formula: `gtt/min = (Volume × Drop factor) ÷ Time(min) = (${volumeMl} × ${dropFactor}) ÷ ${timeMin} = ${round(raw, 2)} → ${value}`,
      dimensionalAnalysis: `${volumeMl} mL × (${dropFactor} gtt / 1 mL) × (1 / ${timeMin} min) = ${round(raw, 2)} → ${value} gtt/min`,
    },
    steps: [
      `Time in minutes = ${timeMin}`,
      `gtt/min = (${volumeMl} × ${dropFactor}) ÷ ${timeMin} = ${round(raw, 2)}`,
      `Round to whole drops → ${value} gtt/min`,
    ],
    note:
      dropFactor === 60
        ? "Microdrip (60 gtt/mL): gtt/min equals mL/hr — quick sanity check."
        : undefined,
  };
}

/** 1.7 Infusion time:  hr = volume ÷ rate(mL/hr) */
export function infusionTime({ volumeMl, rateMlHr }) {
  const hr = volumeMl / rateMlHr;
  const whole = Math.floor(hr);
  const mins = Math.round((hr - whole) * 60);
  return {
    value: round(hr, 2),
    unit: "hr",
    display: `${whole} hr ${mins} min`,
    methods: {
      formula: `Time = Volume ÷ Rate = ${volumeMl} ÷ ${rateMlHr} = ${round(hr, 2)} hr (${whole} hr ${mins} min)`,
    },
    steps: [`Time = ${volumeMl} ÷ ${rateMlHr} = ${round(hr, 2)} hr = ${whole} hr ${mins} min`],
  };
}

// =====================================================================
// PART 3 — RECONSTITUTION / BSA / SAFE DOSE RANGE
// =====================================================================

/** 1.8 Reconstitution:  mL = D ÷ reconstituted concentration */
export function reconstitution({ desired, reconstitutedConc }) {
  const value = desired / reconstitutedConc;
  return {
    value: round(value, 2),
    unit: "mL",
    methods: {
      formula: `mL = D ÷ Concentration = ${desired} ÷ ${reconstitutedConc} = ${round(value, 2)} mL`,
      dimensionalAnalysis: `${desired} mg × (1 mL / ${reconstitutedConc} mg) = ${round(value, 2)} mL`,
    },
    steps: [
      `After reconstitution, concentration = ${reconstitutedConc} mg/mL (read the vial label)`,
      `mL = ${desired} ÷ ${reconstitutedConc} = ${round(value, 2)} mL`,
    ],
  };
}

/** 1.9 BSA (Mosteller):  m² = √[(cm × kg) / 3600] */
export function bsaMosteller({ heightCm, weightKg }) {
  const value = Math.sqrt((heightCm * weightKg) / 3600);
  return {
    value: round(value, 2),
    unit: "m²",
    methods: {
      formula: `BSA = √[(Ht × Wt) ÷ 3600] = √[(${heightCm} × ${weightKg}) ÷ 3600] = ${round(value, 2)} m²`,
    },
    steps: [`BSA = √[(${heightCm} × ${weightKg}) ÷ 3600] = ${round(value, 2)} m²`],
  };
}

/** BSA dose: dose = dosePerM2 × BSA */
export function bsaDose({ dosePerM2, bsa, unitLabel = "mg" }) {
  const value = dosePerM2 * bsa;
  return {
    value: round(value, 2),
    unit: unitLabel,
    methods: { formula: `Dose = ${dosePerM2} ${unitLabel}/m² × ${bsa} m² = ${round(value, 2)} ${unitLabel}` },
    steps: [`Dose = ${dosePerM2} × ${bsa} = ${round(value, 2)} ${unitLabel}`],
  };
}

/** 1.10 Safe Dose Range: returns min/max + classification of the ordered dose */
export function safeDoseRange({ minPerKg, maxPerKg, weight, weightUnit = "kg", orderedDose, unitLabel = "mg" }) {
  const kg = weightUnit === "lb" ? lbToKg(weight) : weight;
  const min = minPerKg * kg;
  const max = maxPerKg * kg;
  let classification = "SAFE";
  if (orderedDose != null) {
    if (orderedDose < min) classification = "BELOW RANGE — clarify with prescriber";
    else if (orderedDose > max) classification = "EXCEEDS RANGE — clarify with prescriber";
  }
  return {
    min: round(min, 2),
    max: round(max, 2),
    unit: unitLabel,
    classification,
    weightKg: round(kg, 2),
    methods: {
      formula: `Safe range = ${minPerKg}–${maxPerKg} ${unitLabel}/kg × ${round(kg, 2)} kg = ${round(min, 2)}–${round(max, 2)} ${unitLabel}`,
    },
    steps: [
      weightUnit === "lb" ? `Convert: ${weight} lb ÷ 2.2 = ${round(kg, 2)} kg` : `Weight = ${weight} kg`,
      `Min = ${minPerKg} × ${round(kg, 2)} = ${round(min, 2)} ${unitLabel}`,
      `Max = ${maxPerKg} × ${round(kg, 2)} = ${round(max, 2)} ${unitLabel}`,
      orderedDose != null ? `Ordered ${orderedDose} ${unitLabel} → ${classification}` : `Enter ordered dose to classify`,
    ],
  };
}

// =====================================================================
// PART 4 — CRITICAL CARE / TITRATION (bidirectional)
// =====================================================================

/**
 * 2.2 Weight-based dose → pump rate
 * mL/hr = [dose(mcg/kg/min) × weight(kg) × 60] ÷ concentration(mcg/mL)
 */
export function doseToRateWeight({ doseMcgKgMin, weight, weightUnit = "kg", totalDrugMg, totalVolumeMl }) {
  const kg = weightUnit === "lb" ? lbToKg(weight) : weight;
  const concMcgMl = (totalDrugMg / totalVolumeMl) * 1000;
  const value = (doseMcgKgMin * kg * 60) / concMcgMl;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    concMcgMl: round(concMcgMl, 1),
    weightKg: round(kg, 2),
    methods: {
      formula: `mL/hr = (${doseMcgKgMin} mcg/kg/min × ${round(kg, 2)} kg × 60) ÷ ${round(concMcgMl, 1)} mcg/mL = ${round(value, 1)} mL/hr`,
      dimensionalAnalysis: `${doseMcgKgMin} mcg/kg/min × ${round(kg, 2)} kg × 60 min/hr × (1 mL / ${round(concMcgMl, 1)} mcg) = ${round(value, 1)} mL/hr`,
    },
    steps: [
      `Concentration = ${totalDrugMg} mg ÷ ${totalVolumeMl} mL = ${round(totalDrugMg / totalVolumeMl, 3)} mg/mL = ${round(concMcgMl, 1)} mcg/mL`,
      weightUnit === "lb" ? `Convert: ${weight} lb ÷ 2.2 = ${round(kg, 2)} kg` : `Weight = ${weight} kg`,
      `mL/hr = (${doseMcgKgMin} × ${round(kg, 2)} × 60) ÷ ${round(concMcgMl, 1)} = ${round(value, 1)} mL/hr`,
    ],
  };
}

/**
 * 2.3 Pump rate → weight-based dose (verify a running drip)
 * dose(mcg/kg/min) = [rate(mL/hr) × concentration(mcg/mL)] ÷ [weight(kg) × 60]
 */
export function rateToDoseWeight({ rateMlHr, weight, weightUnit = "kg", totalDrugMg, totalVolumeMl }) {
  const kg = weightUnit === "lb" ? lbToKg(weight) : weight;
  const concMcgMl = (totalDrugMg / totalVolumeMl) * 1000;
  const value = (rateMlHr * concMcgMl) / (kg * 60);
  return {
    value: round(value, 2),
    unit: "mcg/kg/min",
    concMcgMl: round(concMcgMl, 1),
    weightKg: round(kg, 2),
    methods: {
      formula: `mcg/kg/min = (${rateMlHr} mL/hr × ${round(concMcgMl, 1)} mcg/mL) ÷ (${round(kg, 2)} kg × 60) = ${round(value, 2)}`,
    },
    steps: [
      `Concentration = ${round(concMcgMl, 1)} mcg/mL`,
      `mcg/kg/min = (${rateMlHr} × ${round(concMcgMl, 1)}) ÷ (${round(kg, 2)} × 60) = ${round(value, 2)}`,
    ],
  };
}

/**
 * 2.4 Non-weight dose (mcg/min) → mL/hr
 * mL/hr = [dose(mcg/min) × 60] ÷ concentration(mcg/mL)
 */
export function doseToRateMcgMin({ doseMcgMin, totalDrugMg, totalVolumeMl }) {
  const concMcgMl = (totalDrugMg / totalVolumeMl) * 1000;
  const value = (doseMcgMin * 60) / concMcgMl;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    concMcgMl: round(concMcgMl, 1),
    methods: {
      formula: `mL/hr = (${doseMcgMin} mcg/min × 60) ÷ ${round(concMcgMl, 1)} mcg/mL = ${round(value, 1)} mL/hr`,
    },
    steps: [
      `Concentration = ${round(concMcgMl, 1)} mcg/mL`,
      `mL/hr = (${doseMcgMin} × 60) ÷ ${round(concMcgMl, 1)} = ${round(value, 1)} mL/hr`,
    ],
  };
}

/**
 * 2.5 mg/min ↔ mL/hr (amiodarone maintenance, lidocaine)
 * mL/hr = [dose(mg/min) × 60] ÷ concentration(mg/mL)
 */
export function doseToRateMgMin({ doseMgMin, totalDrugMg, totalVolumeMl }) {
  const concMgMl = totalDrugMg / totalVolumeMl;
  const value = (doseMgMin * 60) / concMgMl;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    concMgMl: round(concMgMl, 3),
    methods: {
      formula: `mL/hr = (${doseMgMin} mg/min × 60) ÷ ${round(concMgMl, 3)} mg/mL = ${round(value, 1)} mL/hr`,
    },
    steps: [
      `Concentration = ${round(concMgMl, 3)} mg/mL`,
      `mL/hr = (${doseMgMin} × 60) ÷ ${round(concMgMl, 3)} = ${round(value, 1)} mL/hr`,
    ],
  };
}

/**
 * 2.6 units/hr ↔ mL/hr (heparin, insulin)
 */
export function unitsToRate({ unitsPerHr, totalUnits, totalVolumeMl }) {
  const concUnitsMl = totalUnits / totalVolumeMl;
  const value = unitsPerHr / concUnitsMl;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    concUnitsMl: round(concUnitsMl, 2),
    methods: { formula: `mL/hr = ${unitsPerHr} units/hr ÷ ${round(concUnitsMl, 2)} units/mL = ${round(value, 1)} mL/hr` },
    steps: [
      `Concentration = ${totalUnits} units ÷ ${totalVolumeMl} mL = ${round(concUnitsMl, 2)} units/mL`,
      `mL/hr = ${unitsPerHr} ÷ ${round(concUnitsMl, 2)} = ${round(value, 1)} mL/hr`,
    ],
  };
}

export function rateToUnits({ rateMlHr, totalUnits, totalVolumeMl }) {
  const concUnitsMl = totalUnits / totalVolumeMl;
  const value = rateMlHr * concUnitsMl;
  return {
    value: round(value, 0),
    unit: "units/hr",
    concUnitsMl: round(concUnitsMl, 2),
    methods: { formula: `units/hr = ${rateMlHr} mL/hr × ${round(concUnitsMl, 2)} units/mL = ${round(value, 0)} units/hr` },
    steps: [`units/hr = ${rateMlHr} × ${round(concUnitsMl, 2)} = ${round(value, 0)} units/hr`],
  };
}

// =====================================================================
// EXTENSIONS — added for the Titration screen (bidirectional support +
// mg/hr-ordered drips like nicardipine). Same conventions as above;
// algebraic inversions / unit variants of the formulas in Part 4.
// =====================================================================

/**
 * 2.5b mg/hr ↔ mL/hr (nicardipine, magnesium sulfate — ordered in mg/hr)
 * mL/hr = dose(mg/hr) ÷ concentration(mg/mL)
 */
export function doseToRateMgHr({ doseMgHr, totalDrugMg, totalVolumeMl }) {
  const concMgMl = totalDrugMg / totalVolumeMl;
  const value = doseMgHr / concMgMl;
  return {
    value: round(value, 1),
    unit: "mL/hr",
    concMgMl: round(concMgMl, 3),
    methods: {
      formula: `mL/hr = ${doseMgHr} mg/hr ÷ ${round(concMgMl, 3)} mg/mL = ${round(value, 1)} mL/hr`,
      dimensionalAnalysis: `${doseMgHr} mg/hr × (1 mL / ${round(concMgMl, 3)} mg) = ${round(value, 1)} mL/hr`,
    },
    steps: [
      `Concentration = ${totalDrugMg} mg ÷ ${totalVolumeMl} mL = ${round(concMgMl, 3)} mg/mL`,
      `mL/hr = ${doseMgHr} ÷ ${round(concMgMl, 3)} = ${round(value, 1)} mL/hr`,
    ],
  };
}

export function rateToDoseMgHr({ rateMlHr, totalDrugMg, totalVolumeMl }) {
  const concMgMl = totalDrugMg / totalVolumeMl;
  const value = rateMlHr * concMgMl;
  return {
    value: round(value, 2),
    unit: "mg/hr",
    concMgMl: round(concMgMl, 3),
    methods: {
      formula: `mg/hr = ${rateMlHr} mL/hr × ${round(concMgMl, 3)} mg/mL = ${round(value, 2)} mg/hr`,
    },
    steps: [
      `Concentration = ${round(concMgMl, 3)} mg/mL`,
      `mg/hr = ${rateMlHr} × ${round(concMgMl, 3)} = ${round(value, 2)} mg/hr`,
    ],
  };
}

/**
 * 2.4b mL/hr → mcg/min (verify a running non-weight drip)
 * mcg/min = [rate(mL/hr) × concentration(mcg/mL)] ÷ 60
 */
export function rateToDoseMcgMin({ rateMlHr, totalDrugMg, totalVolumeMl }) {
  const concMcgMl = (totalDrugMg / totalVolumeMl) * 1000;
  const value = (rateMlHr * concMcgMl) / 60;
  return {
    value: round(value, 1),
    unit: "mcg/min",
    concMcgMl: round(concMcgMl, 1),
    methods: {
      formula: `mcg/min = (${rateMlHr} mL/hr × ${round(concMcgMl, 1)} mcg/mL) ÷ 60 = ${round(value, 1)} mcg/min`,
    },
    steps: [
      `Concentration = ${round(concMcgMl, 1)} mcg/mL`,
      `mcg/min = (${rateMlHr} × ${round(concMcgMl, 1)}) ÷ 60 = ${round(value, 1)} mcg/min`,
    ],
  };
}

/**
 * 2.5c mL/hr → mg/min (verify a running amiodarone/lidocaine drip)
 * mg/min = [rate(mL/hr) × concentration(mg/mL)] ÷ 60
 */
export function rateToDoseMgMin({ rateMlHr, totalDrugMg, totalVolumeMl }) {
  const concMgMl = totalDrugMg / totalVolumeMl;
  const value = (rateMlHr * concMgMl) / 60;
  return {
    value: round(value, 2),
    unit: "mg/min",
    concMgMl: round(concMgMl, 3),
    methods: {
      formula: `mg/min = (${rateMlHr} mL/hr × ${round(concMgMl, 3)} mg/mL) ÷ 60 = ${round(value, 2)} mg/min`,
    },
    steps: [
      `Concentration = ${round(concMgMl, 3)} mg/mL`,
      `mg/min = (${rateMlHr} × ${round(concMgMl, 3)}) ÷ 60 = ${round(value, 2)} mg/min`,
    ],
  };
}

export const _round = round; // exported for tests

// =====================================================================
// PART 4 — UNIT CONVERSIONS
// =====================================================================

/**
 * Conversion catalog. `factor` = number of base units in 1 of this unit,
 * so converting is value × (fromFactor / toFactor). Metric mass and
 * household volume are exact; kg⇄lb uses the nursing 2.2 convention so it
 * matches the weight-based calculators. Temperature is an offset, not a
 * ratio, so it's handled separately.
 */
export const CONVERSIONS = {
  mass: {
    label: "Mass",
    base: "mg",
    defaultFrom: "mg",
    defaultTo: "mcg",
    units: [
      { value: "mcg", label: "mcg", factor: 0.001 },
      { value: "mg", label: "mg", factor: 1 },
      { value: "g", label: "g", factor: 1000 },
      { value: "kg", label: "kg", factor: 1000000 },
    ],
  },
  weight: {
    label: "Weight",
    base: "kg",
    defaultFrom: "kg",
    defaultTo: "lb",
    units: [
      { value: "kg", label: "kg", factor: 1 },
      { value: "lb", label: "lb", factor: 1 / 2.2 },
    ],
  },
  volume: {
    label: "Volume",
    base: "mL",
    defaultFrom: "tbsp",
    defaultTo: "mL",
    units: [
      { value: "mL", label: "mL", factor: 1 },
      { value: "L", label: "L", factor: 1000 },
      { value: "tsp", label: "tsp", factor: 5 },
      { value: "tbsp", label: "tbsp", factor: 15 },
      { value: "floz", label: "fl oz", factor: 30 },
      { value: "cup", label: "cup", factor: 240 },
    ],
  },
  temp: {
    label: "Temp",
    defaultFrom: "C",
    defaultTo: "F",
    units: [
      { value: "C", label: "°C" },
      { value: "F", label: "°F" },
    ],
  },
};

function tempLabel(u) {
  return u === "C" ? "°C" : "°F";
}

function convertTemp(v, from, to) {
  let result = v;
  let formula = `${v} ${tempLabel(from)} (same unit)`;
  if (from !== to) {
    if (from === "C") {
      result = (v * 9) / 5 + 32;
      formula = `(${v} × 9/5) + 32 = ${round(result, 1)} °F`;
    } else {
      result = ((v - 32) * 5) / 9;
      formula = `(${v} − 32) × 5/9 = ${round(result, 1)} °C`;
    }
  }
  return {
    value: round(result, 1),
    unit: tempLabel(to),
    methods: { formula },
    steps: [formula],
  };
}

/**
 * 4.1 Convert a value between two units of the same category.
 * Returns the standard engine shape { value, unit, methods, steps }.
 */
export function convertUnit({ category, value, from, to }) {
  const v = Number(value);
  if (category === "temp") return convertTemp(v, from, to);

  const cat = CONVERSIONS[category];
  const f = cat.units.find((u) => u.value === from);
  const t = cat.units.find((u) => u.value === to);
  const perFrom = round(f.factor / t.factor, 6); // how many `to` units are in 1 `from`
  const result = v * (f.factor / t.factor);

  return {
    value: round(result, 4),
    unit: t.label,
    methods: {
      formula: `${v} ${f.label} × ${perFrom} = ${round(result, 4)} ${t.label}`,
      dimensionalAnalysis: `${v} ${f.label} × (${perFrom} ${t.label} / 1 ${f.label}) = ${round(result, 4)} ${t.label}`,
    },
    steps: [
      `1 ${f.label} = ${perFrom} ${t.label}`,
      `${v} ${f.label} × ${perFrom} = ${round(result, 4)} ${t.label}`,
    ],
  };
}

// =====================================================================
// PART 5 — RENAL & PEDIATRIC
// =====================================================================

/** Devine ideal body weight (kg). Men 50 + 2.3/inch over 5 ft; women 45.5 + 2.3/inch. */
export function idealBodyWeightKg({ heightCm, sex }) {
  const inchesOver60 = Math.max(0, heightCm / 2.54 - 60);
  return (sex === "female" ? 45.5 : 50) + 2.3 * inchesOver60;
}

/** Adjusted body weight (kg) = IBW + 0.4 × (actual − IBW). */
export function adjustedBodyWeightKg({ actualKg, ibwKg }) {
  return ibwKg + 0.4 * (actualKg - ibwKg);
}

/** General (non-staging) interpretation band for an estimated CrCl in mL/min. */
function crClCategory(value) {
  if (value >= 90) return "≥90 — normal / high";
  if (value >= 60) return "60–89 — mildly decreased";
  if (value >= 30) return "30–59 — moderately decreased";
  if (value >= 15) return "15–29 — severely decreased";
  return "<15 — kidney-failure range";
}

/**
 * 5.1 Estimated creatinine clearance (Cockcroft-Gault).
 * CrCl (mL/min) = ((140 − age) × weight × sexFactor) ÷ (72 × SCr[mg/dL]).
 * µmol/L input is converted to mg/dL (÷ 88.4) so one canonical formula is used
 * (the published SI constants 1.23/1.04 are just 88.4/72 and ×0.85).
 */
export function cockcroftGault({ age, weightKg, sex, scr, scrUnit = "mg/dL" }) {
  const scrMgDl = scrUnit === "umol/L" ? scr / 88.4 : scr;
  const sexFactor = sex === "female" ? 0.85 : 1;
  const value = ((140 - age) * weightKg * sexFactor) / (72 * scrMgDl);
  const scrShown =
    scrUnit === "umol/L" ? `${scr} µmol/L (= ${round(scrMgDl, 2)} mg/dL)` : `${scr} mg/dL`;
  const femalePart = sex === "female" ? " × 0.85" : "";
  return {
    value: round(value, 1),
    unit: "mL/min",
    category: crClCategory(value),
    methods: {
      formula: `CrCl = ((140 − ${age}) × ${round(weightKg, 1)} kg${femalePart}) ÷ (72 × ${round(scrMgDl, 2)}) = ${round(value, 1)} mL/min`,
    },
    steps: [
      `Serum creatinine: ${scrShown}`,
      sex === "female" ? "Female → multiply by 0.85" : "Male → no sex correction",
      `CrCl = ((140 − ${age}) × ${round(weightKg, 1)}${femalePart}) ÷ (72 × ${round(scrMgDl, 2)}) = ${round(value, 1)} mL/min`,
    ],
    note: "Estimate only — Cockcroft-Gault assumes stable kidney function. Verify against the lab's reported eGFR and your facility's renal-dosing policy.",
  };
}

/**
 * 5.2 Pediatric maintenance IV fluids — 4-2-1 rule (hourly) with the
 * equivalent Holliday-Segar daily total.
 */
export function pediatricMaintenanceFluid({ weightKg }) {
  let perHr;
  let band;
  if (weightKg <= 10) {
    perHr = 4 * weightKg;
    band = `4 mL/kg/h × ${round(weightKg, 1)} kg`;
  } else if (weightKg <= 20) {
    perHr = 40 + 2 * (weightKg - 10);
    band = `40 + 2 mL/kg/h × ${round(weightKg - 10, 1)} kg`;
  } else {
    perHr = 60 + (weightKg - 20);
    band = `60 + 1 mL/kg/h × ${round(weightKg - 20, 1)} kg`;
  }

  let perDay;
  if (weightKg <= 10) perDay = 100 * weightKg;
  else if (weightKg <= 20) perDay = 1000 + 50 * (weightKg - 10);
  else perDay = 1500 + 20 * (weightKg - 20);

  return {
    value: round(perHr, 1),
    unit: "mL/hr",
    perDay: round(perDay),
    methods: {
      formula: `4-2-1 rule: ${band} = ${round(perHr, 1)} mL/hr  (≈ ${round(perDay)} mL/day)`,
    },
    steps: [
      "First 10 kg: 4 mL/kg/h",
      "Next 10 kg (10–20): 2 mL/kg/h",
      "Each kg over 20: 1 mL/kg/h",
      `Rate = ${round(perHr, 1)} mL/hr  →  Holliday-Segar daily = ${round(perDay)} mL/day`,
    ],
    note: "Routine maintenance rate only. Not for neonates < 14 days or < 3 kg. Current guidance favors isotonic maintenance fluids; fluid type and any deficit / ongoing losses are the prescriber's decision.",
  };
}

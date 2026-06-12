/**
 * NurseCalc — Calculation Engine
 * ------------------------------------------------------------------
 * Pure functions only. No DOM, no React, no side effects.
 * Every function returns: { value, unit, steps: [], methods: {...} }
 * so the UI can render the answer AND the worked solution in all 3 methods.
 *
 * Formulas grounded in: Open RN / OpenStax dosage-calculation curriculum,
 * Gray Morris "Calculate with Confidence", Lippincott pocket card,
 * and the named nursing drug handbooks (see reference doc).
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

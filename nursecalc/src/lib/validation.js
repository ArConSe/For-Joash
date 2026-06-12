/**
 * NurseCalc — Validation & Safety Engine
 * ------------------------------------------------------------------
 * Runs BEFORE any result is shown. Returns:
 *   { errors: [], warnings: [], banners: [] }
 *   - errors  → blocking. Show these instead of a result.
 *   - warnings→ non-blocking. Show alongside the result.
 *   - banners → standing notices (e.g. high-alert 2-nurse check).
 *
 * Principles reflect ISMP high-alert medication handling as expressed
 * in the nursing drug handbooks (Davis's / Mosby's "High Alert").
 * ------------------------------------------------------------------
 */

export const DISCLAIMER =
  "Reference & learning tool. Verify against the order and facility policy. Not a substitute for clinical judgment.";

/** Generic required-field + numeric guard. */
export function requireNumbers(fields) {
  const errors = [];
  for (const [name, val] of Object.entries(fields)) {
    if (val === "" || val === null || val === undefined) {
      errors.push(`Enter a value for ${name}.`);
    } else if (Number.isNaN(Number(val))) {
      errors.push(`${name} must be a number.`);
    } else if (Number(val) < 0) {
      errors.push(`${name} cannot be negative.`);
    }
  }
  return errors;
}

/** Weight plausibility — catches lb-entered-as-kg and typos. */
export function validateWeight(weight, weightUnit = "kg") {
  const warnings = [];
  const errors = [];
  const kg = weightUnit === "lb" ? weight / 2.2 : weight;
  if (kg <= 0) errors.push("Weight must be greater than zero.");
  if (kg > 0 && kg < 0.5) warnings.push("Weight is under 0.5 kg — verify (neonate?) or check the unit (lb vs kg).");
  if (kg > 300) warnings.push("Weight over 300 kg — verify; possible lb entered as kg.");
  return { errors, warnings };
}

/** Magnitude / plausibility checks on a result, by calculation type. */
export function validateResult(type, value) {
  const warnings = [];
  switch (type) {
    case "oralTablet":
      if (value > 4) warnings.push(`${value} tablets is unusually high — verify the order and dose.`);
      if (!Number.isInteger(value) && value % 0.5 !== 0)
        warnings.push("Result is not a whole or half tablet — only scored tablets can be split.");
      break;
    case "dripRate":
      if (value > 250) warnings.push(`${value} gtt/min is very fast for gravity — verify; a pump may be safer.`);
      if (value < 1) warnings.push("Drip rate rounds to <1 gtt/min — verify volume/time.");
      break;
    case "pumpRate":
    case "rate":
      if (value > 999) warnings.push(`${value} mL/hr exceeds typical pump limits — verify.`);
      break;
    default:
      break;
  }
  return warnings;
}

/** Unit-consistency reminder for titration inputs. */
export function validateConcentrationInputs({ totalDrug, totalVolumeMl }) {
  const errors = [];
  if (Number(totalVolumeMl) <= 0) errors.push("Total volume must be greater than zero.");
  if (Number(totalDrug) <= 0) errors.push("Total drug amount must be greater than zero.");
  return errors;
}

/**
 * High-alert banner logic.
 * Pass the drug preset (or a category string) and get standing banners.
 */
export function highAlertBanners({ drug, category }) {
  const banners = [];
  const isHighAlert =
    (drug && drug.highAlert) ||
    ["pressor", "inotrope", "anticoagulant", "insulin", "antiarrhythmic", "vasodilator"].includes(category);

  if (isHighAlert) {
    banners.push({
      level: "high-alert",
      text: "HIGH-ALERT medication. Independent double-check of the order, dose calculation, and pump settings by a second nurse before starting and at every titration.",
    });
  }
  if (drug && drug.vesicant) {
    banners.push({
      level: "vesicant",
      text: "Vesicant — give via large vein/central line if possible. On extravasation: stop, do NOT flush, aspirate, then antidote per facility policy.",
    });
  }
  if (drug && drug.lasa) {
    banners.push({ level: "lasa", text: `Look-alike/sound-alike: ${drug.lasa}. Verify carefully.` });
  }
  return banners;
}

/** Pediatric flag → always recommend double-check + pediatric reference. */
export function pediatricBanner(isPediatric) {
  return isPediatric
    ? [{
        level: "pediatric",
        text: "Pediatric dose — independent double-check recommended. Defer to a pediatric reference and facility protocol; do not use adult presets.",
      }]
    : [];
}

/**
 * Dose-range check against a preset's published range (non-blocking —
 * ranges are titration guides; the order/protocol overrides).
 */
export function validateDoseRange({ dose, doseRange, label = "dose" }) {
  const warnings = [];
  if (dose == null || !doseRange) return warnings;
  if (dose < doseRange.min)
    warnings.push(
      `Ordered ${label} ${dose} is below the usual range (${doseRange.min}–${doseRange.max} ${doseRange.unit}) — verify the order.`
    );
  else if (dose > doseRange.max)
    warnings.push(
      `Ordered ${label} ${dose} exceeds the usual range (${doseRange.min}–${doseRange.max} ${doseRange.unit}) — verify the order and protocol.`
    );
  return warnings;
}

/**
 * Top-level runner a screen calls.
 * Returns the combined { errors, warnings, banners } object.
 */
export function runValidation({ inputs = {}, weight, weightUnit, resultType, resultValue, drug, category, isPediatric }) {
  const errors = [];
  const warnings = [];
  let banners = [];

  errors.push(...requireNumbers(inputs));

  if (weight != null) {
    const w = validateWeight(Number(weight), weightUnit);
    errors.push(...w.errors);
    warnings.push(...w.warnings);
  }

  if (resultType && resultValue != null && errors.length === 0) {
    warnings.push(...validateResult(resultType, resultValue));
  }

  banners = banners
    .concat(highAlertBanners({ drug, category }))
    .concat(pediatricBanner(isPediatric));

  return { errors, warnings, banners };
}

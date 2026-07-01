import { useMemo, useState } from "react";
import { cockcroftGault, idealBodyWeightKg, adjustedBodyWeightKg } from "../lib/calc-engine.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle } from "../components/Field.jsx";

const SEX = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];
const SCR_UNITS = [
  { value: "mg/dL", label: "mg/dL" },
  { value: "umol/L", label: "µmol/L" },
];
const BASIS = [
  { value: "actual", label: "Actual" },
  { value: "ideal", label: "Ideal" },
  { value: "adjusted", label: "Adjusted" },
];

/**
 * Estimated creatinine clearance (Cockcroft-Gault) for renal dose-checking.
 * Supports mg/dL and µmol/L creatinine, and lets the user pick which body
 * weight to plug in (actual / ideal / adjusted) — the clinical judgment the
 * formula hides — with Devine ideal body weight shown for context.
 */
export default function GFR() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [scr, setScr] = useState("");
  const [scrUnit, setScrUnit] = useState("mg/dL");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [basis, setBasis] = useState("actual");

  const pristine = age === "" && weight === "" && scr === "";

  const { result, validation, ibw } = useMemo(() => {
    const validation = { errors: [], warnings: [], banners: [] };
    if (pristine) return { result: null, validation, ibw: null };

    const a = Number(age);
    const w = Number(weight);
    const s = Number(scr);
    const h = Number(height);
    const needHeight = basis !== "actual";

    if (age === "" || !(a > 0)) validation.errors.push("Enter the patient's age in years.");
    else if (a > 120) validation.errors.push("Check the age — Cockcroft-Gault expects adult years (≤ 120).");
    if (weight === "" || !(w > 0)) validation.errors.push("Enter weight in kg.");
    if (scr === "" || !(s > 0)) validation.errors.push("Enter serum creatinine.");
    if (needHeight && (height === "" || !(h > 0)))
      validation.errors.push("Enter height to use ideal / adjusted body weight.");

    const ibw = h > 0 ? idealBodyWeightKg({ heightCm: h, sex }) : null;
    let chosen = w;
    if (basis === "ideal" && ibw != null) chosen = ibw;
    if (basis === "adjusted" && ibw != null) chosen = adjustedBodyWeightKg({ actualKg: w, ibwKg: ibw });

    let result = null;
    if (validation.errors.length === 0) {
      result = cockcroftGault({ age: a, weightKg: chosen, sex, scr: s, scrUnit });
      const scrMgDl = scrUnit === "umol/L" ? s / 88.4 : s;
      if (scrMgDl < 0.6)
        validation.warnings.push(
          "Low serum creatinine can overestimate CrCl, especially in older or low-muscle-mass patients — interpret with caution."
        );
      if (a < 18)
        validation.warnings.push(
          "Cockcroft-Gault is validated in adults — for children use a pediatric (e.g. Schwartz) method."
        );
      if (ibw != null && basis === "actual" && w > ibw * 1.3)
        validation.warnings.push(
          "Weight is >30% over ideal body weight — many references switch to ideal or adjusted weight here."
        );
      if (ibw != null && basis !== "actual" && w < ibw)
        validation.warnings.push(
          "Actual weight is below ideal — use actual weight; ideal / adjusted would overestimate CrCl here."
        );
    }
    return { result, validation, ibw };
  }, [age, sex, scr, scrUnit, weight, height, basis, pristine]);

  const subline = result
    ? `Estimated category: ${result.category}${ibw != null ? ` · Ideal body weight ≈ ${ibw.toFixed(1)} kg` : ""}`
    : null;

  return (
    <CalculatorShell
      title="Creatinine Clearance (Cockcroft-Gault)"
      description="Estimates kidney function (CrCl) for renal dose-checking. CrCl = ((140 − age) × weight × sex) ÷ (72 × serum creatinine)."
      validation={validation}
      result={result}
      resultLabel="Estimated CrCl"
      showState={false}
      resultSubline={subline}
      howTo={[
        "Enter the patient's age, sex, and serum creatinine (pick mg/dL or µmol/L to match the lab report).",
        "Enter the patient's actual weight — and height, if you plan to use ideal or adjusted weight.",
        "Choose the weight basis: Actual normally; switch to Ideal or Adjusted if the patient is >30% over ideal body weight.",
        "Read the estimated CrCl and its rough interpretation band, then verify against the lab's eGFR and facility renal-dosing policy.",
      ]}
      howToExample="60-year-old male, 70 kg, SCr 1.0 mg/dL → CrCl ≈ 77.8 mL/min."
    >
      <div className="grid grid-cols-2 gap-3">
        <NumField label="Age" value={age} onChange={setAge} suffix="years" placeholder="e.g. 65" />
        <div>
          <Toggle label="Sex" options={SEX} value={sex} onChange={setSex} />
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <NumField label="Serum creatinine" value={scr} onChange={setScr} placeholder="e.g. 1.0" />
        </div>
        <Toggle label="Unit" options={SCR_UNITS} value={scrUnit} onChange={setScrUnit} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumField label="Weight" value={weight} onChange={setWeight} suffix="kg" placeholder="e.g. 70" />
        <NumField label="Height" value={height} onChange={setHeight} suffix="cm" placeholder="for ideal wt" />
      </div>

      <div>
        <div className="overflow-x-auto pb-1">
          <Toggle label="Weight basis" options={BASIS} value={basis} onChange={setBasis} />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Use <b>Actual</b> normally; switch to <b>Ideal</b> or <b>Adjusted</b> if the patient is
          &gt;30% over ideal body weight (needs height).
        </p>
      </div>
    </CalculatorShell>
  );
}

import { useMemo, useState } from "react";
import {
  doseToRateWeight,
  rateToDoseWeight,
  doseToRateMcgMin,
  rateToDoseMcgMin,
  doseToRateMgMin,
  rateToDoseMgMin,
  doseToRateMgHr,
  rateToDoseMgHr,
  unitsToRate,
  rateToUnits,
} from "../lib/calc-engine.js";
import { runValidation, validateDoseRange } from "../lib/validation.js";
import { formatMlHr } from "../lib/format.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle, SelectField, WeightField } from "../components/Field.jsx";
import presets from "../data/drug-presets.json";

const DOSE_UNIT = {
  mcgKgMin: "mcg/kg/min",
  mcgMin: "mcg/min",
  mgMin: "mg/min",
  mgHr: "mg/hr",
  unitsHr: "units/hr",
};

// engine function pairs per dose mode: [dose→rate, rate→dose]
const ENGINES = {
  mcgKgMin: [doseToRateWeight, rateToDoseWeight],
  mcgMin: [doseToRateMcgMin, rateToDoseMcgMin],
  mgMin: [doseToRateMgMin, rateToDoseMgMin],
  mgHr: [doseToRateMgHr, rateToDoseMgHr],
  unitsHr: [unitsToRate, rateToUnits],
};

export default function Titration() {
  const [drugId, setDrugId] = useState(presets.drugs[0].id);
  const [presetIdx, setPresetIdx] = useState("0");
  const [customDrug, setCustomDrug] = useState("");
  const [customVol, setCustomVol] = useState("");
  const [direction, setDirection] = useState("doseToRate");
  const [dose, setDose] = useState("");
  const [rate, setRate] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [precision, setPrecision] = useState("tenths");

  const drug = presets.drugs.find((d) => d.id === drugId);
  const mode = drug.doseMode;
  const isUnits = mode === "unitsHr";
  const needsWeight = mode === "mcgKgMin";
  const isCustom = presetIdx === "custom";
  const preset = isCustom ? null : drug.presets[Number(presetIdx)];
  const totalDrug = isCustom ? Number(customDrug) : (isUnits ? preset.totalUnits : preset.totalDrugMg);
  const totalVolumeMl = isCustom ? Number(customVol) : preset.totalVolumeMl;

  const doseUnit = DOSE_UNIT[mode];
  const pristine = direction === "doseToRate" ? dose === "" : rate === "";

  const { result, validation } = useMemo(() => {
    const banner = runValidation({ drug, category: drug.category });
    if (pristine) return { result: null, validation: banner };

    const inputs =
      direction === "doseToRate"
        ? { [`Ordered dose (${doseUnit})`]: dose }
        : { "Pump rate (mL/hr)": rate };
    if (isCustom) {
      inputs[`Total drug in bag (${isUnits ? "units" : "mg"})`] = customDrug;
      inputs["Total bag volume (mL)"] = customVol;
    }
    const positive = { ...inputs }; // weight's zero case is owned by validateWeight
    if (needsWeight) inputs["Weight"] = weight;

    let result = null;
    const ready =
      totalDrug > 0 &&
      totalVolumeMl > 0 &&
      (!needsWeight || Number(weight) > 0) &&
      (direction === "doseToRate" ? Number(dose) > 0 : Number(rate) > 0);

    if (ready) {
      const [toRate, toDose] = ENGINES[mode];
      const conc = isUnits
        ? { totalUnits: totalDrug, totalVolumeMl }
        : { totalDrugMg: totalDrug, totalVolumeMl };
      const w = needsWeight ? { weight: Number(weight), weightUnit } : {};
      if (direction === "doseToRate") {
        const doseArg = {
          mcgKgMin: { doseMcgKgMin: Number(dose) },
          mcgMin: { doseMcgMin: Number(dose) },
          mgMin: { doseMgMin: Number(dose) },
          mgHr: { doseMgHr: Number(dose) },
          unitsHr: { unitsPerHr: Number(dose) },
        }[mode];
        result = toRate({ ...doseArg, ...w, ...conc });
      } else {
        result = toDose({ rateMlHr: Number(rate), ...w, ...conc });
      }
    }

    const v = runValidation({
      inputs,
      positive,
      weight: needsWeight && weight !== "" ? weight : null,
      weightUnit,
      resultType: direction === "doseToRate" ? "rate" : null,
      resultValue: result?.value,
      drug,
      category: drug.category,
    });
    // compare the ordered/derived dose against the preset's published range
    const doseForRange =
      direction === "doseToRate" ? Number(dose) : result?.value;
    // only when the published range is in the same unit the screen doses in
    // (e.g. heparin's range is units/kg/hr per nomogram — not comparable)
    if (doseForRange && drug.doseRange?.unit?.startsWith(doseUnit)) {
      v.warnings.push(
        ...validateDoseRange({ dose: doseForRange, doseRange: drug.doseRange, label: `dose (${doseUnit})` })
      );
    }
    return { result, validation: v };
  }, [drug, direction, dose, rate, weight, weightUnit, isCustom, customDrug, customVol, totalDrug, totalVolumeMl, mode, doseUnit, needsWeight, isUnits, pristine]);

  // pump-precision display: show whole-number rate with the unrounded engine value
  const displayResult =
    result && result.unit === "mL/hr" && precision === "whole"
      ? { ...result, display: formatMlHr(result.value, "whole"), rawValue: result.value }
      : result;

  const concLabel = result
    ? `Bag concentration: ${result.concMcgMl ?? result.concMgMl ?? result.concUnitsMl} ${
        result.concMcgMl != null ? "mcg/mL" : result.concMgMl != null ? "mg/mL" : "units/mL"
      }${needsWeight && result.weightKg ? ` · Weight: ${result.weightKg} kg` : ""}`
    : null;

  return (
    <CalculatorShell
      title="Titration (Critical-Care Drips)"
      description="Bidirectional: ordered dose → pump rate, or current rate → dose (verify a running drip). Presets are institution-variable — the order and facility policy override."
      validation={validation}
      result={displayResult}
      resultSubline={concLabel}
      highAlert={drug.highAlert}
      drug={drug}
      howTo={[
        "Select the drug, then the bag concentration (or enter a custom total drug amount and bag volume).",
        "Choose a direction: Dose → mL/hr to find the pump rate for an ordered dose, or mL/hr → Dose to check what dose a running rate is delivering.",
        "Enter the dose (or the current pump rate) and, for weight-based drips, the patient's weight.",
        "Check the result against the drug's usual range and read the nursing considerations for high-alert / vesicant warnings before acting.",
      ]}
      howToExample="Dopamine 5 mcg/kg/min at 86 kg, 400 mg/250 mL bag → 16.1 mL/hr."
    >
      <SelectField label="Drug" value={drugId} onChange={(v) => { setDrugId(v); setPresetIdx("0"); }}>
        {presets.drugs.map((d) => (
          <option key={d.id} value={d.id}>
            {d.generic}
            {d.brand && d.brand !== "—" ? ` (${d.brand})` : ""}
          </option>
        ))}
      </SelectField>

      <SelectField label="Bag concentration" value={presetIdx} onChange={setPresetIdx}>
        {drug.presets.map((p, i) => (
          <option key={i} value={String(i)}>
            {p.label}
          </option>
        ))}
        <option value="custom">Custom…</option>
      </SelectField>

      {isCustom && (
        <div className="grid grid-cols-2 gap-3">
          <NumField
            label={`Total drug in bag`}
            value={customDrug}
            onChange={setCustomDrug}
            suffix={isUnits ? "units" : "mg"}
          />
          <NumField label="Total bag volume" value={customVol} onChange={setCustomVol} suffix="mL" />
        </div>
      )}

      <Toggle
        label="Direction"
        options={[
          { value: "doseToRate", label: `Dose → mL/hr` },
          { value: "rateToDose", label: `mL/hr → Dose` },
        ]}
        value={direction}
        onChange={setDirection}
      />

      {direction === "doseToRate" ? (
        <NumField label={`Ordered dose (${doseUnit})`} value={dose} onChange={setDose} suffix={doseUnit} />
      ) : (
        <NumField label="Current pump rate" value={rate} onChange={setRate} suffix="mL/hr" />
      )}

      {needsWeight && (
        <WeightField weight={weight} setWeight={setWeight} weightUnit={weightUnit} setWeightUnit={setWeightUnit} />
      )}

      {direction === "doseToRate" && (
        <Toggle
          label="Pump precision"
          options={[
            { value: "tenths", label: "0.1 mL/hr" },
            { value: "whole", label: "whole mL/hr" },
          ]}
          value={precision}
          onChange={setPrecision}
        />
      )}

      {drug.doseRange && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Usual range: {drug.doseRange.min}–{drug.doseRange.max} {drug.doseRange.unit}
          {drug.rangeNote ? ` (${drug.rangeNote})` : ""}
        </p>
      )}
    </CalculatorShell>
  );
}

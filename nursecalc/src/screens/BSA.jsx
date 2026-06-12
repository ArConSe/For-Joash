import { useMemo, useState } from "react";
import { bsaMosteller, bsaDose, lbToKg } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle, WeightField } from "../components/Field.jsx";
import ResultCard from "../components/ResultCard.jsx";
import WorkedSolution from "../components/WorkedSolution.jsx";

export default function BSA() {
  const [heightCm, setHeightCm] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [dosePerM2, setDosePerM2] = useState("");
  const pristine = heightCm === "" && weight === "";

  const { result, doseResult, validation } = useMemo(() => {
    if (pristine)
      return { result: null, doseResult: null, validation: { errors: [], warnings: [], banners: [] } };
    const kg = weightUnit === "lb" ? lbToKg(Number(weight)) : Number(weight);
    let result = null;
    let doseResult = null;
    if (Number(heightCm) > 0 && kg > 0) {
      result = bsaMosteller({ heightCm: Number(heightCm), weightKg: kg });
      if (Number(dosePerM2) > 0) {
        doseResult = bsaDose({ dosePerM2: Number(dosePerM2), bsa: result.value });
      }
    }
    const validation = runValidation({
      inputs: { "Height (cm)": heightCm, Weight: weight },
      weight: weight === "" ? null : weight,
      weightUnit,
    });
    return { result, doseResult, validation };
  }, [heightCm, weight, weightUnit, dosePerM2, pristine]);

  return (
    <CalculatorShell
      title="Body Surface Area (Mosteller)"
      description="BSA = √[(height cm × weight kg) ÷ 3600]. Optionally compute a BSA-based dose (e.g. chemotherapy — always double-checked per protocol)."
      validation={validation}
      result={result}
      resultSubline={result && weightUnit === "lb" ? `Weight converted: ${weight} lb ÷ 2.2 = ${(Number(weight) / 2.2).toFixed(2)} kg` : null}
    >
      <NumField label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" placeholder="e.g. 165" />
      <WeightField weight={weight} setWeight={setWeight} weightUnit={weightUnit} setWeightUnit={setWeightUnit} />
      <NumField
        label="Ordered dose per m² (optional)"
        value={dosePerM2}
        onChange={setDosePerM2}
        suffix="mg/m²"
        placeholder="e.g. 75"
      />
      {doseResult && (
        <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <ResultCard result={doseResult} subline="BSA-based dose" />
          <WorkedSolution result={doseResult} />
        </div>
      )}
    </CalculatorShell>
  );
}

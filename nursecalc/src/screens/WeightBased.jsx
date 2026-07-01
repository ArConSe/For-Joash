import { useMemo, useState } from "react";
import { weightBased } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle, WeightField } from "../components/Field.jsx";

export default function WeightBased() {
  const [dosePerKg, setDosePerKg] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [unitLabel, setUnitLabel] = useState("mg");
  const [isPediatric, setIsPediatric] = useState(false);

  const pristine = dosePerKg === "" && weight === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(dosePerKg) > 0 && Number(weight) > 0) {
      result = weightBased({
        dosePerKg: Number(dosePerKg),
        weight: Number(weight),
        weightUnit,
        unitLabel,
      });
    }
    const validation = runValidation({
      inputs: { [`Dose per kg (${unitLabel}/kg)`]: dosePerKg, Weight: weight },
      positive: { [`Dose per kg (${unitLabel}/kg)`]: dosePerKg },
      weight: weight === "" ? null : weight,
      weightUnit,
      isPediatric,
    });
    return { result, validation };
  }, [dosePerKg, weight, weightUnit, unitLabel, isPediatric, pristine]);

  return (
    <CalculatorShell
      title="Weight-Based Dosing"
      description="Dose = ordered dose per kg × weight in kg. The kg conversion is always shown in the worked solution."
      validation={validation}
      result={result}
      resultSubline={result ? `Weight used: ${result.weightKg} kg` : null}
      howTo={[
        "Enter the ordered dose per kg (mg/kg or mcg/kg) from the order.",
        "Enter the patient's weight and pick kg or lb — lb is auto-converted to kg.",
        "Check the pediatric box if relevant, for pediatric-specific warnings.",
        "Read the total dose to give.",
      ]}
      howToExample="Ordered 5 mg/kg, patient weighs 154 lb (70 kg) → 350 mg."
    >
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <NumField
            label={`Ordered dose (${unitLabel}/kg)`}
            value={dosePerKg}
            onChange={setDosePerKg}
            suffix={`${unitLabel}/kg`}
            placeholder="e.g. 5"
          />
        </div>
        <Toggle
          options={[
            { value: "mg", label: "mg" },
            { value: "mcg", label: "mcg" },
          ]}
          value={unitLabel}
          onChange={setUnitLabel}
        />
      </div>
      <WeightField weight={weight} setWeight={setWeight} weightUnit={weightUnit} setWeightUnit={setWeightUnit} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPediatric}
          onChange={(e) => setIsPediatric(e.target.checked)}
          className="h-4 w-4 accent-teal-600"
        />
        Pediatric patient
      </label>
    </CalculatorShell>
  );
}

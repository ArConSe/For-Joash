import { useMemo, useState } from "react";
import { safeDoseRange } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle, WeightField } from "../components/Field.jsx";

export default function SafeDoseRange() {
  const [minPerKg, setMinPerKg] = useState("");
  const [maxPerKg, setMaxPerKg] = useState("");
  const [orderedDose, setOrderedDose] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [unitLabel, setUnitLabel] = useState("mg");
  const [isPediatric, setIsPediatric] = useState(true);

  const pristine = minPerKg === "" && maxPerKg === "" && weight === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(minPerKg) > 0 && Number(maxPerKg) > 0 && Number(weight) > 0) {
      result = safeDoseRange({
        minPerKg: Number(minPerKg),
        maxPerKg: Number(maxPerKg),
        weight: Number(weight),
        weightUnit,
        orderedDose: orderedDose === "" ? null : Number(orderedDose),
        unitLabel,
      });
    }
    const validation = runValidation({
      inputs: {
        [`Reference minimum (${unitLabel}/kg)`]: minPerKg,
        [`Reference maximum (${unitLabel}/kg)`]: maxPerKg,
        Weight: weight,
      },
      weight: weight === "" ? null : weight,
      weightUnit,
      isPediatric,
    });
    if (result && Number(minPerKg) > Number(maxPerKg)) {
      validation.errors.push("Reference minimum is greater than the maximum — check the values.");
    }
    return { result, validation };
  }, [minPerKg, maxPerKg, orderedDose, weight, weightUnit, unitLabel, isPediatric, pristine]);

  const shellResult = result
    ? {
        ...result,
        display: `${result.min}–${result.max} ${result.unit}`,
        value: result.max,
      }
    : null;

  return (
    <CalculatorShell
      title="Safe Dose Range"
      description="Safe range = reference min/max per kg × weight. Classifies the ordered dose as SAFE, BELOW, or EXCEEDS."
      validation={validation}
      result={shellResult}
      resultSubline={
        result && orderedDose !== ""
          ? `Ordered ${orderedDose} ${result.unit}: ${result.classification}`
          : result
            ? "Enter the ordered dose to classify it."
            : null
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <NumField label={`Reference min`} value={minPerKg} onChange={setMinPerKg} suffix={`${unitLabel}/kg`} placeholder="e.g. 5" />
        <NumField label={`Reference max`} value={maxPerKg} onChange={setMaxPerKg} suffix={`${unitLabel}/kg`} placeholder="e.g. 10" />
      </div>
      <Toggle
        options={[
          { value: "mg", label: "mg" },
          { value: "mcg", label: "mcg" },
        ]}
        value={unitLabel}
        onChange={setUnitLabel}
      />
      <WeightField weight={weight} setWeight={setWeight} weightUnit={weightUnit} setWeightUnit={setWeightUnit} />
      <NumField
        label={`Ordered dose to check (optional)`}
        value={orderedDose}
        onChange={setOrderedDose}
        suffix={unitLabel}
        placeholder="e.g. 200"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPediatric}
          onChange={(e) => setIsPediatric(e.target.checked)}
          className="h-4 w-4 accent-cyan-600"
        />
        Pediatric patient
      </label>
    </CalculatorShell>
  );
}

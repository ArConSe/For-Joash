import { useMemo, useState } from "react";
import { liquidDose } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField } from "../components/Field.jsx";

export default function LiquidOral() {
  const [desired, setDesired] = useState("");
  const [onHand, setOnHand] = useState("");
  const [perVolume, setPerVolume] = useState("");
  const pristine = desired === "" && onHand === "" && perVolume === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(desired) > 0 && Number(onHand) > 0 && Number(perVolume) > 0) {
      result = liquidDose({
        desired: Number(desired),
        onHand: Number(onHand),
        perVolume: Number(perVolume),
      });
    }
    const inputs = {
      "Ordered dose (D)": desired,
      "Strength on hand (H)": onHand,
      "Vehicle volume (Q)": perVolume,
    };
    const validation = runValidation({ inputs, positive: inputs });
    return { result, validation };
  }, [desired, onHand, perVolume, pristine]);

  return (
    <CalculatorShell
      title="Liquid / Injectable Dose"
      description="mL = (Desired ÷ on Hand) × Quantity. Works for oral liquids and parenteral solutions."
      validation={validation}
      result={result}
    >
      <NumField label="Ordered dose (D)" value={desired} onChange={setDesired} suffix="mg" placeholder="e.g. 160" />
      <div className="grid grid-cols-2 gap-3">
        <NumField label="Strength on hand (H)" value={onHand} onChange={setOnHand} suffix="mg" placeholder="e.g. 100" />
        <NumField label="…per volume (Q)" value={perVolume} onChange={setPerVolume} suffix="mL" placeholder="e.g. 5" />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Example: label reads "100 mg / 5 mL" → H = 100, Q = 5.
      </p>
    </CalculatorShell>
  );
}

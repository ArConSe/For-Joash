import { useMemo, useState } from "react";
import { oralTablet } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField } from "../components/Field.jsx";

export default function OralTablet() {
  const [desired, setDesired] = useState("");
  const [onHand, setOnHand] = useState("");
  const pristine = desired === "" && onHand === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(desired) > 0 && Number(onHand) > 0) {
      result = oralTablet({ desired: Number(desired), onHand: Number(onHand) });
    }
    const inputs = { "Ordered dose (D)": desired, "Tablet strength on hand (H)": onHand };
    const validation = runValidation({
      inputs,
      positive: inputs,
      resultType: "oralTablet",
      resultValue: result?.value,
    });
    return { result, validation };
  }, [desired, onHand, pristine]);

  return (
    <CalculatorShell
      title="Oral / Tablet Dose"
      description="Tablets = Desired (D) ÷ on Hand (H)."
      validation={validation}
      result={result}
    >
      <NumField label="Ordered dose (D)" value={desired} onChange={setDesired} suffix="mg" placeholder="e.g. 500" />
      <NumField label="Tablet strength on hand (H)" value={onHand} onChange={setOnHand} suffix="mg/tab" placeholder="e.g. 250" />
    </CalculatorShell>
  );
}

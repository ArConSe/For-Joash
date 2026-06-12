import { useMemo, useState } from "react";
import { reconstitution } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField } from "../components/Field.jsx";

export default function Reconstitution() {
  const [desired, setDesired] = useState("");
  const [conc, setConc] = useState("");
  const pristine = desired === "" && conc === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(desired) > 0 && Number(conc) > 0) {
      result = reconstitution({ desired: Number(desired), reconstitutedConc: Number(conc) });
    }
    const validation = runValidation({
      inputs: { "Ordered dose (mg)": desired, "Reconstituted concentration (mg/mL)": conc },
    });
    return { result, validation };
  }, [desired, conc, pristine]);

  return (
    <CalculatorShell
      title="Reconstitution"
      description="mL to draw up = Ordered dose ÷ reconstituted concentration. The concentration AFTER adding diluent is on the vial label — read it, don't assume."
      validation={validation}
      result={result}
    >
      <NumField label="Ordered dose" value={desired} onChange={setDesired} suffix="mg" placeholder="e.g. 1000" />
      <NumField
        label="Concentration after reconstitution (from vial label)"
        value={conc}
        onChange={setConc}
        suffix="mg/mL"
        placeholder="e.g. 200"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Example: "Add 4.8 mL diluent to yield 200 mg/mL" → enter 200.
      </p>
    </CalculatorShell>
  );
}

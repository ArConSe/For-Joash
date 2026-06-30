import { useMemo, useState } from "react";
import { pediatricMaintenanceFluid } from "../lib/calc-engine.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField } from "../components/Field.jsx";

/**
 * Pediatric routine maintenance IV fluids — the bedside 4-2-1 hourly rate
 * with the equivalent Holliday-Segar daily total, plus the key safety guards
 * (not for neonates < 14 days or < 3 kg).
 */
export default function PediatricFluids() {
  const [weight, setWeight] = useState("");
  const pristine = weight === "";

  const { result, validation } = useMemo(() => {
    const validation = { errors: [], warnings: [], banners: [] };
    if (pristine) return { result: null, validation };

    const w = Number(weight);
    if (weight === "" || !(w > 0)) {
      validation.errors.push("Enter the child's weight in kg.");
      return { result: null, validation };
    }

    const result = pediatricMaintenanceFluid({ weightKg: w });
    if (w < 3)
      validation.warnings.push(
        "Under 3 kg — the 4-2-1 rule is not reliable; use a neonatal fluid protocol."
      );
    else if (w < 4)
      validation.warnings.push(
        "Not for neonates under 14 days old — the rule overestimates their fluid needs."
      );
    if (w > 40)
      validation.warnings.push(
        "At adult-range weights, maintenance is usually capped (~2,400 mL/day) — verify against policy."
      );
    return { result, validation };
  }, [weight, pristine]);

  return (
    <CalculatorShell
      title="Pediatric Maintenance Fluids (4-2-1)"
      description="Routine hourly IV maintenance rate for children: 4 mL/kg/h for the first 10 kg + 2 for the next 10 kg + 1 for each kg over 20."
      validation={validation}
      result={result}
      resultLabel="Maintenance rate"
      showState={false}
      resultSubline={result ? `Holliday-Segar daily total ≈ ${result.perDay} mL/day` : null}
    >
      <NumField label="Child's weight" value={weight} onChange={setWeight} suffix="kg" placeholder="e.g. 22" />
    </CalculatorShell>
  );
}

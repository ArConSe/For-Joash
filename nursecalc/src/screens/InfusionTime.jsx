import { useMemo, useState } from "react";
import { infusionTime } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import { completionTime } from "../lib/format.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField } from "../components/Field.jsx";

export default function InfusionTime() {
  const [volumeMl, setVolumeMl] = useState("");
  const [rateMlHr, setRateMlHr] = useState("");
  const pristine = volumeMl === "" && rateMlHr === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    let result = null;
    if (Number(volumeMl) > 0 && Number(rateMlHr) > 0) {
      result = infusionTime({ volumeMl: Number(volumeMl), rateMlHr: Number(rateMlHr) });
    }
    const inputs = { "Volume (mL)": volumeMl, "Rate (mL/hr)": rateMlHr };
    const validation = runValidation({ inputs, positive: inputs });
    return { result, validation };
  }, [volumeMl, rateMlHr, pristine]);

  return (
    <CalculatorShell
      title="Infusion Time"
      description="Time = Volume ÷ Rate. Know when the bag runs out."
      validation={validation}
      result={result}
      resultSubline={result ? `If started now, finishes around ${completionTime(result.value)}.` : null}
    >
      <NumField label="Volume remaining in bag" value={volumeMl} onChange={setVolumeMl} suffix="mL" placeholder="e.g. 1000" />
      <NumField label="Current rate" value={rateMlHr} onChange={setRateMlHr} suffix="mL/hr" placeholder="e.g. 125" />
    </CalculatorShell>
  );
}

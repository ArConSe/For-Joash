import { useMemo, useState } from "react";
import { pumpRate } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import { formatMlHr } from "../lib/format.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle } from "../components/Field.jsx";

export default function IVPumpRate() {
  const [volumeMl, setVolumeMl] = useState("");
  const [timeHr, setTimeHr] = useState("");
  const [timeMin, setTimeMin] = useState("");
  const [precision, setPrecision] = useState("tenths");
  const pristine = volumeMl === "" && timeHr === "" && timeMin === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    const hours = Number(timeHr || 0) + Number(timeMin || 0) / 60;
    let result = null;
    if (Number(volumeMl) > 0 && hours > 0) {
      result = pumpRate({ volumeMl: Number(volumeMl), timeHr: hours });
    }
    const validation = runValidation({
      inputs: {
        "Volume (mL)": volumeMl,
        "Infusion time": timeHr === "" && timeMin === "" ? "" : hours,
      },
      resultType: "pumpRate",
      resultValue: result?.value,
    });
    return { result, validation };
  }, [volumeMl, timeHr, timeMin, pristine]);

  const displayResult =
    result && precision === "whole"
      ? { ...result, display: formatMlHr(result.value, "whole"), rawValue: result.value }
      : result;

  return (
    <CalculatorShell
      title="IV Pump Rate (mL/hr)"
      description="Rate = Volume ÷ Time in hours. For electronic infusion pumps."
      validation={validation}
      result={displayResult}
    >
      <NumField label="Total volume to infuse" value={volumeMl} onChange={setVolumeMl} suffix="mL" placeholder="e.g. 1000" />
      <div className="grid grid-cols-2 gap-3">
        <NumField label="Time — hours" value={timeHr} onChange={setTimeHr} suffix="hr" placeholder="e.g. 8" />
        <NumField label="Time — minutes" value={timeMin} onChange={setTimeMin} suffix="min" placeholder="0" />
      </div>
      <Toggle
        label="Pump precision"
        options={[
          { value: "tenths", label: "0.1 mL/hr" },
          { value: "whole", label: "whole mL/hr" },
        ]}
        value={precision}
        onChange={setPrecision}
      />
    </CalculatorShell>
  );
}

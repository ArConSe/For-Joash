import { useMemo, useState } from "react";
import { dripRate } from "../lib/calc-engine.js";
import { runValidation } from "../lib/validation.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { NumField, Toggle, SelectField } from "../components/Field.jsx";

const DROP_FACTORS = [
  { value: "10", label: "10 gtt/mL (macro)" },
  { value: "15", label: "15 gtt/mL (macro)" },
  { value: "20", label: "20 gtt/mL (macro)" },
  { value: "60", label: "60 gtt/mL (microdrip)" },
];

export default function IVDripRate() {
  const [volumeMl, setVolumeMl] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState("hr");
  const [dropFactor, setDropFactor] = useState("15");

  const pristine = volumeMl === "" && time === "";

  const { result, validation } = useMemo(() => {
    if (pristine) return { result: null, validation: { errors: [], warnings: [], banners: [] } };
    const timeMin = timeUnit === "hr" ? Number(time) * 60 : Number(time);
    const inputs = { "Volume (mL)": volumeMl, "Infusion time": time };
    let result = null;
    if (Number(volumeMl) > 0 && timeMin > 0) {
      result = dripRate({ volumeMl: Number(volumeMl), timeMin, dropFactor: Number(dropFactor) });
    } else if (time !== "" && Number(time) <= 0) {
      inputs["Infusion time (must be > 0)"] = "";
    }
    const validation = runValidation({
      inputs,
      resultType: "dripRate",
      resultValue: result?.value,
    });
    return { result, validation };
  }, [volumeMl, time, timeUnit, dropFactor, pristine]);

  return (
    <CalculatorShell
      title="IV Drip Rate (gtt/min)"
      description="Gravity infusion — manual drip counting. gtt/min = (Volume × Drop factor) ÷ Time in minutes. Always rounded to whole drops."
      validation={validation}
      result={result}
      resultSubline={result ? `Count drops for 1 full minute and adjust the roller clamp.` : null}
    >
      <NumField label="Total volume to infuse" value={volumeMl} onChange={setVolumeMl} suffix="mL" placeholder="e.g. 1000" />
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <NumField label="Infusion time" value={time} onChange={setTime} placeholder="e.g. 8" />
        </div>
        <Toggle
          options={[
            { value: "hr", label: "hours" },
            { value: "min", label: "minutes" },
          ]}
          value={timeUnit}
          onChange={setTimeUnit}
        />
      </div>
      <SelectField label="Tubing drop factor (printed on the tubing package)" value={dropFactor} onChange={setDropFactor}>
        {DROP_FACTORS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </SelectField>
    </CalculatorShell>
  );
}

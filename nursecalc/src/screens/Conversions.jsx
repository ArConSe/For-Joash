import { useMemo, useState } from "react";
import { convertUnit, CONVERSIONS } from "../lib/calc-engine.js";
import CalculatorShell from "../components/CalculatorShell.jsx";
import { SelectField } from "../components/Field.jsx";
import { Input, Segmented } from "../nursecalc-ds/components/index.js";
import Icon from "../components/Icon.jsx";

const CATEGORY_OPTIONS = Object.entries(CONVERSIONS).map(([value, c]) => ({
  value,
  label: c.label,
}));

/**
 * Unit converter for the units nurses meet daily: metric mass (mcg/mg/g/kg),
 * body weight (kg⇄lb, 2.2), household volume (mL/L/tsp/tbsp/fl oz/cup), and
 * temperature (°C⇄°F). Pure display wrapper over convertUnit() in the engine.
 */
export default function Conversions() {
  const [category, setCategory] = useState("mass");
  const [value, setValue] = useState("");
  const [from, setFrom] = useState(CONVERSIONS.mass.defaultFrom);
  const [to, setTo] = useState(CONVERSIONS.mass.defaultTo);

  const cat = CONVERSIONS[category];
  const pristine = value === "";

  const changeCategory = (c) => {
    setCategory(c);
    setFrom(CONVERSIONS[c].defaultFrom);
    setTo(CONVERSIONS[c].defaultTo);
  };
  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const { result, validation } = useMemo(() => {
    const validation = { errors: [], warnings: [], banners: [] };
    if (pristine) return { result: null, validation };
    const n = Number(value);
    if (value.trim() === "" || Number.isNaN(n)) {
      validation.errors.push("Enter a number to convert.");
      return { result: null, validation };
    }
    if (category !== "temp" && n < 0) {
      validation.errors.push("Value can’t be negative for this unit.");
      return { result: null, validation };
    }
    return { result: convertUnit({ category, value: n, from, to }), validation };
  }, [category, value, from, to, pristine]);

  const fromLabel = cat.units.find((u) => u.value === from)?.label;
  const toLabel = cat.units.find((u) => u.value === to)?.label;

  return (
    <CalculatorShell
      title="Unit Conversions"
      description="Convert between clinical units — metric mass, body weight, household volume, and temperature. Pick a category, then convert one unit to another."
      validation={validation}
      result={result}
      resultLabel="Converted value"
      showState={false}
      resultSubline={result ? `${value} ${fromLabel} = ${result.value} ${toLabel}` : null}
    >
      <div>
        <span className="nc-label">Category</span>
        <div className="overflow-x-auto pb-1">
          <Segmented
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={changeCategory}
            size="sm"
            aria-label="Conversion category"
          />
        </div>
      </div>

      <Input
        label="Value"
        numeric
        value={value}
        placeholder="e.g. 5"
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <SelectField label="From" value={from} onChange={setFrom}>
            {cat.units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </SelectField>
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap units"
          className="icon-btn mb-1 shrink-0"
        >
          <Icon name="swap" size={20} />
        </button>
        <div className="flex-1">
          <SelectField label="To" value={to} onChange={setTo}>
            {cat.units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </SelectField>
        </div>
      </div>
    </CalculatorShell>
  );
}

/** Labeled numeric input. Keeps screens terse. */
export function NumField({ label, value, onChange, placeholder, suffix, step = "any" }) {
  return (
    <label className="block">
      <span className="nc-label">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min="0"
          className="nc-input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && (
          <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">{suffix}</span>
        )}
      </div>
    </label>
  );
}

/** Two-state toggle (e.g. kg/lb, whole/tenths). */
export function Toggle({ label, options, value, onChange }) {
  return (
    <div>
      {label && <span className="nc-label">{label}</span>}
      <div className="inline-flex gap-1 rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`nc-toggle ${value === opt.value ? "nc-toggle-on" : "nc-toggle-off"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Weight input with kg/lb toggle — BUILD.md requires the visible toggle. */
export function WeightField({ weight, setWeight, weightUnit, setWeightUnit }) {
  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <NumField label="Patient weight" value={weight} onChange={setWeight} placeholder="e.g. 70" />
      </div>
      <Toggle
        options={[
          { value: "kg", label: "kg" },
          { value: "lb", label: "lb" },
        ]}
        value={weightUnit}
        onChange={setWeightUnit}
      />
    </div>
  );
}

/** Select dropdown. */
export function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="nc-label">{label}</span>
      <select className="nc-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

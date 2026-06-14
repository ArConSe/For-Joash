import { Input, Segmented } from "../nursecalc-ds/components/index.js";

/** Labeled numeric input — design-system Input with the unit badge + mono face. */
export function NumField({ label, value, onChange, placeholder, suffix, step = "any" }) {
  return (
    <Input
      label={label}
      numeric
      unit={suffix}
      type="number"
      step={step}
      min="0"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Two-state (or N-state) toggle — design-system Segmented pill switcher. */
export function Toggle({ label, options, value, onChange }) {
  return (
    <div>
      {label && <span className="nc-label">{label}</span>}
      <Segmented options={options} value={value} onChange={onChange} aria-label={label} />
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

/** Select dropdown — styled to match the design-system Input control. */
export function SelectField({ label, value, onChange, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--nc-ink)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "var(--control-md)",
          padding: "0 14px",
          background: "var(--nc-white)",
          border: "1.5px solid var(--nc-border)",
          borderRadius: "var(--radius-md)",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "var(--text-base)",
          color: "var(--nc-ink)",
          cursor: "pointer",
        }}
      >
        {children}
      </select>
    </label>
  );
}

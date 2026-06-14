import StatePill from "./StatePill.jsx";

/**
 * ResultStat — the big dose readout. A large mono number with the unit set
 * in the display face, on a soft blue panel, with an optional clinical
 * StatePill beneath it.
 *
 * Props:
 *   value       the number/string to feature (e.g. 16.1)
 *   unit        unit string (e.g. "mL/hr")
 *   label       small caption above the readout (e.g. "Pump rate")
 *   state       clinical state for the pill — "safe" | "verify" | "alert" | "info"
 *   stateLabel  text for the pill (defaults to the state name)
 *   children    optional sub-line beneath (e.g. unrounded value, context)
 */
export default function ResultStat({
  value,
  unit,
  label,
  state,
  stateLabel,
  className = "",
  children,
}) {
  const cls = ["ncds-result", className].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {label && <span className="ncds-result__label">{label}</span>}
      <div className="ncds-result__readout">
        <span className="ncds-result__value">{value}</span>
        {unit && <span className="ncds-result__unit">{unit}</span>}
      </div>
      {state && (
        <StatePill state={state}>{stateLabel || state}</StatePill>
      )}
      {children && <div className="ncds-result__sub">{children}</div>}
    </div>
  );
}

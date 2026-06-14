import { useId } from "react";

/**
 * Input — labeled text/number field with an optional right-hand unit badge,
 * hint, and error states.
 *
 * Props:
 *   label    field label (wraps the control for accessibility)
 *   unit     short unit string rendered as a right badge (e.g. "mg", "mL")
 *   hint     helper text below the field
 *   error    error string — switches the border to the high-alert color
 *   numeric  mono font + decimal inputMode for dose/weight/volume entry
 */
export default function Input({
  label,
  unit,
  hint,
  error,
  numeric = false,
  className = "",
  id,
  ...rest
}) {
  const autoId = useId();
  const inputId = id || autoId;

  const inputCls = [
    "ncds-input",
    numeric ? "ncds-input--numeric" : "",
    unit ? "ncds-input--has-unit" : "",
    error ? "ncds-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ncds-field">
      {label && (
        <label className="ncds-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ncds-field__control">
        <input
          id={inputId}
          className={inputCls}
          inputMode={numeric ? "decimal" : undefined}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {unit && <span className="ncds-field__unit">{unit}</span>}
      </div>
      {error ? (
        <p className="ncds-field__error">{error}</p>
      ) : hint ? (
        <p className="ncds-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

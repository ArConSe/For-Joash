/**
 * Switch — 48×28 pill toggle. On = button gradient + blue glow; the thumb
 * slides with a gentle spring.
 *
 * Props:
 *   checked   boolean
 *   onChange  (next) => void
 *   disabled  boolean
 *   label     optional text rendered beside the track
 */
export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = "",
  ...rest
}) {
  const cls = [
    "ncds-switch",
    checked ? "ncds-switch--on" : "",
    disabled ? "ncds-switch--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={cls}>
      <input
        type="checkbox"
        className="ncds-switch__input"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="ncds-switch__track">
        <span className="ncds-switch__thumb" />
      </span>
      {label && <span className="ncds-switch__label">{label}</span>}
    </label>
  );
}

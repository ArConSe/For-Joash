/**
 * Segmented — pill-track switcher (e.g. kg/lb, hours/minutes).
 *
 * Props:
 *   options   string[]  or  { value, label }[]
 *   value     currently selected value
 *   onChange  (value) => void
 *   size      "sm" | "md" | "lg"   (default md)
 */
export default function Segmented({
  options = [],
  value,
  onChange,
  size = "md",
  "aria-label": ariaLabel,
  className = "",
}) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const cls = ["ncds-seg", `ncds-seg--${size}`, className].filter(Boolean).join(" ");

  return (
    <div className={cls} role="group" aria-label={ariaLabel}>
      {items.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`ncds-seg__opt ${active ? "ncds-seg__opt--active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

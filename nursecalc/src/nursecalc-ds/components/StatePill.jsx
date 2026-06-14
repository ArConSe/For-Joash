/**
 * StatePill — clinical status indicator: always a colored dot + label.
 *
 * Props:
 *   state   "safe" | "verify" | "alert" | "info"   (default info)
 *   size    "sm" | "md" | "lg"                      (default md)
 */
export default function StatePill({ state = "info", size = "md", className = "", children, ...rest }) {
  const cls = ["ncds-state", `ncds-state--${state}`, `ncds-state--${size}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      <span className="ncds-state__dot" aria-hidden="true" />
      {children}
    </span>
  );
}

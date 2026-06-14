/**
 * Button — the design system's primary action control.
 *
 * Props:
 *   variant   "primary" | "secondary" | "ghost" | "danger"  (default primary)
 *   size      "sm" | "md" | "lg"                             (default md)
 *   block     stretch to full width
 *   iconLeft / iconRight   React nodes rendered alongside the label
 */
export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "ncds-btn",
    `ncds-btn--${variant}`,
    `ncds-btn--${size}`,
    block ? "ncds-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={cls} disabled={disabled} {...rest}>
      {iconLeft && <span className="ncds-btn__icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ncds-btn__icon">{iconRight}</span>}
    </button>
  );
}

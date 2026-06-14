/**
 * Card — surface container.
 *
 * Props:
 *   elevation  "flat" | "sm" | "md" | "lg"      (default sm)
 *   padding    "none" | "sm" | "md" | "lg"      (default md → 20px)
 *   accent     adds a 4px signature-gradient stripe across the top
 */
export default function Card({
  elevation = "sm",
  padding = "md",
  accent = false,
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "ncds-card",
    `ncds-card--${elevation}`,
    `ncds-card--p-${padding}`,
    accent ? "ncds-card--accent" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

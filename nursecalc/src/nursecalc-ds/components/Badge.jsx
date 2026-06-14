/**
 * Badge — small static pill label.
 *
 * Props:
 *   tone   "neutral" | "mint" | "sun" | "ink" | "outline"   (default neutral)
 */
export default function Badge({ tone = "neutral", className = "", children, ...rest }) {
  const cls = ["ncds-badge", `ncds-badge--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}

/**
 * NurseCalc — formatting & rounding helpers
 * Centralizes the rounding rules from BUILD.md so screens stay consistent.
 */

/** gtt/min: always whole drops. */
export function formatGtt(value) {
  return `${Math.round(value)} gtt/min`;
}

/**
 * mL/hr: whole by default, tenths if pump supports it.
 * pumpPrecision: "whole" | "tenths"
 */
export function formatMlHr(value, pumpPrecision = "tenths") {
  const v = pumpPrecision === "whole" ? Math.round(value) : Math.round(value * 10) / 10;
  return `${v} mL/hr`;
}

/**
 * High-alert doses: NEVER silently round. Show both.
 * Returns { rounded, raw, display }.
 */
export function formatHighAlert(value, unit, dp = 2) {
  const f = Math.pow(10, dp);
  const rounded = Math.round(value * f) / f;
  return {
    rounded,
    raw: value,
    display:
      Math.abs(rounded - value) > 1e-9
        ? `${rounded} ${unit} (unrounded ${value} ${unit})`
        : `${rounded} ${unit}`,
  };
}

/** Decimal hours → "Xh Ym" */
export function formatHrMin(hours) {
  const whole = Math.floor(hours);
  const mins = Math.round((hours - whole) * 60);
  return `${whole}h ${mins}m`;
}

/** Decimal hours from now → 24-hr completion clock (optional display). */
export function completionTime(hoursFromNow, now = new Date()) {
  const end = new Date(now.getTime() + hoursFromNow * 3600 * 1000);
  const hh = String(end.getHours()).padStart(2, "0");
  const mm = String(end.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

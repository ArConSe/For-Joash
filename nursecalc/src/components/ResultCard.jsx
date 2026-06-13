/**
 * Big answer card. For high-alert drugs, shows the unrounded value too
 * (never silently round a high-alert dose — BUILD.md rule).
 */
export default function ResultCard({ result, highAlert = false, subline }) {
  if (!result) return null;
  const display = result.display || `${result.value} ${result.unit}`;
  const showRaw =
    highAlert &&
    result.rawValue != null &&
    Math.abs(result.rawValue - result.value) > 1e-9;
  return (
    <div className="nc-card border-2 border-teal-500/60 text-center">
      <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Result</p>
      <p className="mt-1 text-4xl font-extrabold text-teal-700 dark:text-teal-300">{display}</p>
      {showRaw && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Unrounded: {result.rawValue} {result.unit}
        </p>
      )}
      {subline && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subline}</p>}
    </div>
  );
}

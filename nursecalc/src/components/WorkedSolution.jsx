const METHOD_LABELS = {
  formula: "Basic Formula",
  ratioProportion: "Ratio & Proportion",
  dimensionalAnalysis: "Dimensional Analysis",
};

/**
 * Shows the step-by-step solution and all available methods
 * (basic formula / ratio-proportion / dimensional analysis).
 * This is the core differentiator: it teaches, not just answers.
 */
export default function WorkedSolution({ result }) {
  if (!result) return null;
  const methods = result.methods || {};
  return (
    <div className="nc-card space-y-4">
      <h3 className="text-lg font-bold">Worked Solution</h3>

      {result.steps?.length > 0 && (
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {result.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}

      <div className="space-y-3">
        {Object.entries(methods).map(([key, text]) => (
          <div key={key}>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-400">
              {METHOD_LABELS[key] || key}
            </p>
            <p className="mt-0.5 overflow-x-auto rounded bg-slate-100 p-2 font-mono text-sm dark:bg-slate-800">
              {text}
            </p>
          </div>
        ))}
      </div>

      {result.note && (
        <p className="rounded bg-cyan-50 p-2 text-sm text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
          💡 {result.note}
        </p>
      )}
    </div>
  );
}

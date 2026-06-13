import ResultCard from "./ResultCard.jsx";
import WorkedSolution from "./WorkedSolution.jsx";
import SafetyBanner from "./SafetyBanner.jsx";
import NursingConsiderations from "./NursingConsiderations.jsx";

/**
 * Shared screen layout: title + inputs → safety banners → ResultCard →
 * WorkedSolution → optional NursingConsiderations.
 *
 * Screens stay thin: they own inputs + call the engine/validation, then
 * hand everything here. Blocking errors suppress the result entirely.
 */
export default function CalculatorShell({
  title,
  description,
  children,
  validation = { errors: [], warnings: [], banners: [] },
  result,
  resultSubline,
  highAlert = false,
  drug,
  extra,
  showResult = true,
}) {
  const blocked = validation.errors.length > 0;
  const hasResult = showResult && !blocked && result;
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </header>

      <div className="nc-card space-y-4">{children}</div>

      <SafetyBanner
        banners={validation.banners}
        warnings={blocked ? [] : validation.warnings}
        errors={validation.errors}
      />

      {hasResult && (
        <div className="space-y-4">
          <ResultCard result={result} highAlert={highAlert} subline={resultSubline} />
          <WorkedSolution result={result} />
          {extra}
          {drug && <NursingConsiderations drug={drug} />}
        </div>
      )}
    </div>
  );
}

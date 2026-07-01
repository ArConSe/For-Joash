import WorkedSolution from "./WorkedSolution.jsx";
import SafetyBanner from "./SafetyBanner.jsx";
import NursingConsiderations from "./NursingConsiderations.jsx";
import HowToUse from "./HowToUse.jsx";
import { Card, ResultStat } from "../nursecalc-ds/components/index.js";

const STATE_LABELS = {
  safe: "Within range",
  verify: "Double-check",
  alert: "Exceeds safe limit",
  info: "Result",
};

/** Map the validation outcome to a clinical state when a screen doesn't set one. */
function deriveState(validation) {
  const hasHighAlert = (validation.banners || []).some((b) => b.level === "high-alert");
  if (validation.warnings.length > 0 || hasHighAlert) return "verify";
  return "safe";
}

/**
 * Shared screen layout: title + inputs (in an accented Card) → safety
 * banners → ResultStat → WorkedSolution → optional NursingConsiderations.
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
  resultLabel = "Result",
  state,
  stateLabel,
  showState = true,
  highAlert = false,
  drug,
  extra,
  showResult = true,
  howTo,
  howToExample,
}) {
  const blocked = validation.errors.length > 0;
  const hasResult = showResult && !blocked && result;

  const clinicalState = hasResult && showState ? state || deriveState(validation) : null;
  const clinicalLabel = stateLabel || (clinicalState ? STATE_LABELS[clinicalState] : undefined);

  const statValue = result ? (result.statValue ?? result.value) : null;
  const statUnit = result ? (result.statUnit ?? result.unit) : null;
  const showRaw =
    highAlert &&
    result?.rawValue != null &&
    Math.abs(result.rawValue - result.value) > 1e-9;

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </header>

      {howTo?.length > 0 && <HowToUse steps={howTo} example={howToExample} />}

      <Card accent elevation="md" padding="md" className="space-y-4">
        {children}
      </Card>

      <SafetyBanner
        banners={validation.banners}
        warnings={blocked ? [] : validation.warnings}
        errors={validation.errors}
      />

      {hasResult && (
        <div className="space-y-4">
          <ResultStat
            label={resultLabel}
            value={statValue}
            unit={statUnit}
            state={clinicalState}
            stateLabel={clinicalLabel}
          >
            {showRaw && (
              <span className="block">
                Unrounded: {result.rawValue} {result.unit}
              </span>
            )}
            {resultSubline && <span className="block">{resultSubline}</span>}
          </ResultStat>
          <WorkedSolution result={result} />
          {extra}
          {drug && <NursingConsiderations drug={drug} />}
        </div>
      )}
    </div>
  );
}

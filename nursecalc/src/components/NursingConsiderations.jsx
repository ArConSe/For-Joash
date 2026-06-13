// Detailed sections, in the order a nurse works through them.
// Safety-critical sections (hold/notify, extravasation, antidote,
// contraindication) get a warm accent so they stand out gently.
const SECTIONS = [
  { key: "before", label: "Before starting", tone: "base" },
  { key: "administration", label: "Administration", tone: "base" },
  { key: "monitor", label: "Monitor", tone: "base" },
  { key: "holdNotify", label: "Hold / notify prescriber", tone: "warn" },
  { key: "extravasation", label: "Extravasation", tone: "warn" },
  { key: "teaching", label: "Patient teaching", tone: "base" },
  { key: "antidote", label: "Antidote", tone: "good" },
  { key: "contraindication", label: "Contraindication", tone: "warn" },
];

const TONE = {
  base: "text-teal-700 dark:text-teal-300",
  warn: "text-rose-600 dark:text-rose-300",
  good: "text-emerald-600 dark:text-emerald-300",
};

/** Renders the per-drug nursing card: quick actions first, then detail. */
export default function NursingConsiderations({ drug }) {
  if (!drug?.nursing) return null;
  const n = drug.nursing;
  const actions = drug.keyActions || [];
  const rangeText = drug.doseRange
    ? `${drug.doseRange.min}–${drug.doseRange.max} ${drug.doseRange.unit}`
    : drug.doseSummary;

  return (
    <div className="nc-card space-y-4">
      <div>
        <h3 className="text-lg font-bold">
          Nursing Considerations — {drug.generic}
          {drug.brand && drug.brand !== "—" ? ` (${drug.brand})` : ""}
        </h3>
        {rangeText && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {drug.doseRange ? "Usual range: " : ""}
            {rangeText}
            {drug.rangeNote ? ` — ${drug.rangeNote}` : ""}
          </p>
        )}
      </div>

      {actions.length > 0 && (
        <div className="rounded-xl bg-teal-50/70 p-3 ring-1 ring-teal-200/70 dark:bg-teal-500/10 dark:ring-teal-500/20">
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Key nursing actions
          </h4>
          <ul className="space-y-1.5">
            {actions.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span aria-hidden className="mt-0.5 shrink-0 font-bold text-teal-600 dark:text-teal-300">
                  ✓
                </span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="space-y-2.5 text-sm">
        {SECTIONS.map(({ key, label, tone }) =>
          n[key] ? (
            <div key={key}>
              <dt className={`font-semibold ${TONE[tone]}`}>{label}</dt>
              <dd className="text-slate-600 dark:text-slate-300">{n[key]}</dd>
            </div>
          ) : null
        )}
      </dl>

      {n.source && (
        <p className="text-xs italic text-slate-400 dark:text-slate-500">{n.source}</p>
      )}
    </div>
  );
}

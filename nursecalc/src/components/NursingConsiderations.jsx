const SECTION_LABELS = {
  before: "Before starting",
  administration: "Administration",
  monitor: "Monitor",
  holdNotify: "Hold / notify prescriber",
  extravasation: "Extravasation",
  teaching: "Patient teaching",
  antidote: "Antidote",
  contraindication: "Contraindication",
};

/** Renders the per-drug nursing card from drug-presets.json. */
export default function NursingConsiderations({ drug }) {
  if (!drug?.nursing) return null;
  const n = drug.nursing;
  return (
    <div className="nc-card space-y-3">
      <div>
        <h3 className="text-lg font-bold">
          Nursing Considerations — {drug.generic}
          {drug.brand && drug.brand !== "—" ? ` (${drug.brand})` : ""}
        </h3>
        {drug.doseRange && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Usual range: {drug.doseRange.min}–{drug.doseRange.max} {drug.doseRange.unit}
            {drug.rangeNote ? ` — ${drug.rangeNote}` : ""}
          </p>
        )}
      </div>
      <dl className="space-y-2 text-sm">
        {Object.entries(SECTION_LABELS).map(([key, label]) =>
          n[key] ? (
            <div key={key}>
              <dt className="font-semibold text-cyan-700 dark:text-cyan-400">{label}</dt>
              <dd>{n[key]}</dd>
            </div>
          ) : null
        )}
      </dl>
      {n.source && (
        <p className="text-xs italic text-slate-500 dark:text-slate-400">{n.source}</p>
      )}
    </div>
  );
}

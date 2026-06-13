import { useMemo, useState } from "react";
import { highAlertBanners } from "../lib/validation.js";
import SafetyBanner from "../components/SafetyBanner.jsx";
import NursingConsiderations from "../components/NursingConsiderations.jsx";
import drips from "../data/drug-presets.json";
import wardMeds from "../data/drug-guide.json";

const FLAG_BADGES = [
  ["highAlert", "HIGH ALERT", "bg-red-600/20 text-red-700 dark:text-red-300 ring-red-500/50"],
  ["vesicant", "VESICANT", "bg-orange-600/20 text-orange-700 dark:text-orange-300 ring-orange-500/50"],
  ["lasa", "LASA", "bg-amber-600/20 text-amber-700 dark:text-amber-300 ring-amber-500/50"],
];

// one merged handbook: titration drips + general ward/emergency medications
const ALL_DRUGS = [
  ...drips.drugs.map((d) => ({ ...d, section: "Critical-care drip" })),
  ...wardMeds.drugs.map((d) => ({ ...d, section: "Ward / emergency" })),
].sort((a, b) => a.generic.localeCompare(b.generic));

/**
 * Drug handbook: browse/search every drug card without running a
 * calculation. Expanding a drug shows its safety banners, dose
 * range/summary, standard concentrations, and the nursing card.
 */
export default function DrugGuide() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const drugs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_DRUGS;
    return ALL_DRUGS.filter((d) =>
      [d.generic, d.brand, d.category, d.section].some((s) => s && s.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <header className="no-print">
        <h2 className="text-2xl font-bold">Drug Guide</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {ALL_DRUGS.length} handbook cards — critical-care drips plus high-yield ward and
          emergency medications, paraphrased per Davis's Drug Guide. Doses are typical adult
          references for learning; the order and facility policy always override. Pediatric
          dosing defers to a pediatric reference.
        </p>
      </header>

      <label className="no-print block">
        <span className="nc-label">Search drugs</span>
        <input
          type="search"
          className="nc-input"
          placeholder="Name, brand, or category — e.g. heparin, Ventolin, antibiotic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {drugs.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No match for “{query}”. Try the generic name (e.g. salbutamol), a brand (e.g.
          Lanoxin), or a category (pressor, antibiotic, opioid, electrolyte…).
        </p>
      )}

      <ul className="space-y-2">
        {drugs.map((d) => {
          const open = openId === d.id;
          return (
            <li key={d.id} className={open ? "print-area" : "no-print"}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : d.id)}
                className="nc-card no-print w-full text-left transition hover:border-cyan-500/60"
                aria-expanded={open}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold">{d.generic}</span>
                  {d.brand && d.brand !== "—" && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">({d.brand})</span>
                  )}
                  <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {d.category}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {FLAG_BADGES.map(([key, label, cls]) =>
                    d[key] ? (
                      <span key={key} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ${cls}`}>
                        ⚠ {label}
                      </span>
                    ) : null
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {d.doseRange
                      ? `${d.doseRange.min}–${d.doseRange.max} ${d.doseRange.unit}`
                      : d.doseSummary}
                  </span>
                  <span className="ml-auto text-xs text-cyan-700 dark:text-cyan-400">
                    {open ? "▲ close" : "▼ open"}
                  </span>
                </div>
              </button>

              {open && (
                <div className="mt-2 space-y-3">
                  <div className="hidden print:block">
                    <h2 className="text-xl font-bold">NurseCalc Drug Guide — {d.generic}</h2>
                  </div>
                  <SafetyBanner banners={highAlertBanners({ drug: d, category: d.category })} />
                  <div className="nc-card">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-400">
                      {d.presets ? "Standard concentrations" : "Typical adult dosing"}
                    </h4>
                    {d.presets ? (
                      <ul className="mt-1 list-disc pl-5 text-sm">
                        {d.presets.map((p, i) => (
                          <li key={i}>{p.label}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm">{d.doseSummary}</p>
                    )}
                    {d.rangeNote && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Dosing note:</span> {d.rangeNote}
                      </p>
                    )}
                  </div>
                  <NursingConsiderations drug={d} />
                  <button onClick={() => window.print()} className="nc-btn-ghost no-print">
                    🖨 Print / Save as PDF
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

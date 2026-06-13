import { useMemo, useState } from "react";
import { highAlertBanners } from "../lib/validation.js";
import { ALL_DRUGS, GROUPS, groupDrugs, matchesDrug } from "../lib/drugs.js";
import SafetyBanner from "../components/SafetyBanner.jsx";
import NursingConsiderations from "../components/NursingConsiderations.jsx";

const FLAG_BADGES = [
  ["highAlert", "HIGH ALERT", "bg-red-600/20 text-red-700 dark:text-red-300 ring-red-500/50"],
  ["vesicant", "VESICANT", "bg-orange-600/20 text-orange-700 dark:text-orange-300 ring-orange-500/50"],
  ["lasa", "LASA", "bg-amber-600/20 text-amber-700 dark:text-amber-300 ring-amber-500/50"],
];

function DrugRow({ d, open, onToggle }) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="nc-card w-full text-left transition hover:border-teal-500/60"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold">{d.generic}</span>
          {d.brand && d.brand !== "—" && (
            <span className="text-sm text-slate-500 dark:text-slate-400">({d.brand})</span>
          )}
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
            {d.doseRange ? `${d.doseRange.min}–${d.doseRange.max} ${d.doseRange.unit}` : d.doseSummary}
          </span>
          <span className="ml-auto text-xs text-teal-700 dark:text-teal-400">
            {open ? "▲ close" : "▼ open"}
          </span>
        </div>
      </button>

      {open && (
        <div className="mt-2 space-y-3">
          <SafetyBanner banners={highAlertBanners({ drug: d, category: d.category })} />
          <div className="nc-card">
            <h4 className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
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
        </div>
      )}
    </li>
  );
}

/**
 * Drug handbook organized by therapeutic class. Browse/search without
 * running a calculation; filter by class; expand a card for safety
 * banners, dosing, and the nursing card. focusDrugId opens a specific
 * card on mount (deep-link from Home search).
 */
export default function DrugGuide({ focusDrugId = null }) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [openId, setOpenId] = useState(focusDrugId);

  const groups = useMemo(() => {
    const filtered = ALL_DRUGS.filter(
      (d) => matchesDrug(d, query) && (classFilter === "all" || d.group === classFilter)
    );
    return groupDrugs(filtered);
  }, [query, classFilter]);

  const shown = groups.reduce((n, g) => n + g.drugs.length, 0);

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold">Drug Guide</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {ALL_DRUGS.length} cards across {GROUPS.length} drug classes — paraphrased from open
          references (FDA labeling via DailyMed, Open RN, StatPearls, WHO). Doses are typical adult
          references for learning; the order and facility policy always override.
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="nc-label">Search drugs</span>
          <input
            type="search"
            className="nc-input"
            placeholder="Name, brand, or class — e.g. Augmentin, antibiotic"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="nc-label">Class</span>
          <select
            className="nc-input sm:w-56"
            aria-label="Filter by drug class"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="all">All classes</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

      {shown === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No match. Try a generic name (e.g. salbutamol), a brand (e.g. Lanoxin), or a class
          (antibiotic, antidiabetic, anticoagulant…).
        </p>
      ) : (
        groups.map(({ group, drugs }) => (
          <section key={group} className="space-y-2">
            <div className="flex items-baseline gap-2 pt-1">
              <h3 className="section-label">{group}</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">{drugs.length}</span>
            </div>
            <ul className="space-y-2">
              {drugs.map((d) => (
                <DrugRow
                  key={d.id}
                  d={d}
                  open={openId === d.id}
                  onToggle={() => setOpenId(openId === d.id ? null : d.id)}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

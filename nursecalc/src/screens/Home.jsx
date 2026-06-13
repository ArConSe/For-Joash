import { useMemo, useState } from "react";
import { CATEGORIES, ALL_CALCULATORS } from "../catalog.js";
import { ALL_DRUGS, matchesDrug } from "../lib/drugs.js";
import Icon from "../components/Icon.jsx";

function ToolCard({ item, onClick }) {
  return (
    <button type="button" onClick={onClick} className="tool-card">
      <span className="tool-card-icon">
        <Icon name={item.icon} size={22} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-tight">{item.label}</span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{item.short}</span>
      </span>
      <Icon name="chevronRight" size={18} className="ml-auto shrink-0 text-slate-300 dark:text-slate-600" />
    </button>
  );
}

function DrugRow({ drug, onClick }) {
  return (
    <button type="button" onClick={onClick} className="tool-card">
      <span className="tool-card-icon">
        <Icon name="book" size={20} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-tight">
          {drug.generic}
          {drug.brand && drug.brand !== "—" && (
            <span className="font-normal text-slate-500 dark:text-slate-400"> ({drug.brand})</span>
          )}
        </span>
        <span className="mt-0.5 block text-xs capitalize text-slate-500 dark:text-slate-400">
          {drug.category} · {drug.section}
        </span>
      </span>
      {drug.highAlert && (
        <span className="ml-auto shrink-0 rounded bg-red-600/15 px-1.5 py-0.5 text-[10px] font-bold text-red-600 ring-1 ring-red-500/40 dark:text-red-300">
          HIGH ALERT
        </span>
      )}
    </button>
  );
}

/**
 * Search-first landing. Empty query → categorized calculator grid.
 * With a query → live matches across calculators AND the drug library
 * (selecting a drug deep-links into the Drug Guide).
 */
export default function Home({ onOpenTool, onOpenDrug }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const calMatches = useMemo(() => {
    if (!query) return [];
    return ALL_CALCULATORS.filter((i) =>
      `${i.label} ${i.short} ${i.keywords}`.toLowerCase().includes(query)
    );
  }, [query]);

  const drugMatches = useMemo(() => {
    if (!query) return [];
    return ALL_DRUGS.filter((d) => matchesDrug(d, query)).slice(0, 8);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="search" size={20} />
        </span>
        <input
          type="search"
          className="nc-input pl-10"
          placeholder="Search calculators & drugs…"
          aria-label="Search calculators and drugs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {query ? (
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="section-label">Calculators</h3>
            {calMatches.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {calMatches.map((item) => (
                  <ToolCard key={item.id} item={item} onClick={() => onOpenTool(item.id)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No matching calculator.</p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="section-label">Drugs</h3>
            {drugMatches.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {drugMatches.map((drug) => (
                  <DrugRow key={drug.id} drug={drug} onClick={() => onOpenDrug(drug.id)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No matching drug. Try a generic name, brand, or category.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => (
            <section key={cat.name} className="space-y-2">
              <h3 className="section-label">{cat.name}</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <ToolCard key={item.id} item={item} onClick={() => onOpenTool(item.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

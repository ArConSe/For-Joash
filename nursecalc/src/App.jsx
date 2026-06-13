import { useEffect, useState } from "react";
import { DISCLAIMER } from "./lib/validation.js";
import { BY_ID } from "./catalog.js";
import Icon from "./components/Icon.jsx";
import Home from "./screens/Home.jsx";
import DrugGuide from "./screens/DrugGuide.jsx";

export default function App() {
  const [tab, setTab] = useState("calc"); // "calc" | "drugs"
  const [toolId, setToolId] = useState(null); // null = home grid
  const [drugFocus, setDrugFocus] = useState(null); // deep-linked drug id
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const inTool = tab === "calc" && toolId;

  const scrollTop = () => {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* jsdom / unsupported environments */
    }
  };
  const openTool = (id) => {
    setTab("calc");
    setToolId(id);
    scrollTop();
  };
  const openDrug = (id) => {
    setDrugFocus(id);
    setTab("drugs");
    scrollTop();
  };
  const goCalculators = () => {
    setTab("calc");
    setToolId(null);
  };
  const goDrugs = () => {
    setDrugFocus(null);
    setToolId(null); // "Calculators" always returns to the grid, never a stale tool
    setTab("drugs");
  };

  // Escape backs out of an open tool to the grid.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && inTool) setToolId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inTool]);

  const ToolComponent = toolId ? BY_ID[toolId]?.Component : null;

  return (
    <div className="min-h-screen pb-24">
      <header className="no-print sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/85">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-3">
          {inTool && (
            <button onClick={goCalculators} className="icon-btn" aria-label="Back">
              <Icon name="chevronLeft" size={22} />
            </button>
          )}
          <span className={`text-lg font-extrabold tracking-tight ${inTool ? "" : "pl-1"}`}>
            <span className="text-cyan-600 dark:text-cyan-400">Nurse</span>Calc
          </span>
          <button
            onClick={() => setDark(!dark)}
            className="icon-btn ml-auto"
            aria-label="Toggle theme"
          >
            <Icon name={dark ? "sun" : "moon"} size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        {tab === "drugs" ? (
          // key resets the guide between a focused drug and the full list
          <DrugGuide key={drugFocus || "all"} focusDrugId={drugFocus} />
        ) : ToolComponent ? (
          <ToolComponent key={toolId} />
        ) : (
          <div className="no-print">
            <Home onOpenTool={openTool} onOpenDrug={openDrug} />
          </div>
        )}

        <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p className="font-semibold">⚕️ {DISCLAIMER}</p>
          <p className="no-print mt-1">
            Formulas per Open RN / OpenStax (CC BY) dosage-calculation curriculum; drug data
            paraphrased from open references — FDA labeling (DailyMed), Open RN, StatPearls, WHO.
            Offline — no data leaves this device.
          </p>
        </footer>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto grid max-w-3xl grid-cols-2">
          <button
            onClick={goCalculators}
            className={`nav-item ${tab === "calc" ? "nav-item-active" : ""}`}
            aria-current={tab === "calc" ? "page" : undefined}
          >
            <Icon name="grid" size={22} />
            Calculators
          </button>
          <button
            onClick={goDrugs}
            className={`nav-item ${tab === "drugs" ? "nav-item-active" : ""}`}
            aria-current={tab === "drugs" ? "page" : undefined}
          >
            <Icon name="book" size={22} />
            Drug Guide
          </button>
        </div>
      </nav>
    </div>
  );
}

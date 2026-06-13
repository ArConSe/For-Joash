import { useEffect, useState } from "react";
import { DISCLAIMER } from "./lib/validation.js";
import IVDripRate from "./screens/IVDripRate.jsx";
import WeightBased from "./screens/WeightBased.jsx";
import Titration from "./screens/Titration.jsx";
import OralTablet from "./screens/OralTablet.jsx";
import LiquidOral from "./screens/LiquidOral.jsx";
import IVPumpRate from "./screens/IVPumpRate.jsx";
import InfusionTime from "./screens/InfusionTime.jsx";
import Reconstitution from "./screens/Reconstitution.jsx";
import SafeDoseRange from "./screens/SafeDoseRange.jsx";
import BSA from "./screens/BSA.jsx";
import DrugGuide from "./screens/DrugGuide.jsx";

// IV Drip Rate first and prominent — the gravity-drip gap is the reason this app exists.
const SCREENS = [
  { id: "drip", label: "IV Drip Rate (gtt/min)", icon: "💧", component: IVDripRate, featured: true },
  { id: "weight", label: "Weight-Based Dose", icon: "⚖️", component: WeightBased, featured: true },
  { id: "titration", label: "Titration Drips", icon: "🫀", component: Titration, featured: true },
  { id: "drugs", label: "Drug Guide", icon: "📖", component: DrugGuide, featured: true },
  { id: "oral", label: "Oral / Tablet", icon: "💊", component: OralTablet },
  { id: "liquid", label: "Liquid / Injectable", icon: "🧪", component: LiquidOral },
  { id: "pump", label: "IV Pump Rate (mL/hr)", icon: "⏱", component: IVPumpRate },
  { id: "time", label: "Infusion Time", icon: "🕐", component: InfusionTime },
  { id: "recon", label: "Reconstitution", icon: "💉", component: Reconstitution },
  { id: "sdr", label: "Safe Dose Range", icon: "🛡", component: SafeDoseRange },
  { id: "bsa", label: "BSA (Mosteller)", icon: "📐", component: BSA },
];

export default function App() {
  const [screenId, setScreenId] = useState("drip");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const screen = SCREENS.find((s) => s.id === screenId);
  const Active = screen.component;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-extrabold tracking-tight">
            <span className="text-cyan-600 dark:text-cyan-400">Nurse</span>Calc
          </h1>
          <button
            onClick={() => setDark(!dark)}
            className="nc-btn-ghost text-sm"
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        <nav className="mx-auto max-w-3xl overflow-x-auto px-4 pb-3">
          <div className="flex gap-2">
            {SCREENS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScreenId(s.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  s.id === screenId
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                } ${s.featured && s.id !== screenId ? "ring-1 ring-cyan-500/40" : ""}`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Active key={screenId} />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold">⚕️ {DISCLAIMER}</p>
          <p className="no-print mt-1">
            Formulas per Open RN / OpenStax dosage-calculation curriculum; drug data paraphrased per
            Davis's Drug Guide and Mosby's. Offline — no data leaves this device.
          </p>
        </div>
      </footer>
    </div>
  );
}

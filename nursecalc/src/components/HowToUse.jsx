import { useState } from "react";
import Icon from "./Icon.jsx";

/**
 * Collapsible step-by-step guide for a calculator screen. Collapsed by
 * default so it stays out of the way for people who already know the tool;
 * a tap reveals numbered steps plus an optional worked example.
 */
export default function HowToUse({ steps = [], example }) {
  const [open, setOpen] = useState(false);
  if (!steps.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/60 dark:border-teal-800 dark:bg-teal-950/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-teal-800 dark:text-teal-200"
      >
        <Icon name="book" size={18} className="shrink-0" />
        How to use this calculator
        <Icon
          name={open ? "chevronLeft" : "chevronRight"}
          size={16}
          className={`ml-auto shrink-0 transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-teal-900 dark:text-teal-100">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {example && (
            <p className="rounded-lg bg-white/70 p-2.5 text-sm text-teal-900 dark:bg-teal-900/40 dark:text-teal-100">
              <span className="font-semibold">Example: </span>
              {example}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

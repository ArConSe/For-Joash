# NurseCalc — Claude Code Build Blueprint

> **How to use this:** Put this whole folder in a new directory, open it in Claude Code, and paste the prompt in the "BUILD PROMPT" section below as your first message. The other files in this folder (`calc-engine.js`, `validation.js`, `drug-presets.json`) are the validated logic and data — Claude Code should use them as the source of truth, not rewrite the formulas from scratch. The companion file `NurseCalc_Formula_and_Drug_Reference.md` is the clinical reference everything is grounded in.

---

## PROJECT GOAL

A **free, offline-capable, nursing-focused medication calculator** for nursing students and nurses (Philippine context). It is a *reference and learning tool* — it shows the full worked solution for every calculation, runs safety checks on every input, and surfaces handbook-based nursing considerations. It is explicitly **not** a dose-issuing medical device.

**Why it exists (the gap):** existing free calculators give black-box answers, do no input sanity-checking, aren't nursing-specific, and bury gravity-drip (gtt/min) math behind pump-only assumptions. NurseCalc fixes all four.

---

## TECH STACK (keep it simple + portable)

- **Single-page React app**, Vite build, Tailwind CSS. No backend.
- **No browser storage APIs are required** for core function; if you add a "history" feature, use in-memory React state only (this runs as an artifact-style app).
- **Offline-first**: everything bundled; no network calls at runtime. (Optional: add a service worker / PWA manifest in Phase 4.)
- **Dark theme** by default (consistent with the owner's other tools), with a clean light toggle.
- **Print-to-PDF**: every result screen must print cleanly (worked solution + nursing considerations) via the browser print dialog with a print stylesheet.
- Target: works as a mobile-first web app; deployable later as a PWA or wrapped (Capacitor) for app stores.

---

## ARCHITECTURE

```
nursecalc/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── lib/
│   │   ├── calc-engine.js      ← USE THE PROVIDED FILE. Pure calculation functions.
│   │   ├── validation.js       ← USE THE PROVIDED FILE. Safety/plausibility checks.
│   │   └── format.js           ← rounding + unit display helpers (you write this)
│   ├── data/
│   │   └── drug-presets.json   ← USE THE PROVIDED FILE. Emergency drip presets + nursing cards.
│   ├── components/
│   │   ├── CalculatorShell.jsx     ← shared layout: inputs → Result card → Worked Solution → print
│   │   ├── ResultCard.jsx          ← big answer + safety banner
│   │   ├── WorkedSolution.jsx      ← shows all 3 methods (formula / ratio-proportion / dimensional analysis)
│   │   ├── SafetyBanner.jsx        ← high-alert / out-of-range / verify warnings
│   │   ├── NursingConsiderations.jsx ← renders the per-drug card from drug-presets.json
│   │   └── PracticeMode.jsx        ← Phase 3: generates randomized drill problems
│   └── screens/
│       ├── OralTablet.jsx
│       ├── LiquidOral.jsx
│       ├── WeightBased.jsx
│       ├── IVPumpRate.jsx          (mL/hr)
│       ├── IVDripRate.jsx          (gtt/min) ← make this prominent
│       ├── InfusionTime.jsx
│       ├── Reconstitution.jsx
│       ├── SafeDoseRange.jsx
│       ├── BSA.jsx
│       └── Titration.jsx           ← uses drug presets; dose↔rate both directions
└── README.md
```

**Hard rule:** the screens are thin UI wrappers. ALL math lives in `calc-engine.js` and ALL checks live in `validation.js`. Never inline a formula inside a component. This keeps the engine unit-testable and trustworthy.

---

## NON-NEGOTIABLE BEHAVIORS (every calculator screen)

1. **Show the worked solution** in all three methods (basic formula / ratio-proportion / dimensional analysis). This is the core differentiator — it teaches, doesn't just answer.
2. **Run validation before showing a result.** If `validation.js` returns blocking errors, show them instead of an answer. If it returns warnings, show the answer WITH a banner.
3. **Round per the rules in `format.js`**: gtt/min → whole number; mL/hr → whole or tenths per a pump-precision toggle; never silently round high-alert doses (show the unrounded and rounded value).
4. **Persistent disclaimer** in the footer: *"Reference & learning tool. Verify against the order and facility policy. Not a substitute for clinical judgment."*
5. **High-alert + 2-nurse-check banner** auto-fires for any drug flagged `highAlert: true` in the presets, and for heparin/insulin/pressors/pediatric.
6. **Nursing Considerations button** on every titration/drug result opens the card from `drug-presets.json`.
7. Inputs accept **lb or kg** with a visible toggle; always display the kg conversion in the worked solution.

---

## BUILD PROMPT (paste this into Claude Code as your first message)

> Build the NurseCalc app per BUILD.md in this folder. Use the provided `src/lib/calc-engine.js`, `src/lib/validation.js`, and `src/data/drug-presets.json` exactly as the source of truth — wire the UI to them, do not rewrite the formulas. Start by scaffolding the Vite + React + Tailwind project and getting three screens working end-to-end: **IV Drip Rate (gtt/min)**, **Weight-Based Dosing**, and **Titration** (using a drug preset). Each must: take inputs, call the engine, run validation, render the ResultCard + WorkedSolution (all 3 methods) + SafetyBanner, and print cleanly. Then add the remaining screens. Keep everything offline and dark-themed. After each screen works, write a quick unit test for its engine function against the worked examples in the reference doc. Show me the running app, then we iterate.

---

## PHASED ROADMAP

**Phase 1 — Engine + 3 core screens (prove the concept)**
- Scaffold project. Wire `calc-engine.js` + `validation.js`.
- Build IV Drip Rate, Weight-Based, Titration screens fully (inputs → result → 3-method worked solution → safety banner → print).
- Unit tests for those engine functions against the reference doc's worked examples.

**Phase 2 — Complete the calculators**
- Add Oral Tablet, Liquid, IV Pump Rate, Infusion Time, Reconstitution, Safe Dose Range, BSA.
- Add the full drug preset library to Titration with the Nursing Considerations cards.
- Unit conversions screen.

**Phase 3 — Make it teach (educator edge)**
- Practice Mode: randomized drill problems per calculation type with answer-checking and step-by-step rationale (the thing paid apps charge institutions for).
- Optional score/streak in memory.

**Phase 4 — Ship it**
- PWA manifest + service worker for true offline + "add to home screen."
- Light/dark polish, accessibility pass, print-stylesheet refinement.
- Optional Capacitor wrap for Play Store / App Store.

---

## QUALITY BAR / DEFINITION OF DONE (per screen)

- [ ] Engine function is pure, imported from `calc-engine.js`, covered by at least one test matching the reference worked example.
- [ ] Validation runs first; blocking errors prevent a result; warnings show alongside it.
- [ ] Worked solution shows all 3 methods and the kg conversion where relevant.
- [ ] Rounding follows `format.js` rules and shows unrounded value for high-alert drugs.
- [ ] Prints cleanly to one page (result + worked solution + nursing considerations if a drug).
- [ ] Disclaimer present. High-alert banner fires when applicable.

---

## CLINICAL SOURCING (do not drift from this)

All formulas and drug data trace to `NurseCalc_Formula_and_Drug_Reference.md`, which is grounded in Davis's Drug Guide, Mosby's Nursing Drug Reference, Saunders, the Lippincott Nursing Drug Handbook, Lehne's, Lilley, and the Open RN / OpenStax dosage-calculation curriculum. The app **paraphrases and cites** these ("per Davis's Drug Guide"); it must never reproduce copyrighted monograph text verbatim. Standard concentrations are institution-variable presets, not prescriptive — the order and facility policy always override. Pediatric dosing defers to a pediatric reference and facility protocol.

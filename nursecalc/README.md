# NurseCalc

Free, offline, nursing-focused medication calculator for nursing students and nurses
(Philippine context). It shows the **full worked solution** for every calculation in all
three methods (basic formula, ratio & proportion, dimensional analysis), runs **safety
checks on every input**, and surfaces **handbook-based nursing considerations**.

> ⚕️ Reference & learning tool. Verify against the order and facility policy.
> Not a substitute for clinical judgment. Not a dose-issuing medical device.

## Calculators

| Screen | Engine function(s) |
| --- | --- |
| IV Drip Rate (gtt/min) — gravity, prominent | `dripRate` |
| Weight-Based Dosing (kg/lb toggle) | `weightBased` |
| Titration drips — bidirectional, 14 drug presets | `doseToRateWeight`, `rateToDoseWeight`, `doseToRateMcgMin`, `rateToDoseMcgMin`, `doseToRateMgMin`, `rateToDoseMgMin`, `doseToRateMgHr`, `rateToDoseMgHr`, `unitsToRate`, `rateToUnits` |
| Oral / Tablet | `oralTablet` |
| Liquid / Injectable | `liquidDose` |
| IV Pump Rate (mL/hr) | `pumpRate` |
| Infusion Time (+ completion clock) | `infusionTime` |
| Reconstitution | `reconstitution` |
| Safe Dose Range (classifies the order) | `safeDoseRange` |
| BSA Mosteller (+ optional mg/m² dose) | `bsaMosteller`, `bsaDose` |

## Architecture

- **All math** lives in `src/lib/calc-engine.js`; **all checks** in `src/lib/validation.js`;
  rounding/display rules in `src/lib/format.js`. Screens are thin UI wrappers — no inline formulas.
- Drug presets + nursing cards: `src/data/drug-presets.json` (institution-variable; the order
  and facility policy override).
- gtt/min always rounds to whole drops; mL/hr has a pump-precision toggle; high-alert doses
  are never silently rounded (unrounded value shown).
- High-alert / vesicant / LASA / pediatric banners fire automatically from the presets.
- Offline-first: no network calls at runtime; no browser storage. Dark theme default.
- Every result prints cleanly (result + worked solution + nursing card) via the browser
  print dialog.

## Develop

```bash
npm install
npm run dev      # local dev server
npm test         # 35 tests: engine vs. reference worked examples, validation, UI smoke
npm run build    # production bundle in dist/
```

## Clinical sourcing

Open, freely available references only — knowledge that shouldn't be paywalled:

- **Formulas** — Open RN / OpenStax dosage-calculation curriculum (CC BY), cross-checked against
  the Gray Morris worked examples.
- **Drug data** — paraphrased from U.S. FDA prescribing information (DailyMed / openFDA), Open RN
  *Nursing Pharmacology* (CC BY), StatPearls, MedlinePlus, the WHO Model Formulary, and AHA ACLS
  guidelines for the emergency/cardiac drugs. Each card carries its citation; dose ranges,
  antidotes, and high-alert handling were spot-verified against these sources (2025–2026).

No copyrighted monograph text (Davis's, Lippincott, Mosby's) is reproduced. Standard concentrations
are institution-variable presets; the prescriber's order and facility policy always override.
Pediatric dosing defers to a pediatric reference and facility protocol.

## Roadmap (per BUILD.md)

- Phase 3 — Practice Mode: randomized drills with answer-checking and rationale.
- Phase 4 — PWA manifest + service worker, accessibility pass, optional Capacitor wrap.

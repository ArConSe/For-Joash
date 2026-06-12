# NurseCalc — Master Calculation & Emergency Drug Reference

**Purpose:** Build-ready specification of every formula and high-alert IV medication parameter for a free, nursing-focused medication calculator app. All formulas are validated against nursing education and clinical sources (see Source Notes at end).

**Scope:** Adult + pediatric general dosing, IV flow/drip rates, weight-based and titration drips, reconstitution, safe-dose-range checks, and a vetted emergency/high-alert IV drug table with standard concentrations and dose ranges.

**Authority of record:** Every formula and drug entry is grounded in the recognized nursing references — *Davis's Drug Guide for Nurses*, *Mosby's Nursing Drug Reference*, *Saunders Nursing Drug Handbook*, the *Lippincott Nursing Drug Handbook*, and the *Lehne's* / *Lilley* pharmacology texts — plus the Open RN / OpenStax dosage-calculation curriculum for the math. See **Source Notes & Handbook Anchoring** at the end for full traceability. The app paraphrases and cites these handbooks; it does not reproduce monograph text verbatim.

> ⚠️ **Design principle:** Every calculation in the app must (a) show the full worked solution, (b) run a plausibility/safety check on inputs, and (c) carry a "reference and learning tool — verify before administering" disclaimer. This is a clinical decision-support / education tool, NOT a device that issues an authoritative dose.

---

## PART 1 — CORE NURSING FORMULAS

### 1.1 Oral / Tablet Dosage (solid)

**Formula (Desired-over-Have):**
```
Number of tablets = Desired dose (D) ÷ Available dose per tablet (H)
```
Worked example: Order 500 mg; on hand 250 mg/tab → 500 ÷ 250 = **2 tablets**.

**Validation rules:**
- Flag if result is not a "giveable" form (e.g. 2.5 of a non-scored tablet, or >3 tablets per dose) → prompt to verify.
- Flag if D > H × reasonable max (e.g. result > 4 tablets).

### 1.2 Liquid / Oral Suspension Dosage

**Formula (Desired-over-Have × Quantity):**
```
Volume to give (mL) = (Desired dose D ÷ Available dose H) × Volume of available (Q)
```
Worked example: Order 160 mg; on hand 100 mg/5 mL → (160 ÷ 100) × 5 = **8 mL**.

### 1.3 Injectable (parenteral) Dosage

Same Desired-over-Have × Quantity formula as liquids:
```
Volume (mL) = (D ÷ H) × Q
```
Worked example: digoxin 0.5 mg ordered; vial 0.25 mg/mL → (0.5 ÷ 0.25) × 1 = **2 mL**.

### 1.4 Weight-Based Dosing (mg/kg, mcg/kg, units/kg)

**Step 1 — convert weight if needed:**
```
Weight (kg) = Weight (lb) ÷ 2.2
```
**Step 2 — total dose:**
```
Dose = Ordered dose per kg × Weight (kg)
```
Worked example: 5 mg/kg ordered, patient 70 kg → 5 × 70 = **350 mg**.

**Validation rules:**
- Reject weight outside 0.5–300 kg (catch lb-entered-as-kg errors).
- Always show the kg conversion explicitly.

### 1.5 IV Flow Rate — Pump (mL/hr)

```
Rate (mL/hr) = Total volume (mL) ÷ Time (hr)
```
Worked example: 1000 mL over 8 hr → 1000 ÷ 8 = **125 mL/hr**.

### 1.6 IV Drip Rate — Gravity (gtt/min)

```
Drip rate (gtt/min) = [Total volume (mL) × Drop factor (gtt/mL)] ÷ Time (min)
```
- Time must be in **minutes** (hours × 60).
- **Round to the nearest whole drop** (cannot deliver a fraction of a drop).

Worked example: 1000 mL over 8 hr, drop factor 15 gtt/mL → (1000 × 15) ÷ 480 = 31.25 → **31 gtt/min**.

**Drop factors (printed on tubing):**

| Tubing type | Drop factor |
|-------------|-------------|
| Macrodrip | 10, 15, or 20 gtt/mL |
| Macrodrip (blood) | often 10 gtt/mL |
| Microdrip / pediatric | 60 gtt/mL |

**Shortcut to surface in UI:** with **microdrip (60 gtt/mL), gtt/min = mL/hr** (1:1). Good built-in sanity check.

### 1.7 Infusion Time

```
Infusion time (hr) = Total volume (mL) ÷ Rate (mL/hr)
```
Worked example: 1000 mL at 125 mL/hr → 8 hr. (Convert decimal hr to hr+min for display; optionally output completion time in 24-hr/military time.)

### 1.8 Reconstitution (powdered drug)

After adding diluent, the vial label states a final concentration (mg/mL). Then apply the standard volume formula:
```
Volume to give (mL) = (Desired dose D ÷ Reconstituted concentration H) × 1 mL
```
Worked example: ceftriaxone 1 g ordered; 2 g vial reconstituted to 200 mg/mL → 1000 mg ÷ 200 mg/mL = **5 mL**.

### 1.9 Body Surface Area (BSA) — Mosteller

```
BSA (m²) = √[ (Height cm × Weight kg) ÷ 3600 ]
```
BSA dose:
```
Dose = Ordered dose per m² × BSA (m²)
```
Used for chemo and other narrow-therapeutic-index drugs. (DuBois formula optional/secondary: BSA = 0.20247 × Ht(m)^0.725 × Wt(kg)^0.425.)

### 1.10 Safe Dose Range (SDR) check

```
Min safe dose = Min mg/kg × Weight (kg)
Max safe dose = Max mg/kg × Weight (kg)
```
Compare the ordered dose to this range and return: **SAFE / BELOW RANGE / EXCEEDS RANGE → clarify with prescriber.** Worked example: child 15 kg, range 5–10 mg/kg → safe per-dose window 75–150 mg.

> This SDR engine is the single most valuable safety feature — most free apps don't have it.

---

## PART 2 — CRITICAL CARE / TITRATION FORMULAS

These convert between an ordered weight-based dose and a pump rate. The app should solve in **both directions** (dose → mL/hr, and mL/hr → dose) so nurses can verify a running drip.

### 2.1 Concentration of the bag

```
Concentration (mg/mL) = Total drug (mg) ÷ Total volume (mL)
Concentration (mcg/mL) = Concentration (mg/mL) × 1000
```
Example: dopamine 400 mg / 250 mL = 1.6 mg/mL = 1600 mcg/mL.

### 2.2 Dose (mcg/kg/min) → Pump rate (mL/hr)

```
Rate (mL/hr) = [Dose (mcg/kg/min) × Weight (kg) × 60] ÷ Concentration (mcg/mL)
```
Example: 5 mcg/kg/min, 86 kg, dopamine 1600 mcg/mL → (5 × 86 × 60) ÷ 1600 = **16.1 mL/hr**.

### 2.3 Pump rate (mL/hr) → Dose (mcg/kg/min)

```
Dose (mcg/kg/min) = [Rate (mL/hr) × Concentration (mcg/mL)] ÷ [Weight (kg) × 60]
```
Example: dobutamine 5000 mcg/mL at 3 mL/hr, 100 kg → (3 × 5000) ÷ (100 × 60) = **2.5 mcg/kg/min**.

### 2.4 Non-weight-based dose (mcg/min) → mL/hr

```
Rate (mL/hr) = [Dose (mcg/min) × 60] ÷ Concentration (mcg/mL)
```
Used for norepinephrine, epinephrine, nitroglycerin when ordered in mcg/min.

### 2.5 mg/min ↔ mL/hr (e.g. amiodarone maintenance, lidocaine)

```
Rate (mL/hr) = [Dose (mg/min) × 60] ÷ Concentration (mg/mL)
```

### 2.6 Units/hr ↔ mL/hr (heparin, insulin)

```
Rate (mL/hr) = Ordered units/hr ÷ Concentration (units/mL)
Dose (units/hr) = Rate (mL/hr) × Concentration (units/mL)
```
Example: heparin 25,000 units / 250 mL = 100 units/mL; running at 11 mL/hr → 1100 units/hr.

> **High-alert flag:** heparin, insulin, and all titratable pressors should trigger the app's "independent double-check recommended" banner.

---

## PART 3 — EMERGENCY / HIGH-ALERT IV DRIP REFERENCE

Pre-loaded drug presets for the titration calculator. Each entry: typical standard concentration(s), usual adult dose range, and notes. **Ranges are typical references — facility protocol and the prescriber's order always override.**

### 3.1 Vasopressors & Inotropes

| Drug | Common standard concentration | Usual adult dose range | Key notes |
|------|-------------------------------|------------------------|-----------|
| **Dopamine** | 400 mg / 250 mL D5W (1600 mcg/mL); also 800 mg/250 mL | 2–20 mcg/kg/min | Renal/low 2–5; beta/cardiac 5–10; alpha/pressor 10–20. ACLS bradycardia 2nd-line after atropine. Use 60-gtt tubing if no pump. |
| **Dobutamine** | 500 mg / 250 mL (2000 mcg/mL); also 250 mg/250 mL | 2–20 mcg/kg/min | Primarily inotrope (β1). May drop BP via vasodilation. |
| **Norepinephrine (Levophed)** | 4 mg / 250 mL (16 mcg/mL); 8 mg/250 mL | 0.01–1 mcg/kg/min (or 2–30+ mcg/min) | First-line pressor in septic shock. Central line preferred; extravasation risk. |
| **Epinephrine (infusion)** | 1 mg / 250 mL (4 mcg/mL); 2 mg/250 mL | 0.01–0.08 mcg/kg/min; or 2–10 mcg/min | Infusion ≠ arrest dose. ACLS bradycardia/post-ROSC: 2–10 mcg/min titrated. |
| **Phenylephrine** | 50 mg / 250 mL (200 mcg/mL) | 40–180 mcg/min (≈0.5–1.4 mcg/kg/min) | Pure alpha; reflex bradycardia possible. |
| **Vasopressin** | 20 units / 100 mL (0.2 units/mL) | Fixed 0.03–0.04 units/min (not titrated) | Adjunct to norepinephrine in septic shock; ACLS 40 units IV ×1 (push). |

### 3.2 Antiarrhythmics

| Drug | Standard prep | Dosing | Key notes |
|------|---------------|--------|-----------|
| **Amiodarone** | Load 150 mg in 100 mL D5W; maintenance 450–900 mg/250 mL D5W | Stable VT: 150 mg over 10 min. Then **1 mg/min × 6 hr, then 0.5 mg/min × 18 hr**. Arrest VF/pVT: 300 mg IV push, may repeat 150 mg. | Use D5W. Inline filter; central line preferred for prolonged use. |
| **Lidocaine** | 1–2 g / 250 mL (4–8 mg/mL) | Bolus 1–1.5 mg/kg; infusion 1–4 mg/min | Antiarrhythmic alternative to amiodarone. |
| **Esmolol** | 2500 mg / 250 mL (10 mg/mL) | 50–200 mcg/kg/min (after optional load) | Short-acting β-blocker. |

### 3.3 Vasodilators / Antihypertensives

| Drug | Standard prep | Dosing | Key notes |
|------|---------------|--------|-----------|
| **Nitroglycerin** | 50 mg / 250 mL (200 mcg/mL) | Start 5 mcg/min, titrate (typical up to ~200 mcg/min) | Non-PVC tubing ideal. Ordered in mcg/min (not weight-based). |
| **Nicardipine** | 25 mg / 250 mL (0.1 mg/mL) | Start 5 mg/hr, ↑ 2.5 mg/hr q5–15 min, **max 15 mg/hr** | Ordered in mg/hr — different mental model from mcg/kg/min. |
| **Sodium nitroprusside** | 50 mg / 250 mL D5W (200 mcg/mL) | Start ~0.3 mcg/kg/min, titrate (max ~10 mcg/kg/min) | Cyanide toxicity at high/prolonged dose; protect from light. |
| **Clevidipine** | 25 mg / 50 mL (0.5 mg/mL) | 1–2 mg/hr, titrate, max ~21 mg/hr | Lipid emulsion. |

### 3.4 Other High-Alert Infusions

| Drug | Standard prep | Dosing | Key notes |
|------|---------------|--------|-----------|
| **Heparin** | 25,000 units / 250 mL (100 units/mL) | Weight-based per protocol/nomogram; e.g. 12–18 units/kg/hr | aPTT/anti-Xa titrated; 2-nurse check. |
| **Insulin (regular)** | 100 units / 100 mL NS (1 unit/mL) | Per DKA / glucose protocol | High-alert; 2-nurse check; never confuse units with mL. |
| **Magnesium sulfate** | e.g. 20 g / 500 mL | OB/torsades per protocol (e.g. 1–2 g/hr) | Monitor reflexes/resp rate. |

---

## PART 4 — NURSING CONSIDERATIONS (per drug)

This is the section that makes the app **nursing-focused, not just a calculator**. Each drug preset should open a "Nursing Considerations" card structured the same way every time, so it mirrors how nurses are taught (assess → administer → monitor → patient teaching → safety). Structure below is the template.

> **Card template for every drug:** Before · Administration/Route · Monitor (what & how often) · Hold/Notify parameters · Antidote/Toxicity · Patient teaching · Look-alike/Sound-alike alert.

### Cross-cutting rule for ALL high-alert drips
- **Independent double-check** of the original order, dose calculation, and pump settings by a second nurse before starting and at every titration. IV vasoactive meds are high-alert.
- **Correct hypovolemia first** — give volume/fluid before starting a vasopressor ("fluids before pressors"); a pressor on an empty tank does nothing and risks ischemia.
- **Continuous monitoring** — BP (arterial line ideal), HR, rhythm/ECG, and urine output as a perfusion marker. Target is usually **MAP ≥ 65 mmHg** unless the order says otherwise.
- **Never bolus or abruptly stop** a titratable drip — wean/taper per order to avoid rebound.

### 4.1 Dopamine
- **Before:** correct hypovolemia; baseline BP, HR, ECG, urine output, IV site.
- **Route/admin:** central line preferred; if no pump, use 60-gtt microdrip. Dose-dependent effects — low (renal), mid (cardiac/beta), high (vasoconstrictor/alpha).
- **Monitor:** continuous BP/ECG; urine output; peripheral perfusion; titrate to ordered MAP/BP.
- **Hold/notify:** new tachy-/dysrhythmias, chest pain, BP outside ordered range.
- **Extravasation:** vesicant — **boxed warning** for tissue necrosis/sloughing/gangrene. Stop, don't flush, aspirate, then **phentolamine** + warm compress.
- **LASA alert:** **do NOT confuse dopamine with dobutamine** — store separately.

### 4.2 Dobutamine
- **Before:** correct hypovolemia with volume expanders; baseline VS, ECG.
- **Route/admin:** large vein/central; dilute before use; primarily an inotrope (β1).
- **Monitor:** BP (may *drop* from vasodilation), HR, ECG for dysrhythmias, cardiac output/response, signs of improved perfusion.
- **Hold/notify:** chest pain, SOB, marked tachycardia, numbness/tingling in extremities, site pain.
- **Extravasation:** vesicant — stop infusion, leave catheter, aspirate, elevate, warm compress, **phentolamine** antidote.
- **Contraindication note:** hypertrophic cardiomyopathy with outflow obstruction.
- **LASA alert:** do NOT confuse with dopamine.

### 4.3 Norepinephrine (Levophed)
- **Before:** ensure adequate volume; baseline BP/HR; central access preferred (antecubital large-bore if peripheral, avoid lower-extremity veins).
- **Route/admin:** first-line pressor in septic shock; have defibrillator/resuscitation cart and cardiac monitor nearby.
- **Monitor:** BP **every few minutes** during titration (continuous/arterial ideal), HR, rhythm, urine output, peripheral perfusion; assess site every 5–15 min if peripheral.
- **Hold/notify:** BP outside ordered MAP target, new dysrhythmia, signs of decreased perfusion.
- **Extravasation:** potent vesicant → ischemia/necrosis. Stop immediately, aspirate, **phentolamine**.

### 4.4 Epinephrine (infusion)
- **Before:** baseline VS, ECG, glucose (esp. diabetics).
- **Route/admin:** infusion dose ≠ cardiac-arrest push dose — verify which is ordered. Titrate to response.
- **Monitor:** continuous BP, HR, **rhythm/ECG closely** (dysrhythmia risk); blood glucose (causes hyperglycemia).
- **Hold/notify:** chest pain, dysrhythmias, severe hypertension.
- **Extravasation:** vesicant — boxed warning; same stop/aspirate/phentolamine pathway.

### 4.5 Phenylephrine
- **Monitor:** BP and HR — pure alpha agonist, so watch for **reflex bradycardia** as BP rises; urine output/perfusion.
- **Before:** correct volume; baseline VS.
- **Extravasation:** vasoconstrictor — same vesicant precautions.

### 4.6 Vasopressin
- **Admin:** fixed dose, **not titrated**; adjunct to norepinephrine in septic shock.
- **Monitor:** BP, perfusion, urine output (acts on renal water reabsorption), signs of peripheral/mesenteric ischemia.

### 4.7 Amiodarone
- **Before:** baseline BP, HR, **continuous ECG**; baseline assessment essential for titration.
- **Route/admin:** **use D5W**; central line preferred for prolonged infusion; inline filter; mind the 150 mg over 10 min → 1 mg/min ×6 hr → 0.5 mg/min ×18 hr sequence.
- **Monitor:** continuous ECG (QT prolongation, bradycardia), BP (**hypotension** with rapid infusion), infusion site (phlebitis — vesicant-like irritation).
- **Hold/notify:** significant bradycardia, hypotension, QT prolongation.
- **Contraindication note:** pregnancy/lactation (Category D).

### 4.8 Lidocaine (antiarrhythmic)
- **Monitor:** ECG, BP; watch for **CNS toxicity** — confusion, slurred speech, perioral numbness, tremor, seizures. Hold and notify if neuro signs appear.

### 4.9 Esmolol
- **Admin:** very short half-life (~9 min) — acts and reverses fast; accurate dosing critical.
- **Monitor:** HR and BP continuously during titration (drops both); watch for bradycardia/hypotension.

### 4.10 Nitroglycerin
- **Before:** baseline BP, HR; confirm SBP adequate; ask about **phosphodiesterase inhibitors (sildenafil/Viagra, tadalafil)** — combination causes profound hypotension.
- **Route/admin:** non-PVC tubing ideal (drug adsorbs to PVC); ordered in mcg/min.
- **Monitor:** BP frequently/continuously, HR (reflex tachycardia), headache (very common), chest pain relief.
- **Hold/notify:** SBP below ordered floor (commonly <90), worsening hypotension.
- **Ointment tip (if relevant):** wipe off the previous dose before applying new; wear gloves (absorption → headache).
- **LASA alert:** name confusion **nitroglycerin vs nitroprusside** — verify carefully.

### 4.11 Nicardipine
- **Admin:** ordered in **mg/hr** (not mcg/kg/min) — different mental model; start 5 mg/hr, max 15 mg/hr.
- **Monitor:** BP and HR continuously; assess for reflex tachycardia; IV site (change site per policy to reduce phlebitis).

### 4.12 Sodium nitroprusside (Nipride)
- **Before:** baseline BP, renal/hepatic function; ICU-level monitoring required.
- **Route/admin:** **protect from light** (wrap bag); D5W; potent/fast vasodilator, quickly reversible.
- **Monitor:** continuous arterial BP; watch for **cyanide/thiocyanate toxicity** — metabolic acidosis, AMS, dyspnea, bradycardia, seizures; monitor thiocyanate levels on/after day 3; don't hold >10 mcg/kg/min for long.
- **Hold/notify:** signs of toxicity, hypotension below target.

### 4.13 Heparin (infusion)
- **Before:** baseline aPTT/anti-Xa, CBC/platelets, weight (weight-based protocol); **never** interchange heparin flush concentration with infusion heparin — read the label.
- **Admin:** **two-nurse independent check** required; per nomogram/protocol.
- **Monitor:** aPTT or anti-Xa per protocol; platelets (watch for **HIT**); bleeding (gums, urine, stool, IV sites, neuro changes).
- **Antidote:** **protamine sulfate.**
- **Hold/notify:** active bleeding, platelet drop, critical aPTT.

### 4.14 Insulin (infusion)
- **Before:** baseline glucose, potassium; dedicated line; **two-nurse check**.
- **Admin:** 1 unit/mL standard; **never confuse units with mL**; prime tubing (insulin adsorbs to plastic).
- **Monitor:** **finger-stick glucose typically q1h** (q30min during titration per protocol); potassium (insulin drives K⁺ intracellularly → hypokalemia); switch fluids per protocol when glucose drops (e.g. add dextrose <250 mg/dL).
- **Hold/notify:** hypoglycemia, hypokalemia.

### 4.15 Magnesium sulfate
- **Monitor:** deep tendon reflexes (loss = early toxicity), respiratory rate, BP, urine output, mag level.
- **Antidote:** **calcium gluconate** for magnesium toxicity.
- **Hold/notify:** absent reflexes, RR <12, respiratory depression.

> **App behavior:** the calculator result screen for any drug above should show a "Nursing Considerations" button that opens this card. The high-alert banner and the 2-nurse-check reminder (Part 6, items 5–6) fire automatically for every drug in Part 3.

---

## PART 5 — UNIT CONVERSIONS (built-in reference)

| From | To | Factor |
|------|----|--------|
| 1 kg | lb | 2.2 lb |
| 1 g | mg | 1000 mg |
| 1 mg | mcg | 1000 mcg |
| 1 L | mL | 1000 mL |
| 1 tsp | mL | 5 mL |
| 1 tbsp | mL | 15 mL |
| 1 oz | mL | 30 mL |
| 1 grain (gr) | mg | ~60–65 mg |
| 1 hr | min | 60 min |

---

## PART 6 — VALIDATION / SAFETY ENGINE (spec for developer)

Every calculator screen runs these checks before showing a result:

1. **Missing input guard** — never compute on a blank required field; prompt instead.
2. **Implausible weight** — reject <0.5 kg or >300 kg; suspect lb entered as kg.
3. **Unit mismatch guard** — force matching units (mcg with mcg/mL, etc.) before solving.
4. **Magnitude/plausibility check** — e.g. tablets >4, drip >250 gtt/min, pump rate >999 mL/hr → "Unusual result, please verify."
5. **Safe Dose Range check** — where min/max mg/kg known, classify SAFE / OUT OF RANGE.
6. **High-alert banner** — heparin, insulin, pressors, pediatric doses → "Independent double-check recommended."
7. **Always show the worked solution** in all 3 methods (formula / ratio-proportion / dimensional analysis).
8. **Rounding rules** — gtt/min to whole number; mL/hr per pump capability (whole or tenths); never silently round high-alert doses without showing it.
9. **Persistent disclaimer** — reference & learning tool; verify against order and facility policy; not a substitute for clinical judgment.

---

## SOURCE NOTES & HANDBOOK ANCHORING

All clinical content in this document is grounded in the standard nursing drug handbooks and pharmacology textbooks identified in the earlier research, not in general web sources. Those references are the authority of record for the app; web sources were used only to confirm that values match what these handbooks publish.

### Primary references (authority of record)

**Drug data (monographs, dosing, nursing implications, high-alert/vesicant status, antidotes):**
- *Davis's Drug Guide for Nurses* (Vallerand & Sanoski, F.A. Davis) — primary source for nursing implications, the independent two-nurse high-alert check, vesicant/extravasation pathways, phentolamine antidote, and "do not confuse dobutamine with dopamine." Verified directly against current Davis's monographs.
- *Mosby's Nursing Drug Reference* (Skidmore-Roth, Elsevier) — Black Box Warnings, High Alert and Safety Alert designations, side effects by body system.
- *Saunders Nursing Drug Handbook* (Kizior & Hodgson, Elsevier) — IV administration detail, dosage forms, interactions.
- *Nursing Drug Handbook* (Lippincott/Wolters Kluwer) — boxed warnings, nursing considerations, patient teaching.

**Calculation methods & formulas:**
- *Lehne's Pharmacology for Nursing Care* (Burchum & Rosenthal, Elsevier) and *Pharmacology and the Nursing Process* (Lilley, Collins & Snyder, Elsevier) — pharmacology framing and the nursing-process structure used in the Nursing Considerations cards.
- Open RN *Nursing Pharmacology* and *Nursing Skills / Nursing Dosage Calculations* (CC-BY OER) and OpenStax *Pharmacology for Nurses* — the Desired-over-Have (D/H × V) formula, dimensional analysis, ratio-proportion, reconstitution, weight-based dosing, BSA (Mosteller), and IV flow/drip-rate formulas. These open texts are the legally adaptable backbone of the calculation engine.
- *Calculate with Confidence* (Gray Morris) and *Dosage Calculations Made Incredibly Easy* (Lippincott) — worked-example structure and the three-method approach.
- Lippincott NursingCenter "Common Drug Calculations" pocket card — titration / mcg/kg/min ↔ mL/hr worked formulas.

**Standard concentrations & emergency dosing ranges:**
- ASHP Standardize 4 Safety adult continuous-infusion standards (concentration presets) and ACLS provider references (emergency dose ranges), both cross-checked against the Davis's/Mosby's monographs above.

### Section-by-section traceability

| Section | Grounded in |
|---------|-------------|
| Parts 1–2 (all formulas) | Open RN / OpenStax dosage-calculation curriculum; Gray Morris; Lippincott pocket card |
| Part 3 (drug table — concentration, dose range) | Davis's & Mosby's monographs; ASHP S4S; ACLS references |
| Part 4 (nursing considerations) | Davis's Drug Guide nursing implications; Lehne / Lilley nursing-process framing |
| Part 5 (conversions) | Standard nursing handbook conversion tables (consistent across Davis's, Mosby's, Lilley) |
| Part 6 (safety engine) | ISMP high-alert medication principles as reflected in Davis's/Mosby's "High Alert" designations |

### Important caveats
- **Standard concentrations vary by institution.** Values listed seed the calculator presets; they are common references, not prescriptive. The prescriber's order and facility protocol always override.
- **Pediatric/neonatal dosing** should default to facility protocol and a current pediatric reference (e.g. *Lexicomp Pediatric Dosage Handbook*), not adult presets.
- **Handbook content is copyrighted.** The app must paraphrase nursing considerations and cite the source handbook (e.g. "per Davis's Drug Guide"); it must not reproduce monograph text verbatim. Editions update annually — the build should track the latest edition of each named reference.

*Compiled for the NurseCalc build. Philippine context note: gravity (gtt/min) calculations remain heavily used in PH wards, so the drip-rate engine and 60-gtt microdrip default should be front-and-center, not buried behind pump-only assumptions. The Generics Act naming convention (generic name first) should also follow the handbooks' generic-name-primary organization.*

/**
 * NurseCalc — Engine tests (Vitest-style)
 * Run: npx vitest
 * These assert the engine matches the WORKED EXAMPLES in the reference doc.
 * They are the safety net: if a refactor breaks a formula, these fail.
 */
import { describe, it, expect } from "vitest";
import {
  oralTablet,
  liquidDose,
  weightBased,
  pumpRate,
  dripRate,
  infusionTime,
  reconstitution,
  bsaMosteller,
  safeDoseRange,
  doseToRateWeight,
  rateToDoseWeight,
  doseToRateMcgMin,
  doseToRateMgMin,
  unitsToRate,
  rateToUnits,
  cockcroftGault,
  idealBodyWeightKg,
  pediatricMaintenanceFluid,
} from "../src/lib/calc-engine.js";

describe("general dosing", () => {
  it("oral tablet 500/250 = 2", () => {
    expect(oralTablet({ desired: 500, onHand: 250 }).value).toBe(2);
  });
  it("liquid 160 mg from 100 mg/5 mL = 8 mL", () => {
    expect(liquidDose({ desired: 160, onHand: 100, perVolume: 5 }).value).toBe(8);
  });
  it("weight-based 5 mg/kg × 70 kg = 350 mg", () => {
    expect(weightBased({ dosePerKg: 5, weight: 70, weightUnit: "kg" }).value).toBe(350);
  });
  it("weight-based handles lb conversion", () => {
    const r = weightBased({ dosePerKg: 5, weight: 154, weightUnit: "lb" });
    expect(r.weightKg).toBe(70);
    expect(r.value).toBe(350);
  });
});

describe("IV flow / time", () => {
  it("pump rate 1000 mL / 8 hr = 125 mL/hr", () => {
    expect(pumpRate({ volumeMl: 1000, timeHr: 8 }).value).toBe(125);
  });
  it("drip rate 1000 mL, 480 min, 15 gtt/mL = 31 gtt/min (rounded)", () => {
    expect(dripRate({ volumeMl: 1000, timeMin: 480, dropFactor: 15 }).value).toBe(31);
  });
  it("microdrip gtt/min equals mL/hr sanity", () => {
    const r = dripRate({ volumeMl: 50, timeMin: 60, dropFactor: 60 });
    expect(r.value).toBe(50);
  });
  it("infusion time 1000 mL at 125 mL/hr = 8 hr", () => {
    expect(infusionTime({ volumeMl: 1000, rateMlHr: 125 }).value).toBe(8);
  });
});

describe("reconstitution / BSA / SDR", () => {
  it("ceftriaxone 1000 mg at 200 mg/mL = 5 mL", () => {
    expect(reconstitution({ desired: 1000, reconstitutedConc: 200 }).value).toBe(5);
  });
  it("BSA Mosteller 165 cm, 70 kg ≈ 1.79 m²", () => {
    expect(bsaMosteller({ heightCm: 165, weightKg: 70 }).value).toBeCloseTo(1.79, 1);
  });
  it("SDR 15 kg, 5–10 mg/kg = 75–150 mg", () => {
    const r = safeDoseRange({ minPerKg: 5, maxPerKg: 10, weight: 15, orderedDose: 200, unitLabel: "mg" });
    expect(r.min).toBe(75);
    expect(r.max).toBe(150);
    expect(r.classification).toMatch(/EXCEEDS/);
  });
});

describe("titration (bidirectional)", () => {
  it("dopamine 5 mcg/kg/min, 86 kg, 400 mg/250 mL ≈ 16.1 mL/hr", () => {
    const r = doseToRateWeight({
      doseMcgKgMin: 5, weight: 86, weightUnit: "kg", totalDrugMg: 400, totalVolumeMl: 250,
    });
    expect(r.concMcgMl).toBe(1600);
    expect(r.value).toBeCloseTo(16.1, 1);
  });
  it("dobutamine 5000 mcg/mL at 3 mL/hr, 100 kg = 2.5 mcg/kg/min", () => {
    // 5000 mcg/mL means 1250 mg / 250 mL → use those numbers
    const r = rateToDoseWeight({
      rateMlHr: 3, weight: 100, weightUnit: "kg", totalDrugMg: 1250, totalVolumeMl: 250,
    });
    expect(r.concMcgMl).toBe(5000);
    expect(r.value).toBeCloseTo(2.5, 1);
  });
  it("nitroglycerin mcg/min → mL/hr", () => {
    const r = doseToRateMcgMin({ doseMcgMin: 50, totalDrugMg: 50, totalVolumeMl: 250 });
    expect(r.concMcgMl).toBe(200);
    expect(r.value).toBe(15);
  });
  it("amiodarone 1 mg/min, 900 mg/500 mL → mL/hr", () => {
    const r = doseToRateMgMin({ doseMgMin: 1, totalDrugMg: 900, totalVolumeMl: 500 });
    expect(r.concMgMl).toBeCloseTo(1.8, 3);
    expect(r.value).toBeCloseTo(33.3, 1);
  });
  it("heparin 1100 units/hr at 100 units/mL = 11 mL/hr; reverse checks", () => {
    expect(unitsToRate({ unitsPerHr: 1100, totalUnits: 25000, totalVolumeMl: 250 }).value).toBe(11);
    expect(rateToUnits({ rateMlHr: 11, totalUnits: 25000, totalVolumeMl: 250 }).value).toBe(1100);
  });
});

describe("renal & pediatric", () => {
  it("Cockcroft-Gault: 60y, 70kg, male, SCr 1.0 mg/dL ≈ 77.8 mL/min", () => {
    expect(cockcroftGault({ age: 60, weightKg: 70, sex: "male", scr: 1.0 }).value).toBeCloseTo(77.8, 1);
  });
  it("Cockcroft-Gault: female applies the 0.85 factor", () => {
    expect(cockcroftGault({ age: 60, weightKg: 70, sex: "female", scr: 1.0 }).value).toBeCloseTo(66.1, 1);
  });
  it("Cockcroft-Gault: 88.4 µmol/L equals 1.0 mg/dL (SI conversion)", () => {
    const si = cockcroftGault({ age: 60, weightKg: 70, sex: "male", scr: 88.4, scrUnit: "umol/L" }).value;
    const us = cockcroftGault({ age: 60, weightKg: 70, sex: "male", scr: 1.0 }).value;
    expect(si).toBeCloseTo(us, 1);
  });
  it("Devine ideal body weight: 175 cm male ≈ 70.5 kg", () => {
    expect(idealBodyWeightKg({ heightCm: 175, sex: "male" })).toBeCloseTo(70.5, 1);
  });
  it("pediatric 4-2-1: 35 kg → 75 mL/hr and 1800 mL/day", () => {
    const r = pediatricMaintenanceFluid({ weightKg: 35 });
    expect(r.value).toBe(75);
    expect(r.perDay).toBe(1800);
  });
  it("pediatric 4-2-1: band boundaries 10 kg → 40, 20 kg → 60 mL/hr", () => {
    expect(pediatricMaintenanceFluid({ weightKg: 10 }).value).toBe(40);
    expect(pediatricMaintenanceFluid({ weightKg: 20 }).value).toBe(60);
  });
});

/**
 * Tests for the engine EXTENSIONS (reverse titration + mg/hr mode).
 * Each reverse function must invert its forward counterpart, and the
 * mg/hr functions are checked against the nicardipine preset
 * (25 mg / 250 mL = 0.1 mg/mL → 5 mg/hr = 50 mL/hr).
 */
import { describe, it, expect } from "vitest";
import {
  doseToRateMgHr,
  rateToDoseMgHr,
  rateToDoseMcgMin,
  rateToDoseMgMin,
  doseToRateMcgMin,
  doseToRateMgMin,
} from "../src/lib/calc-engine.js";

describe("mg/hr mode (nicardipine, magnesium)", () => {
  it("nicardipine 5 mg/hr at 0.1 mg/mL = 50 mL/hr", () => {
    const r = doseToRateMgHr({ doseMgHr: 5, totalDrugMg: 25, totalVolumeMl: 250 });
    expect(r.concMgMl).toBe(0.1);
    expect(r.value).toBe(50);
  });
  it("reverse: 50 mL/hr at 0.1 mg/mL = 5 mg/hr", () => {
    expect(rateToDoseMgHr({ rateMlHr: 50, totalDrugMg: 25, totalVolumeMl: 250 }).value).toBe(5);
  });
  it("magnesium 1 g/hr at 40 mg/mL (20 g/500 mL) = 25 mL/hr", () => {
    expect(doseToRateMgHr({ doseMgHr: 1000, totalDrugMg: 20000, totalVolumeMl: 500 }).value).toBe(25);
  });
});

describe("reverse mcg/min (nitroglycerin verify)", () => {
  it("15 mL/hr at 200 mcg/mL = 50 mcg/min (inverts doseToRateMcgMin)", () => {
    const fwd = doseToRateMcgMin({ doseMcgMin: 50, totalDrugMg: 50, totalVolumeMl: 250 });
    const rev = rateToDoseMcgMin({ rateMlHr: fwd.value, totalDrugMg: 50, totalVolumeMl: 250 });
    expect(rev.value).toBe(50);
  });
});

describe("reverse mg/min (amiodarone verify)", () => {
  it("33.3 mL/hr at 1.8 mg/mL ≈ 1 mg/min (inverts doseToRateMgMin)", () => {
    const fwd = doseToRateMgMin({ doseMgMin: 1, totalDrugMg: 900, totalVolumeMl: 500 });
    const rev = rateToDoseMgMin({ rateMlHr: fwd.value, totalDrugMg: 900, totalVolumeMl: 500 });
    expect(rev.value).toBeCloseTo(1, 2);
  });
});

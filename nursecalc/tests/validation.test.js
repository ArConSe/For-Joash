/** Validation engine: blocking errors, plausibility warnings, high-alert banners. */
import { describe, it, expect } from "vitest";
import {
  requireNumbers,
  requirePositive,
  validateWeight,
  validateResult,
  validateDoseRange,
  highAlertBanners,
  runValidation,
} from "../src/lib/validation.js";
import presets from "../src/data/drug-presets.json";

describe("requireNumbers", () => {
  it("flags empty and non-numeric inputs", () => {
    expect(requireNumbers({ Dose: "" })).toHaveLength(1);
    expect(requireNumbers({ Dose: "abc" })).toHaveLength(1);
    expect(requireNumbers({ Dose: "-5" })).toHaveLength(1);
    expect(requireNumbers({ Dose: "5" })).toHaveLength(0);
  });
});

describe("requirePositive", () => {
  it("flags zero, leaves blanks/negatives to requireNumbers", () => {
    expect(requirePositive({ Time: "0" })).toHaveLength(1);
    expect(requirePositive({ Time: "" })).toHaveLength(0);
    expect(requirePositive({ Time: "-5" })).toHaveLength(0);
    expect(requirePositive({ Time: "8" })).toHaveLength(0);
  });
  it("runValidation blocks on a zero denominator without duplicating messages", () => {
    const v = runValidation({ inputs: { Time: "0" }, positive: { Time: "0" } });
    expect(v.errors).toEqual(["Time must be greater than zero."]);
  });
});

describe("validateWeight", () => {
  it("catches probable lb-as-kg entry", () => {
    expect(validateWeight(350, "kg").warnings.length).toBeGreaterThan(0);
    expect(validateWeight(70, "kg").warnings).toHaveLength(0);
  });
});

describe("validateResult plausibility", () => {
  it("warns on >4 tablets and non-splittable fractions", () => {
    expect(validateResult("oralTablet", 5).length).toBeGreaterThan(0);
    expect(validateResult("oralTablet", 1.3).length).toBeGreaterThan(0);
    expect(validateResult("oralTablet", 1.5)).toHaveLength(0);
  });
  it("warns on implausible drip rates", () => {
    expect(validateResult("dripRate", 300).length).toBeGreaterThan(0);
    expect(validateResult("dripRate", 31)).toHaveLength(0);
  });
});

describe("validateDoseRange", () => {
  const dopamine = presets.drugs.find((d) => d.id === "dopamine");
  it("warns above and below the published range", () => {
    expect(validateDoseRange({ dose: 25, doseRange: dopamine.doseRange }).length).toBe(1);
    expect(validateDoseRange({ dose: 1, doseRange: dopamine.doseRange }).length).toBe(1);
    expect(validateDoseRange({ dose: 5, doseRange: dopamine.doseRange })).toHaveLength(0);
  });
});

describe("high-alert banners", () => {
  it("fires high-alert + vesicant + LASA for dopamine preset", () => {
    const dopamine = presets.drugs.find((d) => d.id === "dopamine");
    const banners = highAlertBanners({ drug: dopamine, category: dopamine.category });
    const levels = banners.map((b) => b.level);
    expect(levels).toContain("high-alert");
    expect(levels).toContain("vesicant");
    expect(levels).toContain("lasa");
  });
  it("runValidation blocks on missing input and still banners", () => {
    const heparin = presets.drugs.find((d) => d.id === "heparin");
    const v = runValidation({ inputs: { "Dose": "" }, drug: heparin, category: heparin.category });
    expect(v.errors.length).toBeGreaterThan(0);
    expect(v.banners.some((b) => b.level === "high-alert")).toBe(true);
  });
});

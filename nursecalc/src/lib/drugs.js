/**
 * Single merged drug list shared by the Drug Guide screen and the Home
 * search: the critical-care titration presets plus the general ward /
 * emergency medications, sorted by generic name.
 */
import drips from "../data/drug-presets.json";
import wardMeds from "../data/drug-guide.json";

export const ALL_DRUGS = [
  ...drips.drugs.map((d) => ({ ...d, section: "Critical-care drip" })),
  ...wardMeds.drugs.map((d) => ({ ...d, section: "Ward / emergency" })),
].sort((a, b) => a.generic.localeCompare(b.generic));

/** Shared search predicate so Home and the Drug Guide match identically. */
export function matchesDrug(drug, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [drug.generic, drug.brand, drug.category, drug.section].some(
    (s) => s && s.toLowerCase().includes(q)
  );
}

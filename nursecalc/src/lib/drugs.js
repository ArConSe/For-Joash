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

/** Display order for the therapeutic-class groups in the Drug Guide. */
export const GROUP_ORDER = [
  "Critical-care drips (vasoactive)",
  "Cardiovascular",
  "Anticoagulants & antiplatelets",
  "Antibiotics & antimicrobials",
  "Endocrine & diabetes",
  "Respiratory",
  "Gastrointestinal",
  "Pain, sedation & reversal",
  "CNS & seizure",
  "Fluids & electrolytes",
  "Emergency & antidotes",
  "Obstetric",
];

/** Distinct groups actually present, in GROUP_ORDER (unknowns appended). */
export const GROUPS = [
  ...GROUP_ORDER.filter((g) => ALL_DRUGS.some((d) => d.group === g)),
  ...[...new Set(ALL_DRUGS.map((d) => d.group))]
    .filter((g) => g && !GROUP_ORDER.includes(g))
    .sort(),
];

/** Group a drug list into ordered { group, drugs } buckets (skips empties). */
export function groupDrugs(list) {
  return GROUPS.map((group) => ({
    group,
    drugs: list.filter((d) => d.group === group),
  })).filter((b) => b.drugs.length > 0);
}

/** Shared search predicate so Home and the Drug Guide match identically. */
export function matchesDrug(drug, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [drug.generic, drug.brand, drug.category, drug.group, drug.section].some(
    (s) => s && s.toLowerCase().includes(q)
  );
}

/**
 * The calculator catalog — single source of truth for navigation.
 * Home renders the categorized grid from CATEGORIES; App resolves an
 * open tool by id via BY_ID. Each item carries its icon name and the
 * screen component, so adding a calculator is a one-line change here.
 */
import IVDripRate from "./screens/IVDripRate.jsx";
import IVPumpRate from "./screens/IVPumpRate.jsx";
import InfusionTime from "./screens/InfusionTime.jsx";
import Titration from "./screens/Titration.jsx";
import OralTablet from "./screens/OralTablet.jsx";
import LiquidOral from "./screens/LiquidOral.jsx";
import WeightBased from "./screens/WeightBased.jsx";
import SafeDoseRange from "./screens/SafeDoseRange.jsx";
import Reconstitution from "./screens/Reconstitution.jsx";
import BSA from "./screens/BSA.jsx";

export const CATEGORIES = [
  {
    name: "IV & Infusion",
    items: [
      {
        id: "drip",
        label: "IV Drip Rate (gtt/min)",
        short: "Gravity drip — drops per minute",
        keywords: "gtt drops gravity drop factor macro microdrip tubing manual",
        icon: "droplet",
        Component: IVDripRate,
      },
      {
        id: "pump",
        label: "IV Pump Rate (mL/hr)",
        short: "Electronic infusion pump rate",
        keywords: "ml/hr volume time pump electronic flow",
        icon: "gauge",
        Component: IVPumpRate,
      },
      {
        id: "time",
        label: "Infusion Time",
        short: "How long a bag will last",
        keywords: "duration finish complete bag volume rate clock",
        icon: "clock",
        Component: InfusionTime,
      },
      {
        id: "titration",
        label: "Titration Drips",
        short: "Critical-care drips, dose ⇄ rate",
        keywords: "dopamine norepinephrine heparin insulin pressor mcg/kg/min units/hr critical care vasopressor",
        icon: "pulse",
        Component: Titration,
      },
    ],
  },
  {
    name: "Dosing",
    items: [
      {
        id: "oral",
        label: "Oral / Tablet",
        short: "Tablets to give from an order",
        keywords: "tablet pill po desired on hand capsule",
        icon: "pill",
        Component: OralTablet,
      },
      {
        id: "liquid",
        label: "Liquid / Injectable",
        short: "mL to give from a concentration",
        keywords: "liquid suspension injectable syringe ml dilution mg/ml",
        icon: "beaker",
        Component: LiquidOral,
      },
      {
        id: "weight",
        label: "Weight-Based",
        short: "Dose from mg/kg × weight",
        keywords: "mg/kg mcg/kg weight kg lb pediatric body weight",
        icon: "weight",
        Component: WeightBased,
      },
      {
        id: "sdr",
        label: "Safe Dose Range",
        short: "Check an order against a reference",
        keywords: "safe range min max verify exceeds below pediatric mg/kg",
        icon: "shield",
        Component: SafeDoseRange,
      },
    ],
  },
  {
    name: "Preparation",
    items: [
      {
        id: "recon",
        label: "Reconstitution",
        short: "mL to draw after mixing",
        keywords: "reconstitute powder vial diluent concentration draw up",
        icon: "flask",
        Component: Reconstitution,
      },
      {
        id: "bsa",
        label: "Body Surface Area",
        short: "Mosteller m² + BSA dosing",
        keywords: "bsa mosteller body surface area m2 chemotherapy height",
        icon: "ruler",
        Component: BSA,
      },
    ],
  },
];

export const ALL_CALCULATORS = CATEGORIES.flatMap((c) => c.items);

export const BY_ID = Object.fromEntries(ALL_CALCULATORS.map((i) => [i.id, i]));

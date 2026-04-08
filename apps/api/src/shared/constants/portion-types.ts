export const PORTION_TYPES = [
  "carb",
  "protein",
  "vegetable",
  "legume",
  "broth",
  "sauce",
  "soup",
  "other",
] as const;

export type PortionType = (typeof PORTION_TYPES)[number];

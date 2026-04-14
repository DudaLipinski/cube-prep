import type { CreatePortionBody, Portion } from "@cube-prep/api-client";
import type { TypeConfig } from "@/components/portions/TypeSelector";
import { Bean, CookingPot, Droplet, Droplets, Drumstick, Leaf, Soup, Wheat } from "lucide-react";

export type PortionFormState = {
  name: string;
  type: CreatePortionBody["type"];
  quantity: string;
  preparedAt: string;
};

export const portionTypes: Array<CreatePortionBody["type"]> = [
  "carb",
  "protein",
  "vegetable",
  "legume",
  "broth",
  "sauce",
  "soup",
  "other",
];

export const portionTypeConfig: Record<CreatePortionBody["type"], TypeConfig> = {
  carb: {
    label: "Carb",
    iconBadgeClass: "bg-food-carb/20",
    iconColorClass: "text-food-carb",
    selectedBorderClass: "border-food-carb",
    icon: Wheat,
  },
  protein: {
    label: "Protein",
    iconBadgeClass: "bg-food-protein/20",
    iconColorClass: "text-food-protein",
    selectedBorderClass: "border-food-protein",
    icon: Drumstick,
  },
  vegetable: {
    label: "Veggie",
    iconBadgeClass: "bg-food-vegetable/20",
    iconColorClass: "text-food-vegetable",
    selectedBorderClass: "border-food-vegetable",
    icon: Leaf,
  },
  legume: {
    label: "Legume",
    iconBadgeClass: "bg-food-legume/20",
    iconColorClass: "text-food-legume",
    selectedBorderClass: "border-food-legume",
    icon: Bean,
  },
  broth: {
    label: "Broth",
    iconBadgeClass: "bg-food-broth/20",
    iconColorClass: "text-food-broth",
    selectedBorderClass: "border-food-broth",
    icon: Droplet,
  },
  sauce: {
    label: "Sauce",
    iconBadgeClass: "bg-food-sauce/20",
    iconColorClass: "text-food-sauce",
    selectedBorderClass: "border-food-sauce",
    icon: Droplets,
  },
  soup: {
    label: "Soup",
    iconBadgeClass: "bg-food-soup/20",
    iconColorClass: "text-food-soup",
    selectedBorderClass: "border-food-soup",
    icon: Soup,
  },
  other: {
    label: "Other",
    iconBadgeClass: "bg-food-other/20",
    iconColorClass: "text-food-other",
    selectedBorderClass: "border-food-other",
    icon: CookingPot,
  },
};

function toDateTimeLocalValue(date: Date): string {
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export function getDefaultPortionFormValues(): PortionFormState {
  return {
    name: "",
    type: "carb",
    quantity: "1",
    preparedAt: toDateTimeLocalValue(new Date()),
  };
}

export function mapPortionToFormValues(portion: Portion): PortionFormState {
  return {
    name: portion.name,
    type: portion.type,
    quantity: String(portion.quantity),
    preparedAt: toDateTimeLocalValue(new Date(portion.prepared_at)),
  };
}

export function mapFormToPortionPayload(value: PortionFormState): CreatePortionBody {
  return {
    name: value.name.trim(),
    type: value.type,
    quantity: Number(value.quantity),
    prepared_at: new Date(value.preparedAt).toISOString(),
  };
}

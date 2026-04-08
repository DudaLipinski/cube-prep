import type { CreatePortionBody, Portion } from "@cube-prep/api-client";

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

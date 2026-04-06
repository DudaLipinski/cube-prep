import createClient from "openapi-fetch";
import type { components, paths } from "./generated/schema";

export type { components, paths } from "./generated/schema";

export type Portion = components["schemas"]["Portion"];
export type CreatePortionBody = components["schemas"]["CreatePortionBody"];
export type UpdatePortionBody = components["schemas"]["UpdatePortionBody"];

export function createApiClient(baseUrl = "/api") {
  return createClient<paths>({ baseUrl });
}

export const apiClient = createApiClient();

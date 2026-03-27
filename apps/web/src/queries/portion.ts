import { queryOptions } from "@tanstack/react-query";
import { apiClient, type Portion } from "@cube-prep/api-client";

export const portionsQueryOptions = queryOptions({
  queryKey: ["portions"],
  queryFn: async (): Promise<Portion[]> => {
    const { data } = await apiClient.GET("/portion");

    if (!data) {
      throw new Error("Could not load portions.");
    }

    return data;
  },
});

import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  apiClient,
  type CreatePortionBody,
  type paths,
  type UpdatePortionBody,
} from "@cube-prep/api-client";

type ListPortionsQuery = NonNullable<paths["/portions"]["get"]["parameters"]["query"]>;
export const portionsQueryKey = ["portions"] as const;

export const portionsQueryOptions = (query?: ListPortionsQuery) =>
  queryOptions({
    queryKey: [...portionsQueryKey, query?.sort, query?.order],
    queryFn: async () => {
      const { data } = await apiClient.GET("/portions", {
        params: {
          query,
        },
      });

      if (!data) {
        throw new Error("Could not load portions.");
      }

      return data;
    },
  });

export const portionsMutationOptions = mutationOptions({
  mutationKey: ["create-portion"],
  mutationFn: async (payload: CreatePortionBody) => {
    const { data } = await apiClient.POST("/portions", {
      body: payload,
    });

    if (!data) {
      throw new Error("Could not create portion.");
    }

    return data;
  },
});

export const portionByIdQueryOptions = (portionId?: string) =>
  queryOptions({
    queryKey: ["portion", portionId],
    queryFn: async () => {
      if (!portionId) {
        throw new Error("No portion selected.");
      }

      const { data } = await apiClient.GET("/portions/{id}", {
        params: { path: { id: portionId } },
      });

      if (!data) {
        throw new Error("Could not load selected portion.");
      }

      return data;
    },
  });

export const updatePortionMutationOptions = (portionId?: string) =>
  mutationOptions({
    mutationKey: ["update-portion", portionId],
    mutationFn: async (payload: UpdatePortionBody) => {
      if (!portionId) {
        throw new Error("No portion selected.");
      }

      const { data } = await apiClient.PATCH("/portions/{id}", {
        params: { path: { id: portionId } },
        body: payload,
      });

      if (!data) {
        throw new Error("Could not update portion.");
      }

      return data;
    },
  });

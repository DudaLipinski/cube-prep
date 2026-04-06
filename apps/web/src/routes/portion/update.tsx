import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  portionsQueryOptions,
  portionByIdQueryOptions,
  updatePortionMutationOptions,
} from "@/queries/portion";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  mapFormToPortionPayload,
  mapPortionToFormValues,
  portionTypes,
  type PortionFormState,
} from "./-portion-form.shared";

export const Route = createFileRoute("/portion/update")({
  validateSearch: z.object({
    portionId: z.uuid().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { portionId } = Route.useSearch();

  const portionQuery = useQuery({
    ...portionByIdQueryOptions(portionId),
    enabled: Boolean(portionId),
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8 sm:px-6 md:px-8">
      <h1 className="mb-5 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.15rem]">
        Update Portion
      </h1>

      {!portionId && <p className="text-sm text-on-surface-variant">No portion selected.</p>}

      {portionId && portionQuery.isPending && (
        <p className="text-sm text-on-surface-variant">Loading selected portion...</p>
      )}

      {portionId && portionQuery.isError && (
        <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm tracking-[0.01em] text-destructive">
          Could not load selected portion.
        </p>
      )}

      {portionId && portionQuery.data && (
        <UpdatePortionForm
          key={portionId}
          portionId={portionId}
          initialValues={mapPortionToFormValues(portionQuery.data)}
        />
      )}
    </main>
  );
}

type UpdatePortionFormProps = {
  portionId: string;
  initialValues: PortionFormState;
};

function UpdatePortionForm({ portionId, initialValues }: UpdatePortionFormProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation(updatePortionMutationOptions(portionId));

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }: { value: PortionFormState }) => {
      updateMutation.reset();
      const payload = mapFormToPortionPayload(value);

      try {
        await updateMutation.mutateAsync(payload);
        void queryClient.invalidateQueries({ queryKey: portionsQueryOptions.queryKey });
        void queryClient.invalidateQueries({ queryKey: ["portion", portionId] });

        toast.success("Portion updated.", {
          position: "bottom-center",
        });
      } catch (error) {
        const message =
          error instanceof Error && error.message ? error.message : "Could not update portion.";

        toast.error(message, {
          position: "bottom-center",
        });
      }
    },
  });

  const isSubmitting = updateMutation.isPending || form.state.isSubmitting;

  return (
    <Card>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!event.currentTarget.reportValidity()) return;
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <>
                  <FieldLabel htmlFor="portion-name">Name</FieldLabel>
                  <Input
                    id="portion-name"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <>
                  <FieldTitle>Type</FieldTitle>
                  <FieldContent>
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as PortionFormState["type"])
                      }
                      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                    >
                      {portionTypes.map((type) => (
                        <FieldLabel key={type} htmlFor={`portion-type-${type}`}>
                          <Field
                            orientation="horizontal"
                            className="items-center rounded-xl border p-3"
                          >
                            <RadioGroupItem id={`portion-type-${type}`} value={type} />
                            <span className="capitalize">{type}</span>
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </FieldContent>
                </>
              )}
            </form.Field>

            <form.Field name="quantity">
              {(field) => (
                <>
                  <FieldLabel htmlFor="portion-quantity">Quantity</FieldLabel>
                  <Input
                    id="portion-quantity"
                    type="number"
                    min={1}
                    step={0.25}
                    inputMode="decimal"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </>
              )}
            </form.Field>

            <form.Field name="preparedAt">
              {(field) => (
                <>
                  <FieldLabel htmlFor="portion-prepared-at">Prepared at</FieldLabel>
                  <Input
                    id="portion-prepared-at"
                    type="datetime-local"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                </>
              )}
            </form.Field>
          </FieldGroup>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update portion"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

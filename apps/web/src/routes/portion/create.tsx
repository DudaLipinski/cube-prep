import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portionsMutationOptions, portionsQueryOptions } from "@/queries/portion";
import type { CreatePortionBody } from "@cube-prep/api-client";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/portion/create")({
  component: CreatePortion,
});

type FormState = {
  name: string;
  type: CreatePortionBody["type"];
  quantity: string;
  preparedAt: string;
};

const portionTypes: Array<CreatePortionBody["type"]> = [
  "carb",
  "protein",
  "vegetable",
  "legume",
  "fat",
  "sauce",
  "soup",
  "other",
];

function toDateTimeLocalValue(date: Date): string {
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

function getDefaultValues(): FormState {
  return {
    name: "",
    type: "carb",
    quantity: "1",
    preparedAt: toDateTimeLocalValue(new Date()),
  };
}

function CreatePortion() {
  const queryClient = useQueryClient();
  const mutation = useMutation(portionsMutationOptions);

  const form = useForm({
    defaultValues: getDefaultValues(),
    onSubmit: async ({ value }: { value: FormState }) => {
      mutation.reset();

      const payload: CreatePortionBody = {
        name: value.name.trim(),
        type: value.type,
        quantity: Number(value.quantity),
        prepared_at: new Date(value.preparedAt).toISOString(),
      };

      try {
        await mutation.mutateAsync(payload);
        await queryClient.invalidateQueries({ queryKey: portionsQueryOptions.queryKey });
        toast.success("Portion created.", {
          position: "bottom-center",
        });
        form.reset(getDefaultValues());
      } catch (error) {
        const message =
          error instanceof Error && error.message ? error.message : "Could not create portion.";

        toast.error(message, {
          position: "bottom-center",
        });

        return;
      }
    },
  });

  const isSubmitting = mutation.isPending || form.state.isSubmitting;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-8 sm:px-6 md:px-8">
      <h1 className="mb-5 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.15rem]">
        Create Portion
      </h1>

      <Card>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
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
                      placeholder="Rice cubes"
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
                          field.handleChange(value as CreatePortionBody["type"])
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
                      step={0.5}
                      inputMode="numeric"
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
              {isSubmitting ? "Saving..." : "Create portion"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

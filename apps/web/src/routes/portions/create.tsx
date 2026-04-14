import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portionsMutationOptions, portionsQueryKey } from "@/queries/portion";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TypeSelector } from "@/components/portions/TypeSelector";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDefaultPortionFormValues,
  mapFormToPortionPayload,
  portionTypes,
  portionTypeConfig,
  type PortionFormState,
} from "./-portion-form.shared";

export const Route = createFileRoute("/portions/create")({
  component: CreatePortion,
});

function CreatePortion() {
  const queryClient = useQueryClient();
  const mutation = useMutation(portionsMutationOptions);

  const form = useForm({
    defaultValues: getDefaultPortionFormValues(),
    onSubmit: async ({ value }: { value: PortionFormState }) => {
      mutation.reset();
      const payload = mapFormToPortionPayload(value);

      try {
        await mutation.mutateAsync(payload);
        void queryClient.invalidateQueries({ queryKey: portionsQueryKey });
        toast.success("Portion created.", {
          position: "bottom-center",
        });
        form.reset(getDefaultPortionFormValues());
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
    <main className="mx-auto w-full max-w-lg px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2 size-8 shrink-0">
            <Link to="/portions">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <CardTitle className="text-xl font-semibold tracking-[-0.02em]">Create Portion</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!event.currentTarget.reportValidity()) return;
              form.handleSubmit();
            }}
          >
            <FieldGroup className="gap-4">
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
                      <TypeSelector
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as PortionFormState["type"])
                        }
                        types={portionTypes}
                        typeConfig={portionTypeConfig}
                      />
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
                {(field) => {
                  const date = new Date(field.state.value);
                  const time = field.state.value.split("T")[1] || "12:00";

                  return (
                    <>
                      <FieldLabel>Prepared at</FieldLabel>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-start text-left font-normal",
                                !field.state.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(date, "MMM d, yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                if (selectedDate) {
                                  const newDate = new Date(selectedDate);
                                  const [hours, minutes] = time.split(":").map(Number);
                                  newDate.setHours(hours, minutes);
                                  const tzOffsetMs = newDate.getTimezoneOffset() * 60 * 1000;
                                  const isoString = new Date(newDate.getTime() - tzOffsetMs)
                                    .toISOString()
                                    .slice(0, 16);
                                  field.handleChange(isoString);
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <Input
                          type="time"
                          value={time}
                          onChange={(event) => {
                            const [hours, minutes] = event.target.value.split(":").map(Number);
                            const newDate = new Date(date);
                            newDate.setHours(hours, minutes);
                            const tzOffsetMs = newDate.getTimezoneOffset() * 60 * 1000;
                            const isoString = new Date(newDate.getTime() - tzOffsetMs)
                              .toISOString()
                              .slice(0, 16);
                            field.handleChange(isoString);
                          }}
                          className="w-24"
                        />
                      </div>
                    </>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Create portion"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

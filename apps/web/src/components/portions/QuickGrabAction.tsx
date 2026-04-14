import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { Portion } from "@cube-prep/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { portionsQueryKey, updatePortionMutationOptions } from "@/queries/portion";

type QuickGrabActionProps = {
  portion: Portion;
  children: ReactNode;
};

function formatPortionTypeLabel(type: Portion["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function QuickGrabAction({ portion, children }: QuickGrabActionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const hasStock = portion.quantity > 0;
  const initialGrabAmount = portion.quantity >= 1 ? "1" : String(portion.quantity);

  const updateMutation = useMutation(updatePortionMutationOptions(portion.id));

  const form = useForm({
    defaultValues: {
      grabAmount: initialGrabAmount,
    },
    onSubmit: async ({ value }) => {
      const amount = Number(value.grabAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error("Enter a valid amount greater than 0.", {
          position: "bottom-center",
        });
        return;
      }

      if (amount > portion.quantity) {
        toast.error(`You only have ${portion.quantity} qty available.`, {
          position: "bottom-center",
        });
        return;
      }

      const nextQuantity = Math.max(0, Math.round((portion.quantity - amount) * 100) / 100);

      try {
        await updateMutation.mutateAsync({
          name: portion.name,
          type: portion.type,
          quantity: nextQuantity,
          prepared_at: portion.prepared_at,
        });

        await queryClient.invalidateQueries({ queryKey: portionsQueryKey });
        await queryClient.invalidateQueries({ queryKey: ["portion", portion.id] });

        toast.success("Inventory updated.", {
          description: `${portion.name}: ${portion.quantity} -> ${nextQuantity}`,
          position: "bottom-center",
        });

        setOpen(false);
        form.reset();
      } catch (error) {
        const message =
          error instanceof Error && error.message ? error.message : "Could not update inventory.";

        toast.error(message, {
          position: "bottom-center",
        });
      }
    },
  });

  const isSubmitting = updateMutation.isPending || form.state.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className="h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Grab from inventory for ${portion.name}`}
        >
          {children}
        </div>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-64 gap-3 bg-surface-bright px-3 py-4 shadow-[0_22px_50px_rgb(53_50_42_/_0.18)] ring-1 ring-foreground/8 dark:bg-surface-container dark:shadow-[0_24px_52px_rgb(0_0_0_/_0.42)]"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="rounded-xl bg-surface-container-high/70 px-3 py-2.5 dark:bg-surface-container-high">
          <p className="pb-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/60">
            Grab from inventory
          </p>
          <p className="line-clamp-2 text-sm font-semibold leading-tight tracking-[-0.02em] text-foreground">
            {portion.name}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2 text-[0.7rem] text-on-surface-variant">
            <span>{formatPortionTypeLabel(portion.type)}</span>
            <span className="rounded-full bg-foreground/6 px-2 py-0.5 font-semibold text-foreground/75">
              {portion.quantity} qty
            </span>
          </div>
          {!hasStock && (
            <p className="mt-1 text-[0.7rem] text-on-surface-variant">No inventory left.</p>
          )}
        </div>

        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!event.currentTarget.reportValidity()) return;
            form.handleSubmit();
          }}
        >
          <form.Field name="grabAmount">
            {(field) => (
              <Input
                type="number"
                min={0.25}
                max={portion.quantity}
                step={0.25}
                inputMode="decimal"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                required
                disabled={!hasStock}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            )}
          </form.Field>

          <Button type="submit" size="sm" className="w-full" disabled={isSubmitting || !hasStock}>
            {isSubmitting ? "Updating..." : "Apply"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

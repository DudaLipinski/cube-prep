import { createFileRoute, Link } from "@tanstack/react-router";
import { portionsQueryOptions } from "@/queries/portion";
import { useQuery } from "@tanstack/react-query";
import { type ComponentType, type SVGProps } from "react";
import type { Portion } from "@cube-prep/api-client";
import { Bean, CookingPot, Droplets, Drumstick, Leaf, Plus, Soup, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";
import { Route as createRoute } from "@/routes/portion/create";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(portionsQueryOptions).catch(() => {}),
  component: HomePage,
});

type InventoryTile = {
  label: string;
  bgClass: string;
  iconBadgeClass: string;
  qtyBadgeClass: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type PortionType = Portion["type"];

const inventoryTiles = {
  protein: {
    label: "Protein",
    bgClass: "bg-secondary-fixed-dim/25 dark:bg-secondary-fixed-dim/20",
    iconBadgeClass: "bg-secondary-fixed-dim/45 dark:bg-secondary-fixed-dim/35",
    qtyBadgeClass: "bg-secondary-fixed-dim/30 text-foreground/80 dark:bg-secondary-fixed-dim/25",
    icon: Drumstick,
  },
  legume: {
    label: "Legume",
    bgClass: "bg-primary-dim/22 dark:bg-primary-dim/16",
    iconBadgeClass: "bg-primary-dim/40 dark:bg-primary-dim/28",
    qtyBadgeClass: "bg-white text-foreground/80 dark:bg-primary-dim/20",
    icon: Bean,
  },
  vegetable: {
    label: "Veggie",
    bgClass: "bg-primary-fixed-dim/25 dark:bg-primary-fixed-dim/20",
    iconBadgeClass: "bg-primary-fixed-dim/45 dark:bg-primary-fixed-dim/35",
    qtyBadgeClass: "bg-primary-fixed-dim/30 text-foreground/80 dark:bg-primary-fixed-dim/25",
    icon: Leaf,
  },
  carb: {
    label: "Carb",
    bgClass: "bg-tertiary-fixed-dim/25 dark:bg-tertiary-fixed-dim/20",
    iconBadgeClass: "bg-tertiary-fixed-dim/45 dark:bg-tertiary-fixed-dim/35",
    qtyBadgeClass: "bg-tertiary-fixed-dim/30 text-foreground/80 dark:bg-tertiary-fixed-dim/25",
    icon: Wheat,
  },
  fat: {
    label: "Fat",
    bgClass: "bg-accent/20 dark:bg-accent/16",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Droplets,
  },
  sauce: {
    label: "Sauce",
    bgClass: "bg-accent/20 dark:bg-accent/16",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Droplets,
  },
  soup: {
    label: "Soup",
    bgClass: "bg-accent/20 dark:bg-accent/16",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Soup,
  },
  other: {
    label: "Other",
    bgClass: "bg-surface-container-high dark:bg-surface-container-low",
    iconBadgeClass: "bg-surface-container-highest dark:bg-surface-bright/35",
    qtyBadgeClass: "bg-surface-container-highest text-foreground/80 dark:bg-surface-bright/30",
    icon: CookingPot,
  },
} satisfies Record<PortionType, InventoryTile>;

function HomePage() {
  const { data, isError, isPending } = useQuery(portionsQueryOptions);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 pb-28 sm:px-6 md:px-8 md:py-8 md:pb-14">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.15rem] mb-5">
        Pantry Inventory
      </h1>

      {isError && (
        <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm tracking-[0.01em] text-destructive">
          Could not load portions.
        </p>
      )}

      {isPending && (
        <p className="text-sm tracking-[0.01em] text-on-surface-variant">Loading inventory...</p>
      )}

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
        {data &&
          data.map((portion) => {
            const tile = inventoryTiles[portion.type];
            const Icon = tile.icon;

            return (
              <Card key={portion.id} className="gap-3" size="sm">
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-xl",
                      tile.iconBadgeClass,
                    )}
                  >
                    <Icon className="size-4 text-foreground/75" aria-hidden="true" />
                  </CardTitle>
                  <CardAction className="gap-1 flex flex-wrap justify-end">
                    <Badge variant="outline">{portion.quantity} qty</Badge>
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/65">
                    {tile.label}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
                    {portion.name}
                  </h2>
                  <p className="text-xs mt-1">
                    {formatDistanceToNowStrict(new Date(portion.prepared_at), {
                      addSuffix: true,
                    })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Button
        asChild
        size="icon-lg"
        className="fixed right-4 bottom-5 z-20 rounded-full bg-linear-to-br from-primary to-primary-dim text-primary-foreground shadow-[0_10px_30px_rgb(82_100_71_/_0.22)] hover:from-primary hover:to-primary hover:bg-primary md:right-8 md:bottom-8"
      >
        <Link to={createRoute.to} aria-label="Add portion">
          <Plus className="size-5" aria-hidden="true" />
        </Link>
      </Button>
    </main>
  );
}

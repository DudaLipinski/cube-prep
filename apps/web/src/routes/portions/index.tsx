import { createFileRoute, Link } from "@tanstack/react-router";
import { portionsQueryOptions } from "@/queries/portion";
import { useQuery } from "@tanstack/react-query";
import { type ComponentType, type SVGProps } from "react";
import type { Portion } from "@cube-prep/api-client";
import { Bean, CookingPot, Droplets, Drumstick, Leaf, Plus, Soup, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNowStrict } from "date-fns";
import { Route as createRoute } from "@/routes/portions/create";
import { Route as editRoute } from "@/routes/portions/$portionId/edit";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portions/")({
  validateSearch: (search) => {
    const sort = typeof search.sort === "string" ? search.sort : undefined;
    const order = typeof search.order === "string" ? search.order : undefined;

    return {
      sort: sortFields.includes(sort as SortField) ? (sort as SortField) : undefined,
      order: sortOrders.includes(order as SortOrder) ? (order as SortOrder) : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(portionsQueryOptions(deps)).catch(() => {}),
  component: PortionsPage,
});

type InventoryTile = {
  label: string;
  bgClass: string;
  iconBadgeClass: string;
  qtyBadgeClass: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type PortionType = Portion["type"];
type SortField = "name" | "quantity" | "prepared_at";
type SortOrder = "asc" | "desc";
type SortOptionValue = `${SortField}-${SortOrder}`;

const sortFields: SortField[] = ["prepared_at", "name", "quantity"];
const sortOrders: SortOrder[] = ["desc", "asc"];

const sortOptionLabels: Record<SortOptionValue, string> = {
  "prepared_at-desc": "Prepared: Newest",
  "prepared_at-asc": "Prepared: Oldest",
  "name-asc": "Name: A-Z",
  "name-desc": "Name: Z-A",
  "quantity-asc": "Quantity: Low-High",
  "quantity-desc": "Quantity: High-Low",
};

const inventoryTiles = {
  protein: {
    label: "Protein",
    bgClass: "bg-card",
    iconBadgeClass: "bg-secondary-fixed-dim/45 dark:bg-secondary-fixed-dim/35",
    qtyBadgeClass: "bg-secondary-fixed-dim/30 text-foreground/80 dark:bg-secondary-fixed-dim/25",
    icon: Drumstick,
  },
  legume: {
    label: "Legume",
    bgClass: "bg-card",
    iconBadgeClass: "bg-primary-dim/40 dark:bg-primary-dim/28",
    qtyBadgeClass: "bg-white text-foreground/80 dark:bg-primary-dim/20",
    icon: Bean,
  },
  vegetable: {
    label: "Veggie",
    bgClass: "bg-card",
    iconBadgeClass: "bg-primary-fixed-dim/45 dark:bg-primary-fixed-dim/35",
    qtyBadgeClass: "bg-primary-fixed-dim/30 text-foreground/80 dark:bg-primary-fixed-dim/25",
    icon: Leaf,
  },
  carb: {
    label: "Carb",
    bgClass: "bg-card",
    iconBadgeClass: "bg-tertiary-fixed-dim/45 dark:bg-tertiary-fixed-dim/35",
    qtyBadgeClass: "bg-tertiary-fixed-dim/30 text-foreground/80 dark:bg-tertiary-fixed-dim/25",
    icon: Wheat,
  },
  fat: {
    label: "Fat",
    bgClass: "bg-card",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Droplets,
  },
  sauce: {
    label: "Sauce",
    bgClass: "bg-card",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Droplets,
  },
  soup: {
    label: "Soup",
    bgClass: "bg-card",
    iconBadgeClass: "bg-accent/40 dark:bg-accent/30",
    qtyBadgeClass: "bg-accent/25 text-foreground/80 dark:bg-accent/20",
    icon: Soup,
  },
  other: {
    label: "Other",
    bgClass: "bg-card",
    iconBadgeClass: "bg-surface-container-highest dark:bg-surface-bright/35",
    qtyBadgeClass: "bg-surface-container-highest text-foreground/80 dark:bg-surface-bright/30",
    icon: CookingPot,
  },
} satisfies Record<PortionType, InventoryTile>;

function PortionsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isError, isPending } = useQuery(portionsQueryOptions(search));

  const selectedSort = search.sort ?? "prepared_at";
  const selectedOrder = search.order ?? (selectedSort === "name" ? "asc" : "desc");
  const selectedSortValue = `${selectedSort}-${selectedOrder}` as SortOptionValue;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 pb-28 sm:px-6 md:px-8 md:py-8 md:pb-14 xl:max-w-6xl">
      <h1 className="mb-5 text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-[1.95rem]">
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

      <div className="mb-4 flex justify-end md:mb-5">
        <Select
          value={selectedSortValue}
          onValueChange={(value) => {
            const separatorIndex = value.lastIndexOf("-");
            if (separatorIndex === -1) return;
            const sort = value.slice(0, separatorIndex) as SortField;
            const order = value.slice(separatorIndex + 1) as SortOrder;

            navigate({
              search: (prev) => ({
                ...prev,
                sort,
                order,
              }),
            });
          }}
        >
          <SelectTrigger size="sm" className="w-full min-w-0 md:w-[220px]">
            <SelectValue placeholder="Sort inventory" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={8} align="start">
            {Object.entries(sortOptionLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:gap-3.5">
        {data &&
          data.map((portion) => {
            const tile = inventoryTiles[portion.type];
            const Icon = tile.icon;

            return (
              <Link
                key={portion.id}
                to={editRoute.to}
                params={{ portionId: portion.id }}
                className="h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card
                  className={cn(
                    "h-full min-h-44 gap-2 transition-shadow duration-150 hover:shadow-md hover:shadow-black/5 hover:ring-1 hover:ring-border/60 md:min-h-48 md:gap-2.5 lg:min-h-40 lg:gap-2",
                    tile.bgClass,
                  )}
                  size="sm"
                >
                  <CardHeader className="lg:px-3 lg:gap-1.5">
                    <CardTitle
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-lg md:size-11 md:rounded-xl",
                        tile.iconBadgeClass,
                      )}
                    >
                      <Icon
                        className="size-4 text-foreground/75 md:size-[1.125rem]"
                        aria-hidden="true"
                      />
                    </CardTitle>
                    <CardAction className="flex flex-wrap justify-end gap-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 px-2 text-[0.7rem] font-semibold tracking-[0.01em] md:h-6 md:text-xs",
                          tile.qtyBadgeClass,
                        )}
                      >
                        {portion.quantity} qty
                      </Badge>
                    </CardAction>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col lg:px-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/65 md:text-[0.72rem] md:tracking-[0.14em]">
                      {tile.label}
                    </p>
                    <h2 className="mt-1 min-h-[2.45em] text-[0.97rem] font-semibold leading-tight tracking-[-0.02em] text-foreground line-clamp-2 md:text-base lg:min-h-[2.2em] lg:text-[0.95rem]">
                      {portion.name}
                    </h2>
                    <p className="mt-auto pt-1 text-[0.72rem] text-on-surface-variant md:pt-1.5 md:text-xs lg:pt-1 lg:text-[0.72rem]">
                      {formatDistanceToNowStrict(new Date(portion.prepared_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
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

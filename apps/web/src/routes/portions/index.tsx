import { createFileRoute, Link } from "@tanstack/react-router";
import { portionsQueryOptions } from "@/queries/portion";
import { useQuery } from "@tanstack/react-query";
import { type ComponentType, type SVGProps } from "react";
import type { Portion } from "@cube-prep/api-client";
import {
  Bean,
  CookingPot,
  Droplet,
  Droplets,
  Drumstick,
  Leaf,
  Ellipsis,
  Plus,
  Soup,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
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
import { QuickGrabAction } from "@/components/portions/QuickGrabAction";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portions/")({
  validateSearch: (search): { sort?: SortField; order?: SortOrder } => {
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
  iconColorClass: string;
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
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-protein/20",
    iconColorClass: "text-food-protein",
    qtyBadgeClass: "bg-food-protein/15 text-foreground/85",
    icon: Drumstick,
  },
  legume: {
    label: "Legume",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-legume/20",
    iconColorClass: "text-food-legume",
    qtyBadgeClass: "bg-food-legume/15 text-foreground/85",
    icon: Bean,
  },
  vegetable: {
    label: "Veggie",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-vegetable/20",
    iconColorClass: "text-food-vegetable",
    qtyBadgeClass: "bg-food-vegetable/15 text-foreground/85",
    icon: Leaf,
  },
  carb: {
    label: "Carb",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-carb/20",
    iconColorClass: "text-food-carb",
    qtyBadgeClass: "bg-food-carb/15 text-foreground/85",
    icon: Wheat,
  },
  broth: {
    label: "Broth",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-broth/20",
    iconColorClass: "text-food-broth",
    qtyBadgeClass: "bg-food-broth/15 text-foreground/85",
    icon: Droplet,
  },
  sauce: {
    label: "Sauce",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-sauce/20",
    iconColorClass: "text-food-sauce",
    qtyBadgeClass: "bg-food-sauce/15 text-foreground/85",
    icon: Droplets,
  },
  soup: {
    label: "Soup",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-soup/20",
    iconColorClass: "text-food-soup",
    qtyBadgeClass: "bg-food-soup/15 text-foreground/85",
    icon: Soup,
  },
  other: {
    label: "Other",
    bgClass: "bg-white dark:bg-surface-container-low",
    iconBadgeClass: "bg-food-other/20",
    iconColorClass: "text-food-other",
    qtyBadgeClass: "bg-food-other/15 text-foreground/85",
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
              <QuickGrabAction key={portion.id} portion={portion}>
                <Card
                  size="sm"
                  className={cn(
                    "h-full cursor-pointer transition-shadow duration-150 hover:shadow-md hover:shadow-black/5 hover:ring-1 hover:ring-border/60 !gap-1",
                    tile.bgClass,
                  )}
                >
                  <CardHeader className="lg:px-3 lg:gap-1.5">
                    <CardTitle className="flex gap-2 items-center">
                      <div
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-lg md:size-11 md:rounded-xl",
                          tile.iconBadgeClass,
                        )}
                      >
                        <Icon
                          className={cn("size-4 md:size-[1.125rem]", tile.iconColorClass)}
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/65 md:text-[0.72rem] md:tracking-[0.14em]">
                        {tile.label}
                      </p>
                    </CardTitle>
                    <CardAction className="row-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-md border border-outline-variant/35 bg-surface-container-low/85 text-foreground/50 hover:bg-surface-container"
                        aria-label={`Edit ${portion.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate({
                            to: editRoute.to,
                            params: { portionId: portion.id },
                          });
                        }}
                      >
                        <Ellipsis className="size-4 text-foreground/45" aria-hidden="true" />
                      </Button>
                    </CardAction>
                    <CardDescription className="col-span-2 text-[0.68rem] font-semibold text-foreground/65 md:text-[0.72rem]">
                      {portion.quantity} qty
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <h2 className="text-[0.97rem] font-semibold leading-tight tracking-[-0.02em] text-foreground line-clamp-2 md:text-base lg:text-[0.95rem]">
                      {portion.name}
                    </h2>
                    <p className=" text-[0.72rem] text-on-surface-variant md:text-xs pt-1.5 lg:text-[0.72rem]">
                      {formatDistanceToNowStrict(new Date(portion.prepared_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </CardContent>
                </Card>
              </QuickGrabAction>
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

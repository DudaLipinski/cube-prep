import { createRootRouteWithContext, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <AppShell />
      <TanStackRouterDevtools />
    </>
  ),
});

const navigationItems = [
  {
    to: "/portions",
    label: "Inventory",
    isActive: (pathname: string) => pathname === "/portions" || pathname.startsWith("/portions/"),
  },
  {
    to: "/planner",
    label: "Planner",
    isActive: (pathname: string) => pathname.startsWith("/planner"),
  },
  {
    to: "/meals",
    label: "Meals",
    isActive: (pathname: string) => pathname.startsWith("/meals"),
  },
];

function AppShell() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6 md:px-8 md:pt-8">
        <nav aria-label="Primary" className="flex items-end justify-center gap-6 md:gap-8">
          {navigationItems.map((item) => {
            const isActive = item.isActive(pathname);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "border-b-4 border-transparent pb-1 text-[0.95rem] font-medium tracking-[-0.02em] text-on-surface-variant transition-colors hover:text-foreground md:text-[1.05rem]",
                  isActive && "border-primary text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

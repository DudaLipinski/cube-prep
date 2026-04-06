import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-6 pb-10 sm:px-6 md:px-8 md:py-8 md:pb-12">
      <h1 className="mb-5 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.15rem]">
        Meal Planner
      </h1>

      <Card className="bg-surface-container-low text-foreground ring-1 ring-outline-variant/60">
        <CardHeader>
          <CardTitle className="text-lg tracking-[-0.02em]">Planner coming together</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-prose text-sm tracking-[0.01em] text-on-surface-variant md:text-base">
            This screen is ready for your upcoming meal planning flow. For now, the menu tab is
            wired and the page is in place.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

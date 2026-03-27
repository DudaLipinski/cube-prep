import { createFileRoute } from "@tanstack/react-router";
import { portionsQueryOptions } from "../queries/portion";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(portionsQueryOptions).catch(() => {}),
  component: HomePage,
});

function HomePage() {
  const { data, isError } = useQuery(portionsQueryOptions);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-3 px-6 py-10">
      <p className="text-sm text-slate-500">Cube Prep</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Inventory, but simple.
      </h1>
      <div className="flex gap-2">
        {isError && <p className="text-sm text-red-500">Could not load portions.</p>}
        {data?.map((portion) => (
          <div key={portion.id} className="rounded border p-4">
            <p className="text-sm text-slate-500">Portion</p>
            <h2 className="text-lg font-medium tracking-tight text-slate-900">{portion.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";

const HomePage = () => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-3 px-6 py-10">
      <p className="text-sm text-slate-500">Cube Prep</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Inventory, but simple.
      </h1>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

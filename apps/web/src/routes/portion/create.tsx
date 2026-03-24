import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portion/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/portion/create"!</div>;
}

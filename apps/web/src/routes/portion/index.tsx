import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portion/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/portion/"!</div>;
}

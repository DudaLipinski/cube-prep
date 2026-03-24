import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portion/update")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/portion/update"!</div>;
}

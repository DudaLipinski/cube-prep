import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portion/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/portion/portions"!</div>;
}

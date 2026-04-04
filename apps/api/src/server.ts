import { OpenAPIHono } from "@hono/zod-openapi";
import { portionRoutes } from "./modules/portion/portion.routes";
import { swaggerUI } from "@hono/swagger-ui";
import { validationError } from "./shared/validation-errors";

const app = new OpenAPIHono({
  defaultHook: validationError("Validation failed"),
});

app.get("/", (c) => c.text("API running"));

app.route("/portion", portionRoutes);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Cubby API",
    version: "1.0.0",
  },
});

app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.notFound((c) => {
  return c.json({ error: "not_found", message: "Route not found", status: 404 as const }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "internal_error", message: "Something went wrong" }, 500);
});

export default app;

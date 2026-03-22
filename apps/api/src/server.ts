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
    title: "Cube Prep API",
    version: "1.0.0",
  },
});
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

export default app;

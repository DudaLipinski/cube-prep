import { Hono } from "hono";
import { portionRoutes } from "./modules/portion/portion.routes";

const app = new Hono();

app.get("/", (c) => c.text("API running"));
app.route("/portion", portionRoutes);

export default app;

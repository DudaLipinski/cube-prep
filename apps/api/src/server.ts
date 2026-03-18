import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => c.text("API running"))

export default app

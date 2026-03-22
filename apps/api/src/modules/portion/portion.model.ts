import { eq } from "drizzle-orm";
import { db } from "../../db";
import { portionsTable } from "../../db/schema";
import type { CreatePortionBody, UpdatePortionBody } from "./portion.schemas";

export async function listPortions() {
  return await db.select().from(portionsTable);
}

export async function getPortionById(id: string) {
  const [portion] = await db.select().from(portionsTable).where(eq(portionsTable.id, id));
  return portion;
}

export async function createPortion(data: CreatePortionBody) {
  const [portion] = await db.insert(portionsTable).values(data).returning();
  return portion;
}

export async function updatePortion(id: string, data: UpdatePortionBody) {
  const [portion] = await db
    .update(portionsTable)
    .set(data)
    .where(eq(portionsTable.id, id))
    .returning();
  return portion;
}

export async function deletePortion(id: string) {
  const deletedPortions = await db
    .delete(portionsTable)
    .where(eq(portionsTable.id, id))
    .returning();
  return deletedPortions;
}

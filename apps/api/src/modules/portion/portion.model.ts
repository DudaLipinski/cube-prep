import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { portionsTable } from "@/db/schema";
import type { CreatePortionBody, ListPortionsQuery, UpdatePortionBody } from "./portion.schemas";

const sortableColumns = {
  name: portionsTable.name,
  quantity: portionsTable.quantity,
  prepared_at: portionsTable.prepared_at,
  created_at: portionsTable.created_at,
} satisfies Record<NonNullable<ListPortionsQuery["sort"]>, unknown>;

export async function listPortions(query: ListPortionsQuery) {
  const sortKey = query.sort ?? "created_at";
  const sortColumn = sortableColumns[sortKey];
  const orderFn = query.order === "asc" ? asc : desc;

  return await db
    .select()
    .from(portionsTable)
    .where(query.type ? eq(portionsTable.type, query.type) : undefined)
    .orderBy(orderFn(sortColumn));
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

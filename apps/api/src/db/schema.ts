import { pgEnum, pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { PORTION_TYPES } from "../shared/constants/portion-types";

export const portionTypeEnum = pgEnum("portion_type", PORTION_TYPES);

export const portionsTable = pgTable("portions", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  type: portionTypeEnum().notNull(),
  quantity: integer().notNull(),
  prepared_at: timestamp({ withTimezone: true }).notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `StatusItem[]` (statusItems) in lib/data/portfolio-data.ts. */
export const statusItemsTable = pgTable("status_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  position: integer("position").notNull().default(0),
});

export type StatusItemRow = typeof statusItemsTable.$inferSelect;
export type NewStatusItemRow = typeof statusItemsTable.$inferInsert;

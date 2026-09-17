import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `StackLayer[]` (stackLayers) in lib/data/portfolio-data.ts. */
export const stackLayersTable = pgTable("stack_layers", {
  id: serial("id").primaryKey(),
  layer: text("layer").notNull(),
  title: text("title").notNull(),
  tags: text("tags").array().notNull().default([]),
  wide: boolean("wide").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export type StackLayerRow = typeof stackLayersTable.$inferSelect;
export type NewStackLayerRow = typeof stackLayersTable.$inferInsert;

import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `Project[]` (projects) in lib/data/portfolio-data.ts. */
export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  position: integer("position").notNull().default(0),
});

export type ProjectRow = typeof projectsTable.$inferSelect;
export type NewProjectRow = typeof projectsTable.$inferInsert;

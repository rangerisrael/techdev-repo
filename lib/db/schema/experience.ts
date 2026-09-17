import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `ExperienceItem[]` (experience) in lib/data/portfolio-data.ts. */
export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull().default(0),
});

export type ExperienceRow = typeof experienceTable.$inferSelect;
export type NewExperienceRow = typeof experienceTable.$inferInsert;

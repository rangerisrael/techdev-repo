import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `NavLink[]` (navLinks) in lib/data/portfolio-data.ts. */
export const navLinksTable = pgTable("nav_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  position: integer("position").notNull().default(0),
});

export type NavLinkRow = typeof navLinksTable.$inferSelect;
export type NewNavLinkRow = typeof navLinksTable.$inferInsert;

import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

/** Mirrors `ContactLink[]` (contactLinks) in lib/data/portfolio-data.ts. */
export const contactLinksTable = pgTable("contact_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  position: integer("position").notNull().default(0),
});

export type ContactLinkRow = typeof contactLinksTable.$inferSelect;
export type NewContactLinkRow = typeof contactLinksTable.$inferInsert;

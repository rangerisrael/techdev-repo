import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Singleton table: the app reads the single row with the lowest `id`.
 * Mirrors `SiteConfig` in lib/types/portfolio.ts.
 */
export const siteConfigTable = pgTable("site_config", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  kicker: text("kicker").notNull(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline").notNull(),
  primaryCtaLabel: text("primary_cta_label").notNull(),
  primaryCtaHref: text("primary_cta_href").notNull(),
  secondaryCtaLabel: text("secondary_cta_label").notNull(),
  secondaryCtaHref: text("secondary_cta_href").notNull(),
  footerNote: text("footer_note").notNull(),
  contactNote: text("contact_note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SiteConfigRow = typeof siteConfigTable.$inferSelect;
export type NewSiteConfigRow = typeof siteConfigTable.$inferInsert;

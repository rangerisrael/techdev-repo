import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Visitor-submitted messages from the public contact form. Unlike the
 * other tables (mirrors of the static content in
 * lib/data/portfolio-data.ts), this one has no static counterpart — it's
 * write-only from the public site's perspective and read-only from the
 * admin dashboard's.
 */
export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ContactMessageRow = typeof contactMessagesTable.$inferSelect;
export type NewContactMessageRow = typeof contactMessagesTable.$inferInsert;

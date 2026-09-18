import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { blogPostsTable } from "./blog-posts";

/**
 * Visitor-submitted comments on a blog post. Written by the public post
 * page, read by that same page — no static counterpart and no admin
 * moderation queue (comments show immediately). Deleted along with their
 * post via `onDelete: "cascade"`.
 */
export const blogCommentsTable = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id")
    .notNull()
    .references(() => blogPostsTable.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BlogCommentRow = typeof blogCommentsTable.$inferSelect;
export type NewBlogCommentRow = typeof blogCommentsTable.$inferInsert;

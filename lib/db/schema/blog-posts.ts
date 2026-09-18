import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Blog articles, managed from app/admin/(dashboard)/blog. Mirrors
 * `BlogPost[]` (blogPosts) in lib/data/blog-data.ts, seeded once via
 * `pnpm db:seed` and editable from the admin from then on. `body` holds
 * paragraphs separated by a blank line; the read repository splits it
 * into `BlogPost.body: string[]` for rendering. A paragraph written as
 * `![alt](https://...)` renders as an inline image, and a fenced block
 * (```` ```lang optional-label ```` ... ```` ``` ````) renders as a
 * VSCode-themed, syntax-highlighted code panel — see
 * `lib/blog/content.ts`'s `parseBodyBlock`. `coverImageUrl` is the banner
 * shown at the top of the post; falls back to a decorative pattern when
 * unset.
 *
 * `reactions` is a manually-set baseline that visitors also increment
 * (see `BlogEngagementRepository`); `views` is purely visitor-driven.
 * There's no `comments` column — the real comment count comes from
 * counting `blog_comments` rows for the post.
 */
export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  badge: text("badge"),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  publishedAt: timestamp("published_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  title: text("title").notNull(),
  tags: text("tags").array().notNull().default([]),
  summary: text("summary"),
  coverImageUrl: text("cover_image_url"),
  body: text("body").notNull().default(""),
  reactions: integer("reactions").notNull().default(0),
  views: integer("views").notNull().default(0),
  readTime: text("read_time").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type BlogPostRow = typeof blogPostsTable.$inferSelect;
export type NewBlogPostRow = typeof blogPostsTable.$inferInsert;

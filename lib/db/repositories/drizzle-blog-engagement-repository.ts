import "server-only";

import { asc, eq, sql } from "drizzle-orm";

import type { BlogComment } from "@/lib/types/portfolio";

import { type Database, getDb } from "../client";
import { type BlogCommentRow, blogCommentsTable, blogPostsTable } from "../schema";
import type {
  BlogCommentInput,
  BlogEngagementRepository,
} from "./blog-engagement-repository";

function toBlogComment(row: BlogCommentRow): BlogComment {
  return {
    id: row.id,
    authorName: row.authorName,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  };
}

export class DrizzleBlogEngagementRepository implements BlogEngagementRepository {
  constructor(private readonly db: Database = getDb()) {}

  private async getPostId(slug: string): Promise<number | null> {
    const [row] = await this.db
      .select({ id: blogPostsTable.id })
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    return row?.id ?? null;
  }

  async listComments(slug: string): Promise<BlogComment[]> {
    const postId = await this.getPostId(slug);
    if (postId === null) return [];

    const rows = await this.db
      .select()
      .from(blogCommentsTable)
      .where(eq(blogCommentsTable.blogPostId, postId))
      .orderBy(asc(blogCommentsTable.createdAt));

    return rows.map(toBlogComment);
  }

  async addComment(slug: string, input: BlogCommentInput): Promise<BlogComment> {
    const postId = await this.getPostId(slug);
    if (postId === null) {
      throw new Error(`Blog post "${slug}" not found`);
    }

    const [row] = await this.db
      .insert(blogCommentsTable)
      .values({ blogPostId: postId, authorName: input.authorName, message: input.message })
      .returning();

    return toBlogComment(row);
  }

  async deleteComment(id: number): Promise<void> {
    await this.db.delete(blogCommentsTable).where(eq(blogCommentsTable.id, id));
  }

  async incrementReactions(slug: string): Promise<number> {
    const [row] = await this.db
      .update(blogPostsTable)
      .set({ reactions: sql`${blogPostsTable.reactions} + 1` })
      .where(eq(blogPostsTable.slug, slug))
      .returning({ reactions: blogPostsTable.reactions });

    if (!row) {
      throw new Error(`Blog post "${slug}" not found`);
    }

    return row.reactions;
  }

  async recordView(slug: string): Promise<void> {
    await this.db
      .update(blogPostsTable)
      .set({ views: sql`${blogPostsTable.views} + 1` })
      .where(eq(blogPostsTable.slug, slug));
  }
}

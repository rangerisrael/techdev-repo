import type { BlogComment } from "@/lib/types/portfolio";

export interface BlogCommentInput {
  authorName: string;
  message: string;
}

/**
 * Visitor-driven blog engagement: comments, reactions, and view counts on a
 * published post. Kept as its own repository rather than folded into
 * `PortfolioRepository` or `PortfolioAdminRepository` — same reasoning as
 * `ContactMessageRepository`: a different domain (visitor activity, not
 * authored site content), and same mixed access pattern — public create
 * (comments show immediately, no pre-publish queue) alongside admin-only
 * moderation (`deleteComment`, used from app/admin/(dashboard)/blog to
 * remove spam or unwanted comments after the fact). `listComments` and
 * `addComment` are keyed by slug since that's what the public blog pages
 * have on hand; `deleteComment` is keyed by the comment's own id.
 */
export interface BlogEngagementRepository {
  listComments(slug: string): Promise<BlogComment[]>;
  addComment(slug: string, input: BlogCommentInput): Promise<BlogComment>;
  deleteComment(id: number): Promise<void>;
  incrementReactions(slug: string): Promise<number>;
  recordView(slug: string): Promise<void>;
}

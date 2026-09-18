import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBlogEngagementRepository, getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteBlogComment } from "./actions";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function BlogCommentsAdminPage(
  props: PageProps<"/admin/blog/[id]/comments">
) {
  const { id } = await props.params;
  const post = await getPortfolioAdminRepository().getBlogPost(Number(id));
  if (!post) notFound();

  const comments = await getBlogEngagementRepository().listComments(post.slug);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/blog/${post.id}/edit`}
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← {post.title}
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Comments</h1>
        <p className="text-sm text-muted-foreground">
          {comments.length} comment{comments.length === 1 ? "" : "s"} on this post. Comments
          show on /blog immediately when posted — delete any that are spam or unwanted.
        </p>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium text-foreground">
                    {comment.authorName}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                    {comment.message}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <form action={deleteBlogComment}>
                      <input type="hidden" name="commentId" value={comment.id} />
                      <input type="hidden" name="postId" value={post.id} />
                      <input type="hidden" name="slug" value={post.slug} />
                      <ConfirmSubmitButton
                        type="submit"
                        variant="destructive"
                        size="sm"
                        confirmMessage={`Delete this comment from ${comment.authorName}?`}
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

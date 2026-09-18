import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { BlogBodyField } from "@/components/admin/blog-body-field";
import { BlogCoverImageField, type UploadImageResult } from "@/components/admin/blog-cover-image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPostRow } from "@/lib/db/schema";

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function BlogPostForm({
  post,
  commentCount,
  action,
  deleteAction,
  uploadAction,
}: {
  post?: BlogPostRow;
  commentCount?: number;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
  uploadAction: (formData: FormData) => Promise<UploadImageResult>;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>

      <BlogCoverImageField defaultValue={post?.coverImageUrl} uploadAction={uploadAction} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder={post ? undefined : "auto-generated from title"}
            required={Boolean(post)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">Published</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={toDateInputValue(post?.publishedAt ?? new Date())}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="badge">Badge</Label>
          <Input
            id="badge"
            name="badge"
            defaultValue={post?.badge ?? ""}
            placeholder="Optional eyebrow label"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="authorName">Author</Label>
          <Input
            id="authorName"
            name="authorName"
            defaultValue={post?.authorName ?? "Israel"}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="authorRole">Author role</Label>
          <Input
            id="authorRole"
            name="authorRole"
            defaultValue={post?.authorRole ?? "Full-Stack Developer"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reactions">Reactions</Label>
          <Input
            id="reactions"
            name="reactions"
            type="number"
            defaultValue={post?.reactions ?? 0}
          />
        </div>
        {post ? (
          <div className="space-y-1.5">
            <Label>Views / comments</Label>
            <p className="flex h-8 items-center text-sm text-muted-foreground">
              {post.views} views ·{" "}
              <Link
                href={`/admin/blog/${post.id}/comments`}
                className="text-foreground underline-offset-2 hover:underline"
              >
                {commentCount ?? 0} comments
              </Link>
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={post?.tags.join(", ")}
            placeholder="nodejs, bullmq"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="readTime">Read time</Label>
          <Input
            id="readTime"
            name="readTime"
            defaultValue={post?.readTime}
            placeholder="9 min read"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" defaultValue={post?.summary ?? ""} rows={2} />
      </div>

      <BlogBodyField defaultValue={post?.body} uploadAction={uploadAction} />

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={post ? "Saving…" : "Publishing…"}>
          {post ? "Save changes" : "Publish"}
        </SubmitButton>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {post && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete "${post.title}"? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

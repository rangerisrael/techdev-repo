import Link from "next/link";
import { BlogPostForm } from "@/components/admin/blog-post-form";

import { createBlogPost, uploadBlogImageAction } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Blog
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New blog post</h1>
        <p className="text-sm text-muted-foreground">
          Leave slug blank to generate one from the title.
        </p>
      </div>

      <BlogPostForm action={createBlogPost} uploadAction={uploadBlogImageAction} />
    </div>
  );
}

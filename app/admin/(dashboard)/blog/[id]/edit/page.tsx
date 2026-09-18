import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { getBlogEngagementRepository, getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteBlogPost, updateBlogPost, uploadBlogImageAction } from "../../actions";

export default async function EditBlogPostPage(
  props: PageProps<"/admin/blog/[id]/edit">
) {
  const { id } = await props.params;
  const post = await getPortfolioAdminRepository().getBlogPost(Number(id));
  if (!post) notFound();

  const comments = await getBlogEngagementRepository().listComments(post.slug);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Blog
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit blog post</h1>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>

      <BlogPostForm
        post={post}
        commentCount={comments.length}
        action={updateBlogPost}
        deleteAction={deleteBlogPost}
        uploadAction={uploadBlogImageAction}
      />
    </div>
  );
}

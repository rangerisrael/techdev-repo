import { Eye, Heart, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCommentForm } from "@/components/portfolio/blog-comment-form";
import { BlogCommentList } from "@/components/portfolio/blog-comment-list";
import { BlogMorePosts } from "@/components/portfolio/blog-more-posts";
import { BlogPostCover } from "@/components/portfolio/blog-post-cover";
import { BlogReactionButton } from "@/components/portfolio/blog-reaction-button";
import { BlogReactionRow } from "@/components/portfolio/blog-reaction-row";
import { CodeBlock } from "@/components/portfolio/code-block";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteNav } from "@/components/portfolio/site-nav";
import { parseBodyBlock } from "@/lib/blog/content";
import { getBlogEngagementRepository, getPortfolioRepository } from "@/lib/db/repositories";

export async function generateStaticParams() {
  const posts = await getPortfolioRepository().getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPortfolioRepository().getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Blog`,
    description: post.summary ?? post.title,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const repo = getPortfolioRepository();
  const post = await repo.getBlogPost(slug);
  if (!post) notFound();

  const isLive = post.id !== undefined;
  const engagement = isLive ? getBlogEngagementRepository() : null;

  const [siteConfig, navLinks, allPosts, comments] = await Promise.all([
    repo.getSiteConfig(),
    repo.getNavLinks(),
    repo.getBlogPosts(),
    engagement?.listComments(slug) ?? Promise.resolve([]),
  ]);

  if (engagement) {
    try {
      await engagement.recordView(slug);
    } catch (error) {
      console.error(
        "[blog] failed to record view:",
        error instanceof Error ? error.message : error
      );
    }
  }

  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav brand={siteConfig.brand} links={navLinks} />
      <div className="mx-auto w-full max-w-[1040px] px-6 py-14 sm:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-block font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Blog
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <article>
            <BlogPostCover label={post.tags[0] ?? "blog"} imageUrl={post.coverImageUrl} />

            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt={post.author.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="font-mono text-xs">
                <div className="text-foreground">{post.author.name}</div>
                <div className="text-muted-foreground">
                  {post.author.role ? `${post.author.role} · ` : ""}Posted on {post.date}
                </div>
              </div>
            </div>

            {post.reactionBreakdown ? (
              <BlogReactionRow reactions={post.reactionBreakdown} />
            ) : null}

            <h1 className="mb-4 font-serif text-3xl font-medium sm:text-4xl">{post.title}</h1>

            <div className="mb-6 flex flex-wrap gap-2 font-mono text-sm text-amber">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="hover:underline">
                  #{tag}
                </Link>
              ))}
            </div>

            {post.summary ? (
              <p className="mb-8 rounded-lg border border-line bg-surface-2 px-4 py-3 text-muted-foreground">
                {post.summary}
              </p>
            ) : null}

            <div className="prose-content flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/90">
              {post.body?.map((paragraph, index) => {
                const block = parseBodyBlock(paragraph);
                if (block.type === "code") {
                  return (
                    <CodeBlock
                      key={index}
                      language={block.language}
                      label={block.label}
                      code={block.code}
                    />
                  );
                }
                if (block.type === "image") {
                  return (
                    // eslint-disable-next-line @next/next/no-img-element -- author-entered URL, arbitrary host
                    <img
                      key={index}
                      src={block.src}
                      alt={block.alt}
                      className="rounded-lg border border-line"
                    />
                  );
                }
                return <p key={index}>{block.text}</p>;
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6 font-mono text-xs text-muted-foreground">
              {isLive ? (
                <BlogReactionButton slug={post.slug} initialReactions={post.reactions} />
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="size-3.5" aria-hidden />
                  {post.reactions} reactions
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="size-3.5" aria-hidden />
                {post.comments} comments
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-3.5" aria-hidden />
                {post.views} views
              </span>
              <span>{post.readTime}</span>
            </div>

            {isLive ? (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="mb-4 font-serif text-xl font-medium">
                  Comments {comments.length > 0 ? `(${comments.length})` : ""}
                </h2>
                <div className="mb-6">
                  <BlogCommentList comments={comments} />
                </div>
                <BlogCommentForm slug={post.slug} />
              </div>
            ) : null}
          </article>

          <aside className="hidden lg:block">
            <BlogMorePosts posts={morePosts} author={post.author.name} />
          </aside>
        </div>

        <SiteFooter note={siteConfig.footerNote} />
      </div>
    </div>
  );
}

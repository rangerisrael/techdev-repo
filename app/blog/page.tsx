import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostCard } from "@/components/portfolio/blog-post-card";
import { BlogTagsSidebar } from "@/components/portfolio/blog-tags-sidebar";
import { BlogTrendingSidebar } from "@/components/portfolio/blog-trending-sidebar";
import { FadeIn } from "@/components/portfolio/fade-in";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteNav } from "@/components/portfolio/site-nav";
import { deriveTagCloud, deriveTopDiscussions } from "@/lib/blog/content";
import { trendingResources } from "@/lib/data/blog-data";
import { getPortfolioRepository } from "@/lib/db/repositories";

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata(props: PageProps<"/blog">): Promise<Metadata> {
  const requestedTag = firstValue((await props.searchParams).tag);
  const posts = await getPortfolioRepository().getBlogPosts();
  const isRealTag = requestedTag && posts.some((post) => post.tags.includes(requestedTag));

  return {
    title: isRealTag ? `#${requestedTag} — Blog — Israel` : "Blog — Israel",
    description: "Notes on backend systems, infrastructure, and the bugs that taught me the most.",
  };
}

export default async function BlogPage(props: PageProps<"/blog">) {
  const requestedTag = firstValue((await props.searchParams).tag);

  const repo = getPortfolioRepository();
  const [siteConfig, navLinks, allPosts] = await Promise.all([
    repo.getSiteConfig(),
    repo.getNavLinks(),
    repo.getBlogPosts(),
  ]);
  const popularTags = deriveTagCloud(allPosts);
  const activeDiscussions = deriveTopDiscussions(allPosts);

  // A ?tag= that isn't actually used by any post (stale link, typo, a tag
  // that got removed from every post it was on) isn't a real filter — treat
  // it the same as no filter at all rather than showing zero results.
  const activeTag = popularTags.some(({ tag }) => tag === requestedTag) ? requestedTag : undefined;
  const posts = activeTag ? allPosts.filter((post) => post.tags.includes(activeTag)) : allPosts;

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav brand={siteConfig.brand} links={navLinks} />
      <div className="mx-auto w-full max-w-[1240px] px-6 py-14 sm:px-8">
        <FadeIn className="mb-10">
          <span className="mb-2 block font-mono text-sm text-primary/70">{"// writing"}</span>
          <h1 className="mb-3 font-serif text-3xl font-medium sm:text-4xl">Blog</h1>
          {activeTag ? (
            <p className="text-muted-foreground">
              Showing posts tagged{" "}
              <span className="font-mono text-amber">#{activeTag}</span> —{" "}
              <Link href="/blog" className="text-primary hover:underline">
                clear filter
              </Link>
            </p>
          ) : (
            <p className="max-w-[60ch] text-muted-foreground">
              Notes on backend systems, infrastructure, and the production bugs that taught me
              the most.
            </p>
          )}
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr_280px]">
          <aside className="hidden lg:block">
            <BlogTagsSidebar tags={popularTags} activeTag={activeTag} />
          </aside>

          <main>
            {posts.length === 0 ? (
              <div className="rounded-lg border border-line bg-card px-5 py-10 text-center text-sm text-muted-foreground">
                No posts yet.
              </div>
            ) : (
              <div className="rounded-lg border border-line bg-card px-5">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </main>

          <aside className="hidden lg:block">
            <BlogTrendingSidebar discussions={activeDiscussions} resources={trendingResources} />
          </aside>
        </div>

        <SiteFooter note={siteConfig.footerNote} />
      </div>
    </div>
  );
}

import { describe, expect, it, vi } from "vitest";

// FallbackPortfolioRepository (and the PortfolioRepository it wraps) carry
// the `server-only` marker, which throws unconditionally outside of
// Next.js's server compilation graph. Stub it so the module can be
// imported under vitest, same as Next.js does for server bundles.
vi.mock("server-only", () => ({}));

import { blogPosts } from "@/lib/data/blog-data";
import {
  contactLinks,
  contactNote,
  experience,
  navLinks,
  projects,
  siteConfig,
  stackLayers,
  statusItems,
} from "@/lib/data/portfolio-data";

import { FallbackPortfolioRepository } from "../fallback-portfolio-repository";
import type { PortfolioRepository } from "../portfolio-repository";

const dbBlogPost = {
  id: 1,
  slug: "from-db-post",
  author: { name: "from-db" },
  date: "Jan 1",
  title: "from-db",
  tags: [],
  reactions: 0,
  comments: 0,
  views: 0,
  readTime: "1 min read",
};

function workingRepository(): PortfolioRepository {
  return {
    getSiteConfig: async () => ({ ...siteConfig, brand: "from-db" }),
    getContactNote: async () => "from-db",
    getNavLinks: async () => [{ label: "from-db", href: "#" }],
    getStatusItems: async () => [{ label: "from-db", value: "x" }],
    getStackLayers: async () => [
      { layer: "from-db", title: "x", tags: [] },
    ],
    getProjects: async () => [
      { year: "x", category: "x", title: "from-db", description: "x", tags: [] },
    ],
    getExperience: async () => [
      { date: "x", role: "from-db", description: "x" },
    ],
    getContactLinks: async () => [{ label: "from-db", href: "#" }],
    getBlogPosts: async () => [dbBlogPost],
    getBlogPost: async (slug) => (slug === dbBlogPost.slug ? dbBlogPost : null),
  };
}

function throwingRepository(): PortfolioRepository {
  const fail = async () => {
    throw new Error("query failed");
  };
  return {
    getSiteConfig: fail,
    getContactNote: fail,
    getNavLinks: fail,
    getStatusItems: fail,
    getStackLayers: fail,
    getProjects: fail,
    getExperience: fail,
    getContactLinks: fail,
    getBlogPosts: fail,
    getBlogPost: fail,
  };
}

describe("FallbackPortfolioRepository", () => {
  it("delegates to the primary repository when it succeeds", async () => {
    const repo = new FallbackPortfolioRepository(workingRepository);

    expect((await repo.getSiteConfig()).brand).toBe("from-db");
    expect(await repo.getContactNote()).toBe("from-db");
    expect(await repo.getBlogPosts()).toEqual([dbBlogPost]);
    expect(await repo.getBlogPost(dbBlogPost.slug)).toEqual(dbBlogPost);
  });

  it("falls back to static data when every query fails", async () => {
    const repo = new FallbackPortfolioRepository(throwingRepository);

    expect(await repo.getSiteConfig()).toEqual(siteConfig);
    expect(await repo.getContactNote()).toBe(contactNote);
    expect(await repo.getNavLinks()).toEqual(navLinks);
    expect(await repo.getStatusItems()).toEqual(statusItems);
    expect(await repo.getStackLayers()).toEqual(stackLayers);
    expect(await repo.getProjects()).toEqual(projects);
    expect(await repo.getExperience()).toEqual(experience);
    expect(await repo.getContactLinks()).toEqual(contactLinks);
    expect(await repo.getBlogPosts()).toEqual(blogPosts);
    expect(await repo.getBlogPost(blogPosts[0].slug)).toEqual(blogPosts[0]);
  });

  it("falls back to a static post when the DB doesn't have that slug", async () => {
    const repo = new FallbackPortfolioRepository(workingRepository);

    expect(await repo.getBlogPost(blogPosts[0].slug)).toEqual(blogPosts[0]);
  });

  it("returns null when a slug exists in neither the DB nor static data", async () => {
    const repo = new FallbackPortfolioRepository(workingRepository);

    expect(await repo.getBlogPost("does-not-exist")).toBeNull();
  });

  it("falls back to static data when the primary repository can't be constructed", async () => {
    const repo = new FallbackPortfolioRepository(() => {
      throw new Error("DATABASE_URL is not set");
    });

    expect(await repo.getSiteConfig()).toEqual(siteConfig);
    expect(await repo.getProjects()).toEqual(projects);
  });

  it("falls back to static data when a list table is empty (unmigrated/unseeded)", async () => {
    const repo = new FallbackPortfolioRepository(() => ({
      ...workingRepository(),
      getProjects: async () => [],
    }));

    expect(await repo.getProjects()).toEqual(projects);
  });
});

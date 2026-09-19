import "server-only";

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
import type {
  BlogPost,
  ContactLink,
  ExperienceItem,
  NavLink,
  Project,
  SiteConfig,
  StackLayer,
  StatusItem,
} from "@/lib/types/portfolio";

import { DrizzlePortfolioRepository } from "./drizzle-portfolio-repository";
import type { PortfolioRepository } from "./portfolio-repository";

/**
 * Decorates another `PortfolioRepository` (Drizzle, by default) with a
 * fallback to the static content in lib/data/portfolio-data.ts. Keeps the
 * site rendering when `DATABASE_URL` is unset or Supabase is unreachable,
 * without callers ever knowing a database is involved (Liskov Substitution:
 * this is a drop-in `PortfolioRepository`, same as the concrete Drizzle
 * one). The wrapped repository is injected so tests can supply a fake that
 * throws on demand instead of needing a real failing connection.
 */
export class FallbackPortfolioRepository implements PortfolioRepository {
  private primary: PortfolioRepository | null | undefined;

  constructor(
    private readonly primaryFactory: () => PortfolioRepository = () =>
      new DrizzlePortfolioRepository()
  ) {}

  /**
   * Constructing `DrizzlePortfolioRepository` opens/reads env eagerly (it
   * throws immediately if `DATABASE_URL` is missing), so that failure is
   * caught and cached here once rather than re-attempted on every getter.
   */
  private getPrimary(): PortfolioRepository | null {
    if (this.primary === undefined) {
      try {
        this.primary = this.primaryFactory();
      } catch (error) {
        warn("database unavailable, using static fallback data", error);
        this.primary = null;
      }
    }
    return this.primary;
  }

  private async withFallback<T>(
    source: string,
    read: (repo: PortfolioRepository) => Promise<T>,
    fallback: T
  ): Promise<T> {
    const repo = this.getPrimary();
    if (!repo) return fallback;

    try {
      const result = await readWithRetry(() => read(repo));
      // An unmigrated/unseeded list table returns `[]` rather than
      // throwing, which would otherwise render as an empty section instead
      // of falling back — treat it the same as a failed query.
      if (Array.isArray(result) && result.length === 0) {
        warn(`${source} table is empty, using static fallback`, "no rows");
        return fallback;
      }
      return result;
    } catch (error) {
      warn(`query failed for ${source}, using static fallback`, error);
      return fallback;
    }
  }

  getSiteConfig(): Promise<SiteConfig> {
    return this.withFallback(
      "site config",
      (repo) => repo.getSiteConfig(),
      siteConfig
    );
  }

  getContactNote(): Promise<string> {
    return this.withFallback(
      "contact note",
      (repo) => repo.getContactNote(),
      contactNote
    );
  }

  getNavLinks(): Promise<NavLink[]> {
    return this.withFallback(
      "nav links",
      (repo) => repo.getNavLinks(),
      navLinks
    );
  }

  getStatusItems(): Promise<StatusItem[]> {
    return this.withFallback(
      "status items",
      (repo) => repo.getStatusItems(),
      statusItems
    );
  }

  getStackLayers(): Promise<StackLayer[]> {
    return this.withFallback(
      "stack layers",
      (repo) => repo.getStackLayers(),
      stackLayers
    );
  }

  getProjects(): Promise<Project[]> {
    return this.withFallback(
      "projects",
      (repo) => repo.getProjects(),
      projects
    );
  }

  getExperience(): Promise<ExperienceItem[]> {
    return this.withFallback(
      "experience",
      (repo) => repo.getExperience(),
      experience
    );
  }

  getContactLinks(): Promise<ContactLink[]> {
    return this.withFallback(
      "contact links",
      (repo) => repo.getContactLinks(),
      contactLinks
    );
  }

  getBlogPosts(): Promise<BlogPost[]> {
    return this.withFallback(
      "blog posts",
      (repo) => repo.getBlogPosts(),
      blogPosts
    );
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    const repo = this.getPrimary();
    if (repo) {
      try {
        const post = await readWithRetry(() => repo.getBlogPost(slug));
        if (post) return post;
      } catch (error) {
        warn(`query failed for blog post "${slug}", using static fallback`, error);
      }
    }
    return blogPosts.find((post) => post.slug === slug) ?? null;
  }
}

const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 100;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A single connection blip (pool briefly exhausted, transient network hiccup)
 * shouldn't be indistinguishable from "the database is actually down" — the
 * former recovers on the very next attempt, but `withFallback` can't tell
 * them apart from one failed call. That distinction matters most on
 * statically-rendered pages (the homepage, `/blog`): when an admin write
 * triggers `revalidatePath`, whatever this returns during that one
 * regeneration gets baked into the page cache until the next revalidation.
 * A retry here is what keeps a passing transient error from freezing the
 * static page on fallback content indefinitely.
 */
async function readWithRetry<T>(read: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      return await read();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS) {
        await delay(RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw lastError;
}

/**
 * `error.message` alone hides exactly the detail that distinguishes "DB
 * briefly unreachable" (timeout, connection refused, pool exhausted) from
 * "query is actually broken" (syntax/schema error) — the two cases this
 * fallback conflates into the same static-content response. postgres.js
 * surfaces that detail as `code`/`errno` (network errors) or a Postgres
 * error code (query errors), neither of which is on `Error.message`.
 */
function warn(message: string, error: unknown): void {
  const detail =
    error instanceof Error
      ? [
          error.message,
          "code" in error ? `code=${(error as { code?: unknown }).code}` : null,
          "errno" in error ? `errno=${(error as { errno?: unknown }).errno}` : null,
        ]
          .filter(Boolean)
          .join(" | ")
      : String(error);

  console.warn(`[portfolio-repository] ${message}: ${detail}`);
}

import "server-only";

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
      const result = await read(repo);
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
}

function warn(message: string, error: unknown): void {
  console.warn(
    `[portfolio-repository] ${message}:`,
    error instanceof Error ? error.message : error
  );
}

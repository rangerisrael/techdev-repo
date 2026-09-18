import "server-only";

import { asc, count, desc, eq, inArray } from "drizzle-orm";

import { formatPostDate, splitParagraphs } from "@/lib/blog/content";
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

import { type Database, getDb } from "../client";
import {
  type BlogPostRow,
  blogCommentsTable,
  blogPostsTable,
  contactLinksTable,
  experienceTable,
  navLinksTable,
  projectsTable,
  siteConfigTable,
  stackLayersTable,
  statusItemsTable,
} from "../schema";
import type { PortfolioRepository } from "./portfolio-repository";

function toBlogPost(row: BlogPostRow, commentCount: number): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    badge: row.badge ?? undefined,
    author: { name: row.authorName, role: row.authorRole ?? undefined },
    date: formatPostDate(row.publishedAt),
    title: row.title,
    tags: row.tags,
    reactions: row.reactions,
    comments: commentCount,
    views: row.views,
    readTime: row.readTime,
    summary: row.summary ?? undefined,
    coverImageUrl: row.coverImageUrl ?? undefined,
    body: splitParagraphs(row.body),
  };
}

/**
 * Concrete, swappable implementation of `PortfolioRepository` (Open/Closed
 * + Liskov Substitution: alternative sources — e.g. a cached or REST-backed
 * repository — can implement the same interface without touching callers).
 * The Drizzle `Database` handle is injected so tests can pass a fake
 * instead of hitting a real connection.
 */
export class DrizzlePortfolioRepository implements PortfolioRepository {
  constructor(private readonly db: Database = getDb()) {}

  async getSiteConfig(): Promise<SiteConfig> {
    const [row] = await this.db
      .select()
      .from(siteConfigTable)
      .orderBy(asc(siteConfigTable.id))
      .limit(1);

    if (!row) {
      throw new Error("site_config table has no rows");
    }

    return {
      brand: row.brand,
      kicker: row.kicker,
      headline: row.headline,
      subheadline: row.subheadline,
      primaryCta: { label: row.primaryCtaLabel, href: row.primaryCtaHref },
      secondaryCta: {
        label: row.secondaryCtaLabel,
        href: row.secondaryCtaHref,
      },
      footerNote: row.footerNote,
    };
  }

  async getContactNote(): Promise<string> {
    const [row] = await this.db
      .select({ contactNote: siteConfigTable.contactNote })
      .from(siteConfigTable)
      .orderBy(asc(siteConfigTable.id))
      .limit(1);

    if (!row) {
      throw new Error("site_config table has no rows");
    }

    return row.contactNote;
  }

  async getNavLinks(): Promise<NavLink[]> {
    const rows = await this.db
      .select()
      .from(navLinksTable)
      .orderBy(asc(navLinksTable.position));

    return rows.map((row) => ({ label: row.label, href: row.href }));
  }

  async getStatusItems(): Promise<StatusItem[]> {
    const rows = await this.db
      .select()
      .from(statusItemsTable)
      .orderBy(asc(statusItemsTable.position));

    return rows.map((row) => ({ label: row.label, value: row.value }));
  }

  async getStackLayers(): Promise<StackLayer[]> {
    const rows = await this.db
      .select()
      .from(stackLayersTable)
      .orderBy(asc(stackLayersTable.position));

    return rows.map((row) => ({
      layer: row.layer,
      title: row.title,
      tags: row.tags,
      wide: row.wide,
    }));
  }

  async getProjects(): Promise<Project[]> {
    const rows = await this.db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.position));

    return rows.map((row) => ({
      year: row.year,
      category: row.category,
      title: row.title,
      description: row.description,
      tags: row.tags,
    }));
  }

  async getExperience(): Promise<ExperienceItem[]> {
    const rows = await this.db
      .select()
      .from(experienceTable)
      .orderBy(asc(experienceTable.position));

    return rows.map((row) => ({
      date: row.date,
      role: row.role,
      description: row.description,
    }));
  }

  async getContactLinks(): Promise<ContactLink[]> {
    const rows = await this.db
      .select()
      .from(contactLinksTable)
      .orderBy(asc(contactLinksTable.position));

    return rows.map((row) => ({ label: row.label, href: row.href }));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const rows = await this.db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.publishedAt));

    if (rows.length === 0) return [];

    const counts = await this.db
      .select({ blogPostId: blogCommentsTable.blogPostId, count: count() })
      .from(blogCommentsTable)
      .where(inArray(blogCommentsTable.blogPostId, rows.map((row) => row.id)))
      .groupBy(blogCommentsTable.blogPostId);
    const countByPostId = new Map(counts.map((c) => [c.blogPostId, c.count]));

    return rows.map((row) => toBlogPost(row, countByPostId.get(row.id) ?? 0));
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    const [row] = await this.db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    if (!row) return null;

    const [commentRow] = await this.db
      .select({ count: count() })
      .from(blogCommentsTable)
      .where(eq(blogCommentsTable.blogPostId, row.id));

    return toBlogPost(row, commentRow?.count ?? 0);
  }
}

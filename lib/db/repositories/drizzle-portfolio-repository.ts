import "server-only";

import { asc } from "drizzle-orm";

import type {
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
  contactLinksTable,
  experienceTable,
  navLinksTable,
  projectsTable,
  siteConfigTable,
  stackLayersTable,
  statusItemsTable,
} from "../schema";
import type { PortfolioRepository } from "./portfolio-repository";

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
}

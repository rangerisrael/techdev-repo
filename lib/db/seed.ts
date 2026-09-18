import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

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

import { createDbClient } from "./client";
import {
  blogPostsTable,
  contactLinksTable,
  experienceTable,
  navLinksTable,
  projectsTable,
  siteConfigTable,
  stackLayersTable,
  statusItemsTable,
} from "./schema";

/**
 * The static blog posts only carry a display string ("Sep 16"), not a
 * real date — this fills in the `published_at` timestamp each one seeds
 * with, keyed by slug.
 */
const blogPublishedAt: Record<string, string> = {
  "queues-outlive-the-request": "2026-09-16",
  "connection-pooling-diagrammed": "2026-09-12",
  "marketplace-race-conditions": "2026-09-08",
  "ci-cd-without-the-yaml-maze": "2026-09-02",
};

/**
 * One-time/idempotent seed: copies the static content from
 * lib/data/portfolio-data.ts into each table, but only for tables that are
 * still empty. Safe to re-run — it never overwrites rows that already
 * exist, so editing content in Supabase directly won't be clobbered by a
 * later `pnpm db:seed`. See docs/database.md for the schema this fills.
 */
async function seed(): Promise<void> {
  const { client, db } = createDbClient();

  try {
    const existingSiteConfig = await db
      .select({ id: siteConfigTable.id })
      .from(siteConfigTable)
      .limit(1);
    if (existingSiteConfig.length === 0) {
      await db.insert(siteConfigTable).values({
        brand: siteConfig.brand,
        kicker: siteConfig.kicker,
        headline: siteConfig.headline,
        subheadline: siteConfig.subheadline,
        primaryCtaLabel: siteConfig.primaryCta.label,
        primaryCtaHref: siteConfig.primaryCta.href,
        secondaryCtaLabel: siteConfig.secondaryCta.label,
        secondaryCtaHref: siteConfig.secondaryCta.href,
        footerNote: siteConfig.footerNote,
        contactNote,
      });
      console.log("Seeded site_config");
    } else {
      console.log("Skipped site_config (already has rows)");
    }

    const existingNavLinks = await db
      .select({ id: navLinksTable.id })
      .from(navLinksTable)
      .limit(1);
    if (existingNavLinks.length === 0) {
      await db.insert(navLinksTable).values(
        navLinks.map((link, position) => ({ ...link, position }))
      );
      console.log(`Seeded nav_links (${navLinks.length} rows)`);
    } else {
      console.log("Skipped nav_links (already has rows)");
    }

    const existingStatusItems = await db
      .select({ id: statusItemsTable.id })
      .from(statusItemsTable)
      .limit(1);
    if (existingStatusItems.length === 0) {
      await db.insert(statusItemsTable).values(
        statusItems.map((item, position) => ({ ...item, position }))
      );
      console.log(`Seeded status_items (${statusItems.length} rows)`);
    } else {
      console.log("Skipped status_items (already has rows)");
    }

    const existingStackLayers = await db
      .select({ id: stackLayersTable.id })
      .from(stackLayersTable)
      .limit(1);
    if (existingStackLayers.length === 0) {
      await db.insert(stackLayersTable).values(
        stackLayers.map((layer, position) => ({
          layer: layer.layer,
          title: layer.title,
          tags: layer.tags,
          wide: layer.wide ?? false,
          position,
        }))
      );
      console.log(`Seeded stack_layers (${stackLayers.length} rows)`);
    } else {
      console.log("Skipped stack_layers (already has rows)");
    }

    const existingProjects = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .limit(1);
    if (existingProjects.length === 0) {
      await db.insert(projectsTable).values(
        projects.map((project, position) => ({ ...project, position }))
      );
      console.log(`Seeded projects (${projects.length} rows)`);
    } else {
      console.log("Skipped projects (already has rows)");
    }

    const existingExperience = await db
      .select({ id: experienceTable.id })
      .from(experienceTable)
      .limit(1);
    if (existingExperience.length === 0) {
      await db.insert(experienceTable).values(
        experience.map((item, position) => ({ ...item, position }))
      );
      console.log(`Seeded experience (${experience.length} rows)`);
    } else {
      console.log("Skipped experience (already has rows)");
    }

    const existingContactLinks = await db
      .select({ id: contactLinksTable.id })
      .from(contactLinksTable)
      .limit(1);
    if (existingContactLinks.length === 0) {
      await db.insert(contactLinksTable).values(
        contactLinks.map((link, position) => ({ ...link, position }))
      );
      console.log(`Seeded contact_links (${contactLinks.length} rows)`);
    } else {
      console.log("Skipped contact_links (already has rows)");
    }

    const existingBlogPosts = await db
      .select({ id: blogPostsTable.id })
      .from(blogPostsTable)
      .limit(1);
    if (existingBlogPosts.length === 0) {
      await db.insert(blogPostsTable).values(
        blogPosts.map((post) => ({
          slug: post.slug,
          badge: post.badge ?? null,
          authorName: post.author.name,
          authorRole: post.author.role ?? null,
          publishedAt: new Date(blogPublishedAt[post.slug] ?? Date.now()),
          title: post.title,
          tags: post.tags,
          summary: post.summary ?? null,
          body: (post.body ?? []).join("\n\n"),
          reactions: post.reactions,
          views: post.views,
          readTime: post.readTime,
        }))
      );
      console.log(`Seeded blog_posts (${blogPosts.length} rows)`);
    } else {
      console.log("Skipped blog_posts (already has rows)");
    }
  } finally {
    await client.end();
  }
}

seed()
  .then(() => {
    console.log("Seed complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });

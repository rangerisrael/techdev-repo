import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { type Database, getDb } from "../client";
import {
  blogPostsTable,
  contactLinksTable,
  experienceTable,
  navLinksTable,
  projectsTable,
  siteConfigTable,
  stackLayersTable,
  statusItemsTable,
} from "../schema";
import type {
  BlogPostInput,
  ContactLinkInput,
  ExperienceInput,
  NavLinkInput,
  PortfolioAdminRepository,
  ProjectInput,
  SiteConfigInput,
  StackLayerInput,
  StatusItemInput,
} from "./portfolio-admin-repository";

/**
 * Concrete Drizzle implementation of `PortfolioAdminRepository`, backing
 * app/admin/**. Mirrors the structure of `DrizzlePortfolioRepository`: the
 * `Database` handle is injected (defaulting to the shared singleton) so
 * tests can pass a fake instead of hitting a real connection.
 */
export class DrizzlePortfolioAdminRepository
  implements PortfolioAdminRepository
{
  constructor(private readonly db: Database = getDb()) {}

  async getSiteConfig() {
    const [row] = await this.db
      .select()
      .from(siteConfigTable)
      .orderBy(asc(siteConfigTable.id))
      .limit(1);
    return row ?? null;
  }

  async upsertSiteConfig(input: SiteConfigInput): Promise<void> {
    const existing = await this.getSiteConfig();
    if (existing) {
      await this.db
        .update(siteConfigTable)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(siteConfigTable.id, existing.id));
    } else {
      await this.db.insert(siteConfigTable).values(input);
    }
  }

  async listNavLinks() {
    return this.db
      .select()
      .from(navLinksTable)
      .orderBy(asc(navLinksTable.position));
  }

  async getNavLink(id: number) {
    const [row] = await this.db
      .select()
      .from(navLinksTable)
      .where(eq(navLinksTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createNavLink(input: NavLinkInput) {
    const [row] = await this.db
      .insert(navLinksTable)
      .values(input)
      .returning();
    return row;
  }

  async updateNavLink(id: number, input: NavLinkInput): Promise<void> {
    await this.db
      .update(navLinksTable)
      .set(input)
      .where(eq(navLinksTable.id, id));
  }

  async deleteNavLink(id: number): Promise<void> {
    await this.db.delete(navLinksTable).where(eq(navLinksTable.id, id));
  }

  async listStatusItems() {
    return this.db
      .select()
      .from(statusItemsTable)
      .orderBy(asc(statusItemsTable.position));
  }

  async getStatusItem(id: number) {
    const [row] = await this.db
      .select()
      .from(statusItemsTable)
      .where(eq(statusItemsTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createStatusItem(input: StatusItemInput) {
    const [row] = await this.db
      .insert(statusItemsTable)
      .values(input)
      .returning();
    return row;
  }

  async updateStatusItem(id: number, input: StatusItemInput): Promise<void> {
    await this.db
      .update(statusItemsTable)
      .set(input)
      .where(eq(statusItemsTable.id, id));
  }

  async deleteStatusItem(id: number): Promise<void> {
    await this.db.delete(statusItemsTable).where(eq(statusItemsTable.id, id));
  }

  async listStackLayers() {
    return this.db
      .select()
      .from(stackLayersTable)
      .orderBy(asc(stackLayersTable.position));
  }

  async getStackLayer(id: number) {
    const [row] = await this.db
      .select()
      .from(stackLayersTable)
      .where(eq(stackLayersTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createStackLayer(input: StackLayerInput) {
    const [row] = await this.db
      .insert(stackLayersTable)
      .values(input)
      .returning();
    return row;
  }

  async updateStackLayer(id: number, input: StackLayerInput): Promise<void> {
    await this.db
      .update(stackLayersTable)
      .set(input)
      .where(eq(stackLayersTable.id, id));
  }

  async deleteStackLayer(id: number): Promise<void> {
    await this.db.delete(stackLayersTable).where(eq(stackLayersTable.id, id));
  }

  async listProjects() {
    return this.db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.position));
  }

  async getProject(id: number) {
    const [row] = await this.db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createProject(input: ProjectInput) {
    const [row] = await this.db
      .insert(projectsTable)
      .values(input)
      .returning();
    return row;
  }

  async updateProject(id: number, input: ProjectInput): Promise<void> {
    await this.db
      .update(projectsTable)
      .set(input)
      .where(eq(projectsTable.id, id));
  }

  async deleteProject(id: number): Promise<void> {
    await this.db.delete(projectsTable).where(eq(projectsTable.id, id));
  }

  async listExperience() {
    return this.db
      .select()
      .from(experienceTable)
      .orderBy(asc(experienceTable.position));
  }

  async getExperience(id: number) {
    const [row] = await this.db
      .select()
      .from(experienceTable)
      .where(eq(experienceTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createExperience(input: ExperienceInput) {
    const [row] = await this.db
      .insert(experienceTable)
      .values(input)
      .returning();
    return row;
  }

  async updateExperience(id: number, input: ExperienceInput): Promise<void> {
    await this.db
      .update(experienceTable)
      .set(input)
      .where(eq(experienceTable.id, id));
  }

  async deleteExperience(id: number): Promise<void> {
    await this.db.delete(experienceTable).where(eq(experienceTable.id, id));
  }

  async listContactLinks() {
    return this.db
      .select()
      .from(contactLinksTable)
      .orderBy(asc(contactLinksTable.position));
  }

  async getContactLink(id: number) {
    const [row] = await this.db
      .select()
      .from(contactLinksTable)
      .where(eq(contactLinksTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createContactLink(input: ContactLinkInput) {
    const [row] = await this.db
      .insert(contactLinksTable)
      .values(input)
      .returning();
    return row;
  }

  async updateContactLink(id: number, input: ContactLinkInput): Promise<void> {
    await this.db
      .update(contactLinksTable)
      .set(input)
      .where(eq(contactLinksTable.id, id));
  }

  async deleteContactLink(id: number): Promise<void> {
    await this.db
      .delete(contactLinksTable)
      .where(eq(contactLinksTable.id, id));
  }

  async listBlogPosts() {
    return this.db
      .select()
      .from(blogPostsTable)
      .orderBy(desc(blogPostsTable.publishedAt));
  }

  async getBlogPost(id: number) {
    const [row] = await this.db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.id, id))
      .limit(1);
    return row ?? null;
  }

  async createBlogPost(input: BlogPostInput) {
    const [row] = await this.db
      .insert(blogPostsTable)
      .values(input)
      .returning();
    return row;
  }

  async updateBlogPost(id: number, input: BlogPostInput): Promise<void> {
    await this.db
      .update(blogPostsTable)
      .set(input)
      .where(eq(blogPostsTable.id, id));
  }

  async deleteBlogPost(id: number): Promise<void> {
    await this.db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  }
}

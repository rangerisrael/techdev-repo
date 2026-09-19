import type {
  BlogPostRow,
  ContactLinkRow,
  ExperienceRow,
  NavLinkRow,
  NewBlogPostRow,
  NewContactLinkRow,
  NewExperienceRow,
  NewNavLinkRow,
  NewProjectRow,
  NewSiteConfigRow,
  NewStackLayerRow,
  NewStatusItemRow,
  ProjectRow,
  SiteConfigRow,
  StackLayerRow,
  StatusItemRow,
} from "@/lib/db/schema";

export type SiteConfigInput = Omit<
  NewSiteConfigRow,
  "id" | "createdAt" | "updatedAt"
>;
export type NavLinkInput = Omit<NewNavLinkRow, "id">;
export type StatusItemInput = Omit<NewStatusItemRow, "id">;
export type StackLayerInput = Omit<NewStackLayerRow, "id">;
export type ProjectInput = Omit<NewProjectRow, "id">;
export type ExperienceInput = Omit<NewExperienceRow, "id">;
export type ContactLinkInput = Omit<NewContactLinkRow, "id">;
export type BlogPostInput = Omit<NewBlogPostRow, "id" | "createdAt" | "views">;

/**
 * Write-side counterpart to `PortfolioRepository`. Kept as a separate
 * interface (Interface Segregation) so the read-only repository that
 * app/page.tsx depends on never grows mutation methods it has no use for —
 * only app/admin/** depends on this one. Unlike the read side, this has no
 * fallback decorator: the admin dashboard edits the database directly, so
 * a failure here should surface as an error, not silently no-op against
 * static data that can't be persisted back to.
 */
export interface PortfolioAdminRepository {
  getSiteConfig(): Promise<SiteConfigRow | null>;
  upsertSiteConfig(input: SiteConfigInput): Promise<void>;

  listNavLinks(): Promise<NavLinkRow[]>;
  getNavLink(id: number): Promise<NavLinkRow | null>;
  createNavLink(input: NavLinkInput): Promise<NavLinkRow>;
  updateNavLink(id: number, input: NavLinkInput): Promise<void>;
  deleteNavLink(id: number): Promise<void>;

  listStatusItems(): Promise<StatusItemRow[]>;
  getStatusItem(id: number): Promise<StatusItemRow | null>;
  createStatusItem(input: StatusItemInput): Promise<StatusItemRow>;
  updateStatusItem(id: number, input: StatusItemInput): Promise<void>;
  deleteStatusItem(id: number): Promise<void>;

  listStackLayers(): Promise<StackLayerRow[]>;
  getStackLayer(id: number): Promise<StackLayerRow | null>;
  createStackLayer(input: StackLayerInput): Promise<StackLayerRow>;
  updateStackLayer(id: number, input: StackLayerInput): Promise<void>;
  deleteStackLayer(id: number): Promise<void>;

  listProjects(): Promise<ProjectRow[]>;
  getProject(id: number): Promise<ProjectRow | null>;
  createProject(input: ProjectInput): Promise<ProjectRow>;
  updateProject(id: number, input: ProjectInput): Promise<void>;
  deleteProject(id: number): Promise<void>;

  listExperience(): Promise<ExperienceRow[]>;
  getExperience(id: number): Promise<ExperienceRow | null>;
  createExperience(input: ExperienceInput): Promise<ExperienceRow>;
  updateExperience(id: number, input: ExperienceInput): Promise<void>;
  deleteExperience(id: number): Promise<void>;

  listContactLinks(): Promise<ContactLinkRow[]>;
  getContactLink(id: number): Promise<ContactLinkRow | null>;
  createContactLink(input: ContactLinkInput): Promise<ContactLinkRow>;
  updateContactLink(id: number, input: ContactLinkInput): Promise<void>;
  deleteContactLink(id: number): Promise<void>;

  listBlogPosts(): Promise<BlogPostRow[]>;
  getBlogPost(id: number): Promise<BlogPostRow | null>;
  createBlogPost(input: BlogPostInput): Promise<BlogPostRow>;
  updateBlogPost(id: number, input: BlogPostInput): Promise<void>;
  deleteBlogPost(id: number): Promise<void>;
}

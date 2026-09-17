import type {
  ContactLinkRow,
  ExperienceRow,
  NavLinkRow,
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
  createNavLink(input: NavLinkInput): Promise<NavLinkRow>;
  updateNavLink(id: number, input: NavLinkInput): Promise<void>;
  deleteNavLink(id: number): Promise<void>;

  listStatusItems(): Promise<StatusItemRow[]>;
  createStatusItem(input: StatusItemInput): Promise<StatusItemRow>;
  updateStatusItem(id: number, input: StatusItemInput): Promise<void>;
  deleteStatusItem(id: number): Promise<void>;

  listStackLayers(): Promise<StackLayerRow[]>;
  createStackLayer(input: StackLayerInput): Promise<StackLayerRow>;
  updateStackLayer(id: number, input: StackLayerInput): Promise<void>;
  deleteStackLayer(id: number): Promise<void>;

  listProjects(): Promise<ProjectRow[]>;
  createProject(input: ProjectInput): Promise<ProjectRow>;
  updateProject(id: number, input: ProjectInput): Promise<void>;
  deleteProject(id: number): Promise<void>;

  listExperience(): Promise<ExperienceRow[]>;
  createExperience(input: ExperienceInput): Promise<ExperienceRow>;
  updateExperience(id: number, input: ExperienceInput): Promise<void>;
  deleteExperience(id: number): Promise<void>;

  listContactLinks(): Promise<ContactLinkRow[]>;
  createContactLink(input: ContactLinkInput): Promise<ContactLinkRow>;
  updateContactLink(id: number, input: ContactLinkInput): Promise<void>;
  deleteContactLink(id: number): Promise<void>;
}

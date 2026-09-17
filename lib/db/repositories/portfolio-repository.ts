import type {
  ContactLink,
  ExperienceItem,
  NavLink,
  Project,
  SiteConfig,
  StackLayer,
  StatusItem,
} from "@/lib/types/portfolio";

/**
 * Abstraction the rest of the app (pages, components) depends on —
 * Dependency Inversion: consumers never import Drizzle or `pg` directly.
 * Scoped to the one bounded context this site has (ISP: no unrelated
 * CRUD methods bolted on) and returns the same DTO shapes already used
 * by the static data in lib/data/portfolio-data.ts, so swapping the data
 * source doesn't ripple into components.
 */
export interface PortfolioRepository {
  getSiteConfig(): Promise<SiteConfig>;
  getContactNote(): Promise<string>;
  getNavLinks(): Promise<NavLink[]>;
  getStatusItems(): Promise<StatusItem[]>;
  getStackLayers(): Promise<StackLayer[]>;
  getProjects(): Promise<Project[]>;
  getExperience(): Promise<ExperienceItem[]>;
  getContactLinks(): Promise<ContactLink[]>;
}

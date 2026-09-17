import "server-only";

import type { ContactMessageRepository } from "./contact-message-repository";
import { DrizzleContactMessageRepository } from "./drizzle-contact-message-repository";
import { DrizzlePortfolioAdminRepository } from "./drizzle-portfolio-admin-repository";
import { FallbackPortfolioRepository } from "./fallback-portfolio-repository";
import type { PortfolioAdminRepository } from "./portfolio-admin-repository";
import type { PortfolioRepository } from "./portfolio-repository";

export type { PortfolioRepository } from "./portfolio-repository";
export { DrizzlePortfolioRepository } from "./drizzle-portfolio-repository";
export { FallbackPortfolioRepository } from "./fallback-portfolio-repository";
export type {
  PortfolioAdminRepository,
  SiteConfigInput,
  NavLinkInput,
  StatusItemInput,
  StackLayerInput,
  ProjectInput,
  ExperienceInput,
  ContactLinkInput,
} from "./portfolio-admin-repository";
export { DrizzlePortfolioAdminRepository } from "./drizzle-portfolio-admin-repository";
export type { ContactMessageRepository } from "./contact-message-repository";
export { DrizzleContactMessageRepository } from "./drizzle-contact-message-repository";

/**
 * Composition root for the portfolio DAL. Pages/Server Components should
 * call this instead of `new DrizzlePortfolioRepository()` directly, so the
 * concrete implementation stays swappable in one place (Dependency
 * Inversion). Returns a `FallbackPortfolioRepository`, which reads from
 * Drizzle/Supabase but falls back to the static content in
 * lib/data/portfolio-data.ts when `DATABASE_URL` is unset or the database
 * is unreachable.
 */
export function getPortfolioRepository(): PortfolioRepository {
  return new FallbackPortfolioRepository();
}

/**
 * Composition root for the admin (write-side) DAL, used only by
 * app/admin/**. No fallback here on purpose — see
 * PortfolioAdminRepository's doc comment.
 */
export function getPortfolioAdminRepository(): PortfolioAdminRepository {
  return new DrizzlePortfolioAdminRepository();
}

/**
 * Composition root for visitor contact messages — written by the public
 * contact form, read/managed by the admin dashboard.
 */
export function getContactMessageRepository(): ContactMessageRepository {
  return new DrizzleContactMessageRepository();
}

import { describe, expect, it, vi } from "vitest";

// FallbackPortfolioRepository (and the PortfolioRepository it wraps) carry
// the `server-only` marker, which throws unconditionally outside of
// Next.js's server compilation graph. Stub it so the module can be
// imported under vitest, same as Next.js does for server bundles.
vi.mock("server-only", () => ({}));

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

import { FallbackPortfolioRepository } from "../fallback-portfolio-repository";
import type { PortfolioRepository } from "../portfolio-repository";

function workingRepository(): PortfolioRepository {
  return {
    getSiteConfig: async () => ({ ...siteConfig, brand: "from-db" }),
    getContactNote: async () => "from-db",
    getNavLinks: async () => [{ label: "from-db", href: "#" }],
    getStatusItems: async () => [{ label: "from-db", value: "x" }],
    getStackLayers: async () => [
      { layer: "from-db", title: "x", tags: [] },
    ],
    getProjects: async () => [
      { year: "x", category: "x", title: "from-db", description: "x", tags: [] },
    ],
    getExperience: async () => [
      { date: "x", role: "from-db", description: "x" },
    ],
    getContactLinks: async () => [{ label: "from-db", href: "#" }],
  };
}

function throwingRepository(): PortfolioRepository {
  const fail = async () => {
    throw new Error("query failed");
  };
  return {
    getSiteConfig: fail,
    getContactNote: fail,
    getNavLinks: fail,
    getStatusItems: fail,
    getStackLayers: fail,
    getProjects: fail,
    getExperience: fail,
    getContactLinks: fail,
  };
}

describe("FallbackPortfolioRepository", () => {
  it("delegates to the primary repository when it succeeds", async () => {
    const repo = new FallbackPortfolioRepository(workingRepository);

    expect((await repo.getSiteConfig()).brand).toBe("from-db");
    expect(await repo.getContactNote()).toBe("from-db");
  });

  it("falls back to static data when every query fails", async () => {
    const repo = new FallbackPortfolioRepository(throwingRepository);

    expect(await repo.getSiteConfig()).toEqual(siteConfig);
    expect(await repo.getContactNote()).toBe(contactNote);
    expect(await repo.getNavLinks()).toEqual(navLinks);
    expect(await repo.getStatusItems()).toEqual(statusItems);
    expect(await repo.getStackLayers()).toEqual(stackLayers);
    expect(await repo.getProjects()).toEqual(projects);
    expect(await repo.getExperience()).toEqual(experience);
    expect(await repo.getContactLinks()).toEqual(contactLinks);
  });

  it("falls back to static data when the primary repository can't be constructed", async () => {
    const repo = new FallbackPortfolioRepository(() => {
      throw new Error("DATABASE_URL is not set");
    });

    expect(await repo.getSiteConfig()).toEqual(siteConfig);
    expect(await repo.getProjects()).toEqual(projects);
  });

  it("falls back to static data when a list table is empty (unmigrated/unseeded)", async () => {
    const repo = new FallbackPortfolioRepository(() => ({
      ...workingRepository(),
      getProjects: async () => [],
    }));

    expect(await repo.getProjects()).toEqual(projects);
  });
});

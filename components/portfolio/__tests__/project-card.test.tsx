import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/portfolio/project-card";
import type { Project } from "@/lib/types/portfolio";

const project: Project = {
  year: "2024 — ongoing",
  category: "Marketplace platform",
  title: "Scrub.ph",
  description: "A Philippine-based cleaning services marketplace.",
  tags: ["Node.js", "PostgreSQL"],
};

describe("ProjectCard", () => {
  it("renders the project's title, description, year and tags", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("heading", { name: "Scrub.ph" })).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText(project.year)).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });
});

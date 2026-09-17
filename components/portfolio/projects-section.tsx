import { ProjectCard } from "@/components/portfolio/project-card";
import { SectionHeading } from "@/components/portfolio/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/portfolio/stagger-in";
import type { Project } from "@/lib/types/portfolio";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="border-t border-line py-16 sm:py-[72px]">
      <SectionHeading number="02" title="Selected work" />
      <StaggerGroup>
        {projects.map((project) => (
          <StaggerItem key={project.title}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

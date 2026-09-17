import { TagList } from "@/components/portfolio/tag-list";
import type { Project } from "@/lib/types/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-line py-8 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-8">
      <div className="font-mono text-xs text-muted-foreground">
        <span className="mb-1.5 block text-amber">{project.year}</span>
        {project.category}
      </div>
      <div>
        <h3 className="mb-2.5 text-xl font-semibold">{project.title}</h3>
        <p className="mb-3.5 max-w-[62ch] text-muted-foreground">{project.description}</p>
        <TagList tags={project.tags} />
      </div>
    </div>
  );
}

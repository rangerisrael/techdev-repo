import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteProject, updateProject } from "../../actions";

export default async function EditProjectPage(
  props: PageProps<"/admin/projects/[id]/edit">
) {
  const { id } = await props.params;
  const project = await getPortfolioAdminRepository().getProject(Number(id));
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit project</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </div>

      <ProjectForm project={project} action={updateProject} deleteAction={deleteProject} />
    </div>
  );
}

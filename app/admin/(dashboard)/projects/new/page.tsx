import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New project</h1>
        <p className="text-sm text-muted-foreground">
          Tags are comma-separated.
        </p>
      </div>

      <ProjectForm action={createProject} />
    </div>
  );
}

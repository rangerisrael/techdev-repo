import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectRow } from "@/lib/db/schema";
import Link from "next/link";

export function ProjectForm({
  project,
  action,
  deleteAction,
}: {
  project?: ProjectRow;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            defaultValue={project?.year}
            placeholder="2025 — ongoing"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={project?.category}
            placeholder="Marketplace platform"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={project?.position ?? 0}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description}
          required
          rows={4}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={project?.tags.join(", ")}
          placeholder="Node.js, PostgreSQL"
        />
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={project ? "Saving…" : "Adding…"}>
          {project ? "Save changes" : "Add project"}
        </SubmitButton>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {project && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete the "${project.title}" project? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { createProject, deleteProject, updateProject } from "./actions";

export default async function ProjectsPage() {
  const rows = await getPortfolioAdminRepository().listProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Work section entries. Tags are comma-separated.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={updateProject}
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="space-y-1">
                <Label htmlFor={`year-${row.id}`}>Year</Label>
                <Input
                  id={`year-${row.id}`}
                  name="year"
                  defaultValue={row.year}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`category-${row.id}`}>Category</Label>
                <Input
                  id={`category-${row.id}`}
                  name="category"
                  defaultValue={row.category}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`title-${row.id}`}>Title</Label>
                <Input
                  id={`title-${row.id}`}
                  name="title"
                  defaultValue={row.title}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`position-${row.id}`}>Order</Label>
                <Input
                  id={`position-${row.id}`}
                  name="position"
                  type="number"
                  defaultValue={row.position}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`description-${row.id}`}>Description</Label>
              <Textarea
                id={`description-${row.id}`}
                name="description"
                defaultValue={row.description}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`tags-${row.id}`}>Tags</Label>
              <Input
                id={`tags-${row.id}`}
                name="tags"
                defaultValue={row.tags.join(", ")}
              />
            </div>
            <div className="flex gap-1.5">
              <Button type="submit" size="sm">
                Save
              </Button>
              <ConfirmSubmitButton
                type="submit"
                formAction={deleteProject}
                variant="destructive"
                size="sm"
                confirmMessage={`Delete the "${row.title}" project?`}
              >
                Delete
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        ) : null}
      </div>

      <form
        action={createProject}
        className="space-y-2 rounded-lg border border-dashed border-border p-3"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="new-year">Year</Label>
            <Input
              id="new-year"
              name="year"
              placeholder="2025 — ongoing"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-category">Category</Label>
            <Input
              id="new-category"
              name="category"
              placeholder="Marketplace platform"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-title">Title</Label>
            <Input id="new-title" name="title" required />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-description">Description</Label>
          <Textarea id="new-description" name="description" required rows={3} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-tags">Tags</Label>
          <Input id="new-tags" name="tags" placeholder="Node.js, PostgreSQL" />
        </div>
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
    </div>
  );
}

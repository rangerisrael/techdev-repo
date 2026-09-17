import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "./actions";

export default async function ExperiencePage() {
  const rows = await getPortfolioAdminRepository().listExperience();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Experience</h1>
        <p className="text-sm text-muted-foreground">
          Career timeline entries.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={updateExperience}
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor={`date-${row.id}`}>Date</Label>
                <Input
                  id={`date-${row.id}`}
                  name="date"
                  defaultValue={row.date}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`role-${row.id}`}>Role</Label>
                <Input
                  id={`role-${row.id}`}
                  name="role"
                  defaultValue={row.role}
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
            <div className="flex gap-1.5">
              <SubmitButton size="sm" pendingLabel="Saving…">
                Save
              </SubmitButton>
              <ConfirmSubmitButton
                type="submit"
                formAction={deleteExperience}
                variant="destructive"
                size="sm"
                confirmMessage={`Delete the "${row.role}" experience entry?`}
              >
                Delete
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No experience entries yet.
          </p>
        ) : null}
      </div>

      <form
        action={createExperience}
        className="space-y-2 rounded-lg border border-dashed border-border p-3"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="new-date">Date</Label>
            <Input id="new-date" name="date" placeholder="2024 — Present" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-role">Role</Label>
            <Input id="new-role" name="role" placeholder="Role, Company" required />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-description">Description</Label>
          <Textarea id="new-description" name="description" required rows={3} />
        </div>
        <SubmitButton size="sm" pendingLabel="Adding…">
          Add
        </SubmitButton>
      </form>
    </div>
  );
}

import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import {
  createStatusItem,
  deleteStatusItem,
  updateStatusItem,
} from "./actions";

export default async function StatusItemsPage() {
  const rows = await getPortfolioAdminRepository().listStatusItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Status items
        </h1>
        <p className="text-sm text-muted-foreground">
          The label/value strip in the hero section.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={updateStatusItem}
            className="grid grid-cols-2 items-end gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_5rem_auto]"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="space-y-1">
              <Label htmlFor={`label-${row.id}`}>Label</Label>
              <Input
                id={`label-${row.id}`}
                name="label"
                defaultValue={row.label}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`value-${row.id}`}>Value</Label>
              <Input
                id={`value-${row.id}`}
                name="value"
                defaultValue={row.value}
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
            <div className="flex gap-1.5">
              <Button type="submit" size="sm">
                Save
              </Button>
              <ConfirmSubmitButton
                type="submit"
                formAction={deleteStatusItem}
                variant="destructive"
                size="sm"
                confirmMessage={`Delete the "${row.label}" status item?`}
              >
                Delete
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No status items yet.</p>
        ) : null}
      </div>

      <form
        action={createStatusItem}
        className="grid grid-cols-2 items-end gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div className="space-y-1">
          <Label htmlFor="new-label">Label</Label>
          <Input id="new-label" name="label" placeholder="role" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-value">Value</Label>
          <Input
            id="new-value"
            name="value"
            placeholder="Full-Stack Developer"
            required
          />
        </div>
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
    </div>
  );
}

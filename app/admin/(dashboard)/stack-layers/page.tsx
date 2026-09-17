import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import {
  createStackLayer,
  deleteStackLayer,
  updateStackLayer,
} from "./actions";

export default async function StackLayersPage() {
  const rows = await getPortfolioAdminRepository().listStackLayers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Stack layers
        </h1>
        <p className="text-sm text-muted-foreground">
          The stack diagram. Tags are comma-separated.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={updateStackLayer}
            className="grid grid-cols-2 items-end gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_1fr_5rem_auto_auto]"
          >
            <input type="hidden" name="id" value={row.id} />
            <div className="space-y-1">
              <Label htmlFor={`layer-${row.id}`}>Layer</Label>
              <Input
                id={`layer-${row.id}`}
                name="layer"
                defaultValue={row.layer}
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
              <Label htmlFor={`tags-${row.id}`}>Tags</Label>
              <Input
                id={`tags-${row.id}`}
                name="tags"
                defaultValue={row.tags.join(", ")}
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
            <label
              htmlFor={`wide-${row.id}`}
              className="flex items-center gap-1.5 pb-1.5 text-sm text-foreground"
            >
              <input
                id={`wide-${row.id}`}
                name="wide"
                type="checkbox"
                defaultChecked={row.wide}
                className="size-4 rounded border-input"
              />
              Wide
            </label>
            <div className="flex gap-1.5">
              <SubmitButton size="sm" pendingLabel="Saving…">
                Save
              </SubmitButton>
              <ConfirmSubmitButton
                type="submit"
                formAction={deleteStackLayer}
                variant="destructive"
                size="sm"
                confirmMessage={`Delete the "${row.title}" stack layer?`}
              >
                Delete
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stack layers yet.</p>
        ) : null}
      </div>

      <form
        action={createStackLayer}
        className="grid grid-cols-2 items-end gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]"
      >
        <div className="space-y-1">
          <Label htmlFor="new-layer">Layer</Label>
          <Input id="new-layer" name="layer" placeholder="client" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-title">Title</Label>
          <Input
            id="new-title"
            name="title"
            placeholder="Interface layer"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-tags">Tags</Label>
          <Input
            id="new-tags"
            name="tags"
            placeholder="React, Next.js, TypeScript"
          />
        </div>
        <label
          htmlFor="new-wide"
          className="flex items-center gap-1.5 pb-1.5 text-sm text-foreground"
        >
          <input
            id="new-wide"
            name="wide"
            type="checkbox"
            className="size-4 rounded border-input"
          />
          Wide
        </label>
        <SubmitButton size="sm" pendingLabel="Adding…">
          Add
        </SubmitButton>
      </form>
    </div>
  );
}

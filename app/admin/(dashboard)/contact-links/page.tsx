import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import {
  createContactLink,
  deleteContactLink,
  updateContactLink,
} from "./actions";

export default async function ContactLinksPage() {
  const rows = await getPortfolioAdminRepository().listContactLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Contact links
        </h1>
        <p className="text-sm text-muted-foreground">
          Shown in the contact section.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.id}
            action={updateContactLink}
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
              <Label htmlFor={`href-${row.id}`}>Href</Label>
              <Input
                id={`href-${row.id}`}
                name="href"
                defaultValue={row.href}
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
              <SubmitButton size="sm" pendingLabel="Saving…">
                Save
              </SubmitButton>
              <ConfirmSubmitButton
                type="submit"
                formAction={deleteContactLink}
                variant="destructive"
                size="sm"
                confirmMessage={`Delete the "${row.label}" contact link?`}
              >
                Delete
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No contact links yet.
          </p>
        ) : null}
      </div>

      <form
        action={createContactLink}
        className="grid grid-cols-2 items-end gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div className="space-y-1">
          <Label htmlFor="new-label">Label</Label>
          <Input id="new-label" name="label" placeholder="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-href">Href</Label>
          <Input
            id="new-href"
            name="href"
            placeholder="mailto:you@example.com"
            required
          />
        </div>
        <SubmitButton size="sm" pendingLabel="Adding…">
          Add
        </SubmitButton>
      </form>
    </div>
  );
}

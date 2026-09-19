import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExperienceRow } from "@/lib/db/schema";

export function ExperienceForm({
  entry,
  action,
  deleteAction,
}: {
  entry?: ExperienceRow;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          defaultValue={entry?.role}
          placeholder="Role, Company"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            defaultValue={entry?.date}
            placeholder="2024 — Present"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={entry?.position ?? 0}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={entry?.description}
          required
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={entry ? "Saving…" : "Adding…"}>
          {entry ? "Save changes" : "Add entry"}
        </SubmitButton>
        <Link
          href="/admin/experience"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {entry && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete the "${entry.role}" experience entry? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

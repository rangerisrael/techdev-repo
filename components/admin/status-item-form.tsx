import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StatusItemRow } from "@/lib/db/schema";

export function StatusItemForm({
  statusItem,
  action,
  deleteAction,
}: {
  statusItem?: StatusItemRow;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {statusItem ? <input type="hidden" name="id" value={statusItem.id} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            defaultValue={statusItem?.label}
            placeholder="role"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            name="value"
            defaultValue={statusItem?.value}
            placeholder="Full-Stack Developer"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={statusItem?.position ?? 0}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={statusItem ? "Saving…" : "Adding…"}>
          {statusItem ? "Save changes" : "Add item"}
        </SubmitButton>
        <Link
          href="/admin/status-items"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {statusItem && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete the "${statusItem.label}" status item? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

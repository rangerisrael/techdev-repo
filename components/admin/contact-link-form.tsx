import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactLinkRow } from "@/lib/db/schema";

export function ContactLinkForm({
  contactLink,
  action,
  deleteAction,
}: {
  contactLink?: ContactLinkRow;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {contactLink ? <input type="hidden" name="id" value={contactLink.id} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            defaultValue={contactLink?.label}
            placeholder="email"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="href">Href</Label>
          <Input
            id="href"
            name="href"
            defaultValue={contactLink?.href}
            placeholder="mailto:you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={contactLink?.position ?? 0}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={contactLink ? "Saving…" : "Adding…"}>
          {contactLink ? "Save changes" : "Add link"}
        </SubmitButton>
        <Link
          href="/admin/contact-links"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {contactLink && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete the "${contactLink.label}" contact link? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

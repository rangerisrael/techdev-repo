import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StackLayerRow } from "@/lib/db/schema";

export function StackLayerForm({
  layer,
  action,
  deleteAction,
}: {
  layer?: StackLayerRow;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      {layer ? <input type="hidden" name="id" value={layer.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={layer?.title}
          placeholder="Interface layer"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="layer">Layer</Label>
          <Input
            id="layer"
            name="layer"
            defaultValue={layer?.layer}
            placeholder="client"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Order</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={layer?.position ?? 0}
          />
        </div>
        <div className="flex items-end pb-1.5">
          <label htmlFor="wide" className="flex items-center gap-1.5 text-sm text-foreground">
            <input
              id="wide"
              name="wide"
              type="checkbox"
              defaultChecked={layer?.wide}
              className="size-4 rounded border-input"
            />
            Wide
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={layer?.tags.join(", ")}
          placeholder="React, Next.js, TypeScript"
        />
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton pendingLabel={layer ? "Saving…" : "Adding…"}>
          {layer ? "Save changes" : "Add layer"}
        </SubmitButton>
        <Link
          href="/admin/stack-layers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
        {layer && deleteAction ? (
          <ConfirmSubmitButton
            type="submit"
            formAction={deleteAction}
            variant="destructive"
            className="ml-auto"
            confirmMessage={`Delete the "${layer.title}" stack layer? This can't be undone.`}
          >
            Delete
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

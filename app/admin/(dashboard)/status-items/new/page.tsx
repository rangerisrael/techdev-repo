import Link from "next/link";
import { StatusItemForm } from "@/components/admin/status-item-form";

import { createStatusItem } from "../actions";

export default function NewStatusItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/status-items"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Status items
        </Link>
        <h1 className="text-lg font-semibold text-foreground">New status item</h1>
      </div>

      <StatusItemForm action={createStatusItem} />
    </div>
  );
}

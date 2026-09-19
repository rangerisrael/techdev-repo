import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusItemForm } from "@/components/admin/status-item-form";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteStatusItem, updateStatusItem } from "../../actions";

export default async function EditStatusItemPage(
  props: PageProps<"/admin/status-items/[id]/edit">
) {
  const { id } = await props.params;
  const statusItem = await getPortfolioAdminRepository().getStatusItem(Number(id));
  if (!statusItem) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/status-items"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Status items
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Edit status item</h1>
        <p className="text-sm text-muted-foreground">{statusItem.label}</p>
      </div>

      <StatusItemForm
        statusItem={statusItem}
        action={updateStatusItem}
        deleteAction={deleteStatusItem}
      />
    </div>
  );
}

import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

import { deleteStatusItem } from "./actions";

export default async function StatusItemsPage() {
  const rows = await getPortfolioAdminRepository().listStatusItems();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Status items</h1>
          <p className="text-sm text-muted-foreground">
            The label/value strip in the hero section.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/status-items/new" />}>
          Add item
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No status items yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/status-items/${row.id}/edit`}
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      {row.label}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.value}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/status-items/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteStatusItem}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete the "${row.label}" status item?`}
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

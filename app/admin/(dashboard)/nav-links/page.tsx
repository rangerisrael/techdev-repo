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

import { deleteNavLink } from "./actions";

export default async function NavLinksPage() {
  const rows = await getPortfolioAdminRepository().listNavLinks();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Nav links</h1>
          <p className="text-sm text-muted-foreground">
            Shown in the site header, in order.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/nav-links/new" />}>
          Add link
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No nav links yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Href</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/nav-links/${row.id}/edit`}
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      {row.label}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.href}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/nav-links/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteNavLink}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete the "${row.label}" nav link?`}
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

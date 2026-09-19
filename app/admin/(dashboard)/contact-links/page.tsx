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

import { deleteContactLink } from "./actions";

export default async function ContactLinksPage() {
  const rows = await getPortfolioAdminRepository().listContactLinks();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Contact links</h1>
          <p className="text-sm text-muted-foreground">
            Shown in the contact section.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/contact-links/new" />}>
          Add link
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contact links yet.</p>
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
                      href={`/admin/contact-links/${row.id}/edit`}
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
                        render={<Link href={`/admin/contact-links/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteContactLink}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete the "${row.label}" contact link?`}
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

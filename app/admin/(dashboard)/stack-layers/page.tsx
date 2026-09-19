import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Badge } from "@/components/ui/badge";
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

import { deleteStackLayer } from "./actions";

export default async function StackLayersPage() {
  const rows = await getPortfolioAdminRepository().listStackLayers();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Stack layers</h1>
          <p className="text-sm text-muted-foreground">
            The stack diagram.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/stack-layers/new" />}>
          Add layer
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No stack layers yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Layer</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Wide</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-xs">
                    <Link
                      href={`/admin/stack-layers/${row.id}/edit`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.layer}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="font-mono text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {row.tags.length > 3 ? (
                        <span className="text-xs text-muted-foreground">
                          +{row.tags.length - 3}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.wide ? "Yes" : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/stack-layers/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteStackLayer}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete the "${row.title}" stack layer?`}
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

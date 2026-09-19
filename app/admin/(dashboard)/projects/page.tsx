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

import { deleteProject } from "./actions";

export default async function ProjectsPage() {
  const rows = await getPortfolioAdminRepository().listProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Work section entries shown at /.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
          Add project
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-xs">
                    <Link
                      href={`/admin/projects/${row.id}/edit`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {row.title}
                    </Link>
                    <div className="truncate text-xs text-muted-foreground">
                      {row.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.year}</TableCell>
                  <TableCell className="text-muted-foreground">{row.category}</TableCell>
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
                  <TableCell className="text-right text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/projects/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete the "${row.title}" project?`}
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

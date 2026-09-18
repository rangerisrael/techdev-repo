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

import { deleteBlogPost } from "./actions";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    date
  );
}

export default async function BlogAdminPage() {
  const rows = await getPortfolioAdminRepository().listBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Articles shown at /blog.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/blog/new" />}>
          Add blog
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Reactions</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-xs">
                    <Link
                      href={`/admin/blog/${row.id}/edit`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {row.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">/blog/{row.slug}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.publishedAt)}
                  </TableCell>
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
                    {row.reactions}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.views}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/blog/${row.id}/comments`} />}
                      >
                        Comments
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/blog/${row.id}/edit`} />}
                      >
                        Edit
                      </Button>
                      <form action={deleteBlogPost}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="slug" value={row.slug} />
                        <ConfirmSubmitButton
                          type="submit"
                          variant="destructive"
                          size="sm"
                          confirmMessage={`Delete "${row.title}"? This can't be undone.`}
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

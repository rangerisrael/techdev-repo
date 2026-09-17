import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { getContactMessageRepository } from "@/lib/db/repositories";

import { deleteMessage, markMessageRead } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function MessagesPage() {
  const rows = await getContactMessageRepository().list();
  const unreadCount = rows.filter((row) => !row.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Submissions from the public contact form
          {unreadCount > 0 ? ` — ${unreadCount} unread` : ""}.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className={
              row.read
                ? "space-y-2 rounded-lg border border-border bg-card p-4"
                : "space-y-2 rounded-lg border border-primary/40 bg-primary/5 p-4"
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">
                  {row.name}{" "}
                  <a
                    href={`mailto:${row.email}`}
                    className="font-normal text-muted-foreground hover:text-primary"
                  >
                    &lt;{row.email}&gt;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  {dateFormatter.format(row.createdAt)}
                </p>
              </div>
              <div className="flex gap-1.5">
                <form action={markMessageRead}>
                  <input type="hidden" name="id" value={row.id} />
                  <input
                    type="hidden"
                    name="read"
                    value={(!row.read).toString()}
                  />
                  <SubmitButton
                    variant="outline"
                    size="sm"
                    pendingLabel={row.read ? "Marking unread…" : "Marking read…"}
                  >
                    {row.read ? "Mark unread" : "Mark read"}
                  </SubmitButton>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={row.id} />
                  <ConfirmSubmitButton
                    type="submit"
                    variant="destructive"
                    size="sm"
                    confirmMessage={`Delete the message from "${row.name}"?`}
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap text-foreground">
              {row.message}
            </p>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No messages yet — they&apos;ll show up here when someone submits
            the contact form.
          </p>
        ) : null}
      </div>
    </div>
  );
}

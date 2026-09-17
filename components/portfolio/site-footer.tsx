export function SiteFooter({ note }: { note: string }) {
  return (
    <footer className="flex flex-wrap justify-between gap-2 py-8 pb-12 font-mono text-xs text-muted-foreground">
      <span>&copy; {new Date().getFullYear()} Israel</span>
      <span>{note}</span>
    </footer>
  );
}

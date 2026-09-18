export function BlogPostCover({ label, imageUrl }: { label: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-entered URL, arbitrary host
      <img
        src={imageUrl}
        alt=""
        className="mb-8 h-50 w-full rounded-lg border border-line object-cover sm:h-65"
      />
    );
  }

  return (
    <div className="relative mb-8 flex h-[200px] items-center justify-center overflow-hidden rounded-lg border border-line bg-linear-to-br from-primary/15 via-surface-2 to-amber/15 sm:h-[260px]">
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"
      />
      <span className="relative px-6 text-center font-mono text-sm tracking-wide text-muted-foreground uppercase sm:text-base">
        #{label}
      </span>
    </div>
  );
}

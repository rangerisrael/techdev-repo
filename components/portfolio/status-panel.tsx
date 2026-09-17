import type { StatusItem } from "@/lib/types/portfolio";

export function StatusPanel({ items }: { items: StatusItem[] }) {
  return (
    <div className="rounded-[10px] border border-line bg-card p-5 font-mono text-[13px]">
      <div className="mb-3 flex items-center text-xs text-muted-foreground">
        <span
          className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(74,222,128,0.15)]"
          aria-hidden
        />
        current status
      </div>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex justify-between border-b border-line py-[9px] text-muted-foreground last:border-b-0"
        >
          <span>{item.label}</span>
          <span className="text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

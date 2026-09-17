import { cn } from "cn";
import type { ComponentProps } from "react";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium text-foreground select-none",
        className
      )}
      {...props}
    />
  );
}

export { Label };

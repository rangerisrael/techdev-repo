"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { NavLink } from "@/lib/types/portfolio";

export function SiteNav({ brand, links }: { brand: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-[18px] sm:px-8">
        <div className="flex items-center gap-3">
          <Image className="h-12.5 w-12.5 rounded-full object-cover" src="/logo.jpg" alt="my brand" width={50} height={50} />
          <span className="font-mono text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">{brand}</strong>
          </span>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <ul className="m-0 flex list-none flex-wrap gap-5 p-0 sm:gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                />
              }
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
              <Dialog.Popup className="fixed inset-0 z-50 flex h-dvh w-dvw flex-col bg-background font-sans outline-none transition-[opacity,transform] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <div className="flex items-center justify-between border-b border-line px-6 py-4.5 sm:px-8">
                  <span className="font-mono text-sm text-muted-foreground">{brand}</span>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Dialog.Close
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Close menu"
                          className="rounded-full text-muted-foreground hover:text-foreground"
                        />
                      }
                    >
                      <X className="size-5" aria-hidden />
                    </Dialog.Close>
                  </div>
                </div>

                <ul className="m-0 flex flex-1 list-none flex-col items-center justify-center gap-8 p-0">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Dialog.Close
                        render={
                          <a
                            href={link.href}
                            className="font-mono text-2xl text-foreground transition-colors hover:text-primary"
                          />
                        }
                      >
                        {link.label}
                      </Dialog.Close>
                    </li>
                  ))}
                </ul>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </nav>
  );
}

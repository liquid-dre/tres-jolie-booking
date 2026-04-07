"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const leftLinks = [
  { href: "/", label: "Home" },
  { href: "#menu", label: "Menu" },
];

const rightLinks = [
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const allLinks = [...leftLinks, ...rightLinks];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20">
        {/* Desktop nav - left links */}
        <nav className="hidden items-center gap-8 md:flex">
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center brand */}
        <Link href="/" className="flex flex-col items-center">
          <span className="font-serif text-xl font-bold uppercase tracking-[0.15em] text-foreground md:text-2xl lg:text-3xl">
            Tres Jolie
          </span>
        </Link>

        {/* Desktop nav - right links + CTA */}
        <nav className="hidden items-center gap-8 md:flex">
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="border border-foreground px-5 py-2 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Reserve Now
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background">
            <nav className="flex flex-col gap-6 pt-12">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-xs font-normal uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="mt-4 border border-foreground px-5 py-3 text-center text-xs font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Reserve Now
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

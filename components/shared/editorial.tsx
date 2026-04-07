import Link from "next/link";

export function Ornament() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="mx-auto text-foreground/30"
    >
      <path
        d="M12 2C12 2 14 6 14 8C14 10 12 12 12 12C12 12 10 10 10 8C10 6 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 12C12 12 16 14 18 14C20 14 22 12 22 12C22 12 20 16 18 18C16 20 12 22 12 22C12 22 8 20 6 18C4 16 2 12 2 12C2 12 4 14 6 14C8 14 12 12 12 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function GridLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 mx-auto hidden max-w-7xl px-4 sm:px-6 lg:flex"
    >
      <div className="flex w-full justify-between">
        <div className="w-px bg-foreground/[0.06]" />
        <div className="w-px bg-foreground/[0.06]" />
        <div className="w-px bg-foreground/[0.06]" />
        <div className="w-px bg-foreground/[0.06]" />
        <div className="w-px bg-foreground/[0.06]" />
      </div>
    </div>
  );
}

export function DiscoverLink({ href = "#", label = "Discover" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:text-foreground/70"
    >
      {label}
      <span className="text-base">&#8594;</span>
    </Link>
  );
}

export function PageHero({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <section className="px-4 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <Ornament />
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <h1 className="mt-4 font-serif text-5xl font-normal italic leading-tight sm:text-6xl lg:text-8xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

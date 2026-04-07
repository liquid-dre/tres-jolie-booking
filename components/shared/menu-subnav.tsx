"use client";

import { useEffect, useState } from "react";

type MenuSubnavProps = {
  categories: { id: string; name: string }[];
};

export function MenuSubnav({ categories }: MenuSubnavProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const cat of categories) {
      const el = document.getElementById(cat.id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(cat.id);
          }
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <nav className="sticky top-20 z-40 border-b border-border bg-background/95 backdrop-blur-sm md:top-24 lg:top-28">
      <div className="mx-auto max-w-6xl">
        <div className="scrollbar-hide flex gap-1 overflow-x-auto px-4 py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(cat.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
                activeId === cat.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

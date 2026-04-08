import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GridLines, PageHero } from "@/components/shared/editorial";
import { MenuSubnav } from "@/components/shared/menu-subnav";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the Tres Jolie menu — wood-fired pizzas, Cape Malay curries, fresh seafood, hearty steaks, and more. Mediterranean and South African cuisine in Ruimsig.",
  openGraph: {
    title: "Menu | Tres Jolie",
    description:
      "Wood-fired pizzas, Cape Malay curries, fresh seafood, and hearty steaks — Mediterranean and South African cuisine.",
  },
};

export const dynamic = "force-dynamic";

type CategoryWithItems = {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    sortOrder: number;
    isActive: boolean;
  }[];
};

async function getMenuCategories(): Promise<CategoryWithItems[]> {
  try {
    return await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch {
    // Table may not exist yet if migration hasn't been run
    return [];
  }
}

export default async function MenuPage() {
  const categories = await getMenuCategories();

  return (
    <>
      <GridLines />
      <Header />
      <main id="main-content" className="flex-1">
        <PageHero label="Culinary Experience" title="Menu" />

        <MenuSubnav
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />

        {categories.map((section, index) => (
          <div key={section.id} id={section.id} className="scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-40">
            {/* Divider */}
            <div className="border-t border-border" />

            <section className="px-4 py-24 sm:py-32">
              <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row">
                {/* Left — section info */}
                <div className="md:w-1/3 md:pr-12">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {section.label}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
                    {section.name}
                  </h2>

                  {/* Arch image on first section only */}
                  {index === 0 && (
                    <div className="mt-10 hidden md:block">
                      <div className="relative h-[300px] w-[220px] overflow-hidden rounded-t-full">
                        <Image
                          src="/menu.jpg"
                          alt="Artfully plated Mediterranean cuisine at Tres Jolie"
                          fill
                          className="object-cover"
                          sizes="220px"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Vertical divider */}
                <div className="hidden w-px self-stretch bg-border md:block" />

                {/* Right — menu items */}
                <div className="flex-1 md:pl-12">
                  <div className="space-y-0">
                    {section.items.map((item, i) => (
                      <div
                        key={item.id}
                        className={`py-6 ${i < section.items.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="text-base font-normal text-foreground">
                            {item.name}
                          </h3>
                          <span className="shrink-0 text-sm font-normal text-foreground">
                            {item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* CTA */}
        <section className="px-4 py-24 text-center sm:py-32">
          <h2 className="font-serif text-4xl font-normal italic sm:text-5xl">
            Join Us for a Meal
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Our menu celebrates the finest local ingredients. Reserve your table
            to experience it firsthand.
          </p>
          <div className="mt-10">
            <Link
              href="/book"
              className="inline-flex items-center gap-3 border border-foreground px-8 py-3 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Reserve Now
              <span className="text-base">&#8594;</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GridLines, PageHero } from "@/components/shared/editorial";

export const metadata: Metadata = {
  title: "Menu",
};

const menuSections = [
  {
    label: "Morning",
    title: "Breakfast",
    time: "Tuesday — Sunday, 9:00 AM — 11:30 AM",
    items: [
      { name: "Farm-Style Eggs Benedict", description: "Free-range eggs, hollandaise, sourdough, smoked salmon or bacon" },
      { name: "Tres Jolie Granola Bowl", description: "House-made granola, seasonal fruit, Greek yoghurt, honey" },
      { name: "Buttermilk Pancakes", description: "Fluffy pancakes, berry compote, mascarpone, maple syrup" },
      { name: "Garden Omelette", description: "Three-egg omelette, seasonal vegetables, feta, fresh herbs" },
      { name: "Full Country Breakfast", description: "Eggs, bacon, boerewors, toast, grilled tomato, mushrooms" },
    ],
  },
  {
    label: "Afternoon",
    title: "Lunch",
    time: "Tuesday — Sunday, 12:00 PM — 5:30 PM",
    items: [
      { name: "Wood-Fired Margherita", description: "San Marzano tomatoes, fior di latte, fresh basil, olive oil" },
      { name: "Cape Malay Curry", description: "Slow-cooked lamb, fragrant spices, basmati rice, sambals" },
      { name: "Grilled Linefish", description: "Catch of the day, lemon butter, seasonal vegetables, herb salad" },
      { name: "Garden Harvest Salad", description: "Mixed leaves, roasted vegetables, avo, seeds, citrus vinaigrette" },
      { name: "Ribeye Steak", description: "300g aged ribeye, hand-cut chips, peppercorn sauce, garden salad" },
    ],
  },
  {
    label: "Evening",
    title: "Dinner",
    time: "Friday — Saturday, 6:00 PM — 10:00 PM",
    items: [
      { name: "Prawn Linguine", description: "Tiger prawns, garlic, chilli, white wine, cherry tomatoes, parsley" },
      { name: "Lamb Shank", description: "Slow-braised lamb, red wine jus, creamy mash, roasted root vegetables" },
      { name: "Duck Breast", description: "Pan-seared duck, plum glaze, dauphinoise potatoes, green beans" },
      { name: "Seafood Platter for Two", description: "Grilled prawns, calamari, linefish, mussels, lemon butter" },
      { name: "Chocolate Fondant", description: "Warm dark chocolate cake, vanilla bean ice cream, berry coulis" },
    ],
  },
];

export default function MenuPage() {
  return (
    <>
      <GridLines />
      <Header />
      <main className="flex-1">
        <PageHero label="Culinary Experience" title="Menu" />

        {menuSections.map((section, index) => (
          <div key={section.title}>
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
                    {section.title}
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {section.time}
                  </p>

                  {/* Arch image on first section only */}
                  {index === 0 && (
                    <div className="mt-10 hidden md:block">
                      <div className="h-[300px] w-[220px] overflow-hidden rounded-t-full">
                        <img
                          src="/menu.jpg"
                          alt="Cuisine at Tres Jolie"
                          className="h-full w-full object-cover"
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
                        key={item.name}
                        className={`py-6 ${i < section.items.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <h3 className="text-base font-normal text-foreground">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
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
            Our menu changes with the seasons, celebrating the finest local
            ingredients. Reserve your table to experience it firsthand.
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

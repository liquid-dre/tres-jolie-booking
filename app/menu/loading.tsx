import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GridLines } from "@/components/shared/editorial";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <>
      <GridLines />
      <Header />
      <main className="flex-1">
        {/* PageHero skeleton */}
        <section className="px-4 py-24 text-center sm:py-32">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto mt-4 h-12 w-48" />
        </section>

        {/* Subnav skeleton */}
        <div className="sticky top-20 z-40 border-b border-border bg-background/95 px-4 py-3 md:top-24 lg:top-28">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
            ))}
          </div>
        </div>

        {/* Menu sections skeleton */}
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="border-t border-border" />
            <section className="px-4 py-24 sm:py-32">
              <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row">
                <div className="md:w-1/3 md:pr-12">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="mt-4 h-10 w-40" />
                </div>
                <div className="hidden w-px self-stretch bg-border md:block" />
                <div className="flex-1 md:pl-12">
                  <div className="space-y-0">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className={`py-6 ${j < 4 ? "border-b border-border" : ""}`}>
                        <div className="flex items-baseline justify-between gap-4">
                          <Skeleton className="h-4 w-44" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="mt-2 h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}

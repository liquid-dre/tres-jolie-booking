import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GridLines, PageHero, DiscoverLink } from "@/components/shared/editorial";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <GridLines />
      <Header />
      <main className="flex-1">
        <PageHero label="Tres Jolie Ruimsig" title="About" />

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Story — text left, image right */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
            <div className="flex-1 md:pr-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Our Story
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
                A Countryside Escape
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Tres Jolie is more than a restaurant — it&apos;s a countryside
                escape. Nestled in Ruimsig, Johannesburg, we offer a unique
                dining experience surrounded by exquisite gardens, tranquil
                fountains, and flowing water features.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Our journey began with a simple vision: to create a space where
                exceptional food meets the beauty of nature. Every detail, from
                the carefully curated gardens to the warm, welcoming interiors,
                has been shaped by curiosity, warmth, and creative precision.
              </p>
            </div>

            <div className="hidden w-px self-stretch bg-border md:block" />

            <div className="flex flex-1 items-center justify-center">
              <div className="h-[400px] w-[300px] overflow-hidden rounded-t-full sm:h-[480px] sm:w-[360px]">
                <img
                  src="/about.jpg"
                  alt="Fine dining at Tres Jolie"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Values — image left, text right */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col-reverse gap-10 md:flex-row md:items-center">
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[400px] w-[300px] overflow-hidden rounded-t-full sm:h-[480px] sm:w-[360px]">
                <img
                  src="/experience.jpg"
                  alt="Garden venue at Tres Jolie"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="hidden w-px self-stretch bg-border md:block" />

            <div className="flex-1 md:pl-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Our Values
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
                Rooted in Nature
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                We believe dining should be an experience that engages all the
                senses. Our gardens are as much a part of the meal as the food
                itself — a living backdrop that changes with the seasons and
                invites guests to slow down and savour the moment.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                From sourcing local ingredients to nurturing the grounds that
                surround our tables, every choice we make is guided by respect
                for the land and the community we serve.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Family & Events */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
            <div className="flex-1 md:pr-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                For Everyone
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
                Family &amp; Events
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Tres Jolie is a place for all ages. Children delight in our
                touch-and-feed farm, pony rides, playgrounds, and jumping
                castles, while adults unwind in the peaceful gardens or gather
                for celebrations.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                We host birthday parties, corporate events, and private
                functions for up to 400 guests — each one tailored with the
                same care and attention we bring to every dish.
              </p>
              <DiscoverLink href="/contact" label="Get in Touch" />
            </div>

            <div className="hidden w-px self-stretch bg-border md:block" />

            <div className="flex flex-1 items-center justify-center">
              <div className="h-[400px] w-[300px] overflow-hidden rounded-t-full sm:h-[480px] sm:w-[360px]">
                <img
                  src="/hero.jpg"
                  alt="Tres Jolie venue"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* CTA */}
        <section className="px-4 py-24 text-center sm:py-32">
          <h2 className="font-serif text-4xl font-normal italic sm:text-5xl">
            Come Visit Us
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            We&apos;d love to welcome you to Tres Jolie. Reserve your table and
            experience countryside dining at its finest.
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

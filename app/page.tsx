import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Ornament, GridLines, DiscoverLink } from "@/components/shared/editorial";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Tres Jolie",
  description:
    "A Mediterranean country restaurant in Ruimsig, Johannesburg. Wood-fired pizzas, Cape Malay curries, fresh seafood, and hearty steaks surrounded by exquisite gardens.",
  url: "https://tresjolie.co.za",
  telephone: "+27117942473",
  email: "info@tresjolie.co.za",
  servesCuisine: ["Mediterranean", "South African"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 22 Peter Road",
    addressLocality: "Ruimsig, Roodepoort",
    addressRegion: "Gauteng",
    addressCountry: "ZA",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:00", closes: "11:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "12:00", closes: "17:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "18:00", closes: "22:00" },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GridLines />
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative px-4 pb-6 pt-4 sm:pt-6 lg:pt-8">
          {/* Heading — overlaps the image */}
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <Ornament />
            <h1 className="mt-4 font-serif text-5xl font-normal italic leading-tight sm:text-6xl lg:text-8xl">
              <span className="not-italic">Welcome</span> to
              <br />
              <span className="inline-block border-b-2 border-foreground/30 pb-2">
                Tres Jolie
              </span>
            </h1>
          </div>

          {/* Arch image — pulled up so heading overlaps it */}
          <div className="relative z-0 mx-auto -mt-6 flex max-w-6xl flex-col items-center sm:-mt-10 lg:-mt-16">
            <div className="relative h-[320px] w-[260px] overflow-hidden rounded-t-full sm:h-[380px] sm:w-[320px] md:h-[420px] md:w-[360px]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/60 via-white/20 to-transparent" />
              <Image
                src="/hero.jpg"
                alt="Tres Jolie restaurant surrounded by lush gardens and water features"
                fill
                priority
                className="object-cover brightness-125"
                sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, 360px"
              />
            </div>
          </div>

          {/* Flanking text — positioned beside the image */}
          <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center gap-6 lg:-mt-36 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-[220px] text-center text-sm leading-relaxed text-muted-foreground lg:text-right">
              Nestled in Ruimsig, Johannesburg
              — a Mediterranean country restaurant
              celebrating cuisine and nature.
            </p>

            {/* Spacer for the arch image in the center */}
            <div className="hidden w-[360px] shrink-0 lg:block" />

            <p className="max-w-[220px] text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
              Wood-fired pizzas, Cape Malay curries,
              fresh seafood, and hearty steaks
              surrounded by exquisite gardens.
            </p>
          </div>
        </section>

        {/* Mobile Reserve CTA — visible only below md where header CTA is hidden */}
        <div className="flex justify-center px-4 pb-10 md:hidden">
          <Link
            href="/book"
            className="inline-flex items-center gap-3 border border-foreground px-8 py-3 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Reserve Now
            <span className="text-base">&#8594;</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* About — text left, image right */}
        <section
          id="about"
          className="scroll-mt-28 px-4 py-24 sm:py-32"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
            {/* Text */}
            <div className="flex-1 md:pr-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Tres Jolie Ruimsig
              </p>
              <h2 className="mt-4 font-serif text-5xl font-normal italic sm:text-6xl lg:text-7xl">
                About
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Tres Jolie is more than a restaurant — it&apos;s a countryside
                escape. Surrounded by exquisite gardens, fountains, and water
                features, guests enjoy Mediterranean and South African cuisine
                in a setting shaped by curiosity, warmth, and creative
                precision.
              </p>
              <DiscoverLink href="/about" />
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Arch image */}
            <div className="flex flex-1 items-center justify-center">
              <div className="relative h-[400px] w-[300px] overflow-hidden rounded-t-full sm:h-[480px] sm:w-[360px]">
                <Image
                  src="/about.jpg"
                  alt="Elegant dining setup at Tres Jolie with garden views"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 300px, 360px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Menu — image left, text right (alternating) */}
        <section
          id="menu"
          className="scroll-mt-28 px-4 py-24 sm:py-32"
        >
          <div className="mx-auto flex max-w-6xl flex-col-reverse gap-10 md:flex-row md:items-center">
            {/* Dark panel with arch image */}
            <div className="flex flex-1 items-center justify-center rounded-none bg-foreground/95 py-16 md:py-20">
              <div className="relative h-[380px] w-[260px] overflow-hidden rounded-t-full sm:h-[440px] sm:w-[300px]">
                <Image
                  src="/menu.jpg"
                  alt="Artfully plated Mediterranean cuisine at Tres Jolie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 260px, 300px"
                />
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Text */}
            <div className="flex-1 md:pl-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Culinary Experience
              </p>
              <h2 className="mt-4 font-serif text-5xl font-normal italic sm:text-6xl lg:text-7xl">
                Menu
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                From wood-fired pizzas and Cape Malay curries to fresh seafood
                and hearty steaks — our menu celebrates the best of
                Mediterranean and South African cuisine, crafted with local
                ingredients and countryside spirit.
              </p>
              <DiscoverLink href="/menu" />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Experience — text left, image right */}
        <section className="scroll-mt-28 px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
            {/* Text */}
            <div className="flex-1 md:pr-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                The Venue
              </p>
              <h2 className="mt-4 font-serif text-5xl font-normal italic sm:text-6xl lg:text-7xl">
                Experience
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Dine surrounded by beautiful gardens, fountains, and water
                features — indoors or alfresco. Tres Jolie is family-friendly
                with a touch-and-feed farm, pony rides, playgrounds, and
                jumping castles for the little ones. We also host birthday
                parties, corporate events, and private functions for up to 400
                guests.
              </p>
              <DiscoverLink href="/about" />
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Arch image */}
            <div className="flex flex-1 items-center justify-center">
              <div className="relative h-[400px] w-[300px] overflow-hidden rounded-t-full sm:h-[480px] sm:w-[360px]">
                <Image
                  src="/experience.jpg"
                  alt="Guests dining in the outdoor garden area at Tres Jolie"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 300px, 360px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Hours & Contact — map left, text right */}
        <section
          id="contact"
          className="scroll-mt-28 px-4 py-24 sm:py-32"
        >
          <div className="mx-auto flex max-w-6xl flex-col-reverse gap-10 md:flex-row md:items-center">
            {/* Map with arch treatment */}
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[450px] w-full max-w-[400px] overflow-hidden rounded-t-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.4!2d27.8617!3d-26.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e959f0c5c3b3b3b%3A0x0!2sTres+Jolie+Restaurant!5e0!3m2!1sen!2sza!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tres Jolie location"
                />
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Text */}
            <div className="flex-1 md:pl-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Visit Us
              </p>
              <h2 className="mt-4 font-serif text-5xl font-normal italic sm:text-6xl lg:text-7xl">
                Hours &amp; Location
              </h2>

              <div className="mt-8 space-y-6 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Breakfast
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Tuesday — Sunday
                  </p>
                  <p className="text-muted-foreground">9:00 AM — 11:30 AM</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Lunch
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Tuesday — Sunday
                  </p>
                  <p className="text-muted-foreground">12:00 PM — 5:30 PM</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Dinner
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Friday — Saturday
                  </p>
                  <p className="text-muted-foreground">6:00 PM — 10:00 PM</p>
                </div>
                <p className="text-xs italic text-muted-foreground">
                  Closed on Mondays
                </p>
              </div>

              <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                <p>Plot 22 Peter Road, Ruimsig, Roodepoort, Gauteng</p>
                <p>
                  <a
                    href="tel:+27117942473"
                    className="transition-colors hover:text-foreground"
                  >
                    011 794 2473
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@tresjolie.co.za"
                    className="transition-colors hover:text-foreground"
                  >
                    info@tresjolie.co.za
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Reservation CTA */}
        <section className="px-4 py-24 text-center sm:py-32">
          <Ornament />
          <h2 className="mt-8 font-serif text-4xl font-normal italic sm:text-5xl lg:text-6xl">
            Reserve Your Table
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Secure your table online in under a minute. We&apos;ll send you a
            confirmation with all the details.
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

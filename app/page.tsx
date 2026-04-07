import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

function DiscoverLink({ href = "#" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground transition-colors hover:text-foreground/70"
    >
      Discover
      <span className="text-base">&#8594;</span>
    </Link>
  );
}

function Ornament() {
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

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-6xl text-center">
            <Ornament />
            <h1 className="mt-8 font-serif text-5xl font-normal italic leading-tight sm:text-6xl lg:text-8xl">
              <span className="not-italic">Welcome</span> to
              <br />
              <span className="inline-block border-b-2 border-foreground/30 pb-2">
                Tres Jolie
              </span>
            </h1>
          </div>

          {/* Hero image + flanking text */}
          <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-end lg:justify-center lg:gap-16">
            <p className="max-w-[220px] text-center text-sm leading-relaxed text-muted-foreground lg:text-right">
              Nestled in Ruimsig, Johannesburg
              — a Mediterranean country restaurant
              celebrating cuisine and nature.
            </p>

            {/* Arch placeholder */}
            <div className="h-[380px] w-[280px] overflow-hidden rounded-t-full bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 sm:h-[450px] sm:w-[340px] md:h-[500px] md:w-[380px]" />

            <p className="max-w-[220px] text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
              Wood-fired pizzas, Cape Malay curries,
              fresh seafood, and hearty steaks
              surrounded by exquisite gardens.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* About — text left, image right */}
        <section
          id="about"
          className="scroll-mt-20 px-4 py-24 sm:py-32"
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
              <DiscoverLink href="#about" />
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Arch placeholder */}
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[400px] w-[300px] overflow-hidden rounded-t-full bg-gradient-to-br from-stone-300 via-amber-200/40 to-stone-400 sm:h-[480px] sm:w-[360px]" />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Menu — image left, text right (alternating) */}
        <section
          id="menu"
          className="scroll-mt-20 px-4 py-24 sm:py-32"
        >
          <div className="mx-auto flex max-w-6xl flex-col-reverse gap-10 md:flex-row md:items-center">
            {/* Dark panel with arch placeholder */}
            <div className="flex flex-1 items-center justify-center rounded-none bg-foreground/95 py-16 md:py-20">
              <div className="h-[380px] w-[260px] overflow-hidden rounded-t-full bg-gradient-to-b from-amber-100/80 via-stone-300 to-stone-500 sm:h-[440px] sm:w-[300px]" />
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
              <DiscoverLink href="#menu" />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Experience — text left, image right */}
        <section className="scroll-mt-20 px-4 py-24 sm:py-32">
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
              <DiscoverLink />
            </div>

            {/* Vertical divider */}
            <div className="hidden w-px self-stretch bg-border md:block" />

            {/* Arch placeholder */}
            <div className="flex flex-1 items-center justify-center">
              <div className="h-[400px] w-[300px] overflow-hidden rounded-t-full bg-gradient-to-br from-emerald-200/30 via-stone-300 to-stone-400 sm:h-[480px] sm:w-[360px]" />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Hours & Contact — map left, text right */}
        <section
          id="contact"
          className="scroll-mt-20 px-4 py-24 sm:py-32"
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

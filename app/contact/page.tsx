import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GridLines, PageHero } from "@/components/shared/editorial";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find Tres Jolie at Plot 22 Peter Road, Ruimsig, Roodepoort. Opening hours, directions, phone, and email. Plan your visit or enquire about private events.",
  openGraph: {
    title: "Contact | Tres Jolie",
    description:
      "Plot 22 Peter Road, Ruimsig, Roodepoort. Opening hours, directions, and contact details.",
  },
};

export default function ContactPage() {
  return (
    <>
      <GridLines />
      <Header />
      <main id="main-content" className="flex-1">
        <PageHero label="Get in Touch" title="Contact" />

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Hours & Location — map left, text right */}
        <section className="px-4 py-24 sm:py-32">
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
              <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
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

        {/* Contact details — text left, image right */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
            <div className="flex-1 md:pr-12">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reach Out
              </p>
              <h2 className="mt-4 font-serif text-4xl font-normal italic sm:text-5xl">
                We&apos;d Love to Hear from You
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Whether you have a question about our menu, want to plan a
                private event, or simply wish to share your experience — we&apos;re
                here to help. Reach us by phone, email, or visit us in person.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Phone
                  </p>
                  <a
                    href="tel:+27117942473"
                    className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    011 794 2473
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Email
                  </p>
                  <a
                    href="mailto:info@tresjolie.co.za"
                    className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    info@tresjolie.co.za
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground">
                    Address
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Plot 22 Peter Road, Ruimsig, Roodepoort, Gauteng
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden w-px self-stretch bg-border md:block" />

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

        {/* CTA */}
        <section className="px-4 py-24 text-center sm:py-32">
          <h2 className="font-serif text-4xl font-normal italic sm:text-5xl">
            Ready to Dine?
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import {
  UtensilsCrossed,
  TreePine,
  Baby,
  Sun,
  Clock,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Mediterranean & SA Cuisine",
    description:
      "Wood-fired pizzas, Cape Malay curries, fresh seafood, and hearty steaks in a country setting.",
  },
  {
    icon: TreePine,
    title: "Garden Dining",
    description:
      "Dine surrounded by exquisite gardens, fountains, and water features — indoors or alfresco.",
  },
  {
    icon: Baby,
    title: "Family Friendly",
    description:
      "Touch-and-feed farm, pony rides, playgrounds, and jumping castles for the little ones.",
  },
  {
    icon: Sun,
    title: "Events & Functions",
    description:
      "Birthday parties, corporate events, and private functions for up to 400 guests.",
  },
];

const hours = [
  { period: "Breakfast", days: "Tue – Sun", time: "9:00 AM – 11:30 AM" },
  { period: "Lunch", days: "Tue – Sun", time: "12:00 PM – 5:30 PM" },
  { period: "Dinner", days: "Fri – Sat", time: "6:00 PM – 10:00 PM" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary px-4 py-24 text-primary-foreground sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary to-primary/80" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Tres Jolie
            </h1>
            <p className="mt-2 text-lg font-medium opacity-90">
              Restaurant & Country Venue
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-80">
              Nestled in Ruimsig, Johannesburg — enjoy Mediterranean and South
              African cuisine surrounded by beautiful gardens and countryside
              charm.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-base font-semibold"
                asChild
              >
                <Link href="/book">Book a Table</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-base text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <a href="tel:+27117942473">Call Us</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Why Tres Jolie?
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-0 bg-secondary/50 shadow-none"
                >
                  <CardContent className="pt-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <h3 className="mt-3 font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hours & Location */}
        <section className="border-t bg-secondary/30 px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Opening Hours</h2>
              </div>
              <div className="mt-6 space-y-3">
                {hours.map((h) => (
                  <div
                    key={h.period}
                    className="flex items-center justify-between rounded-lg bg-background p-4"
                  >
                    <div>
                      <p className="font-semibold">{h.period}</p>
                      <p className="text-sm text-muted-foreground">{h.days}</p>
                    </div>
                    <p className="text-sm font-medium">{h.time}</p>
                  </div>
                ))}
                <p className="pl-1 text-sm font-medium text-destructive">
                  Closed on Mondays
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Find Us</h2>
              </div>
              <div className="mt-6 overflow-hidden rounded-lg border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.4!2d27.8617!3d-26.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e959f0c5c3b3b3b%3A0x0!2sTres+Jolie+Restaurant!5e0!3m2!1sen!2sza!4v1"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tres Jolie location"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Plot 22 Peter Road, Ruimsig, Roodepoort, Gauteng
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to dine with us?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Secure your table online in under a minute. We&apos;ll send you a
            confirmation with all the details.
          </p>
          <Button size="lg" className="mt-6 text-base font-semibold" asChild>
            <Link href="/book">Book a Table</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}

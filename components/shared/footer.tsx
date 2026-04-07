import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
  { href: "/book", label: "Reserve" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h3 className="font-serif text-2xl font-normal uppercase tracking-[0.15em] text-foreground">
          Tres Jolie
        </h3>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-xs text-muted-foreground">
          Plot 22 Peter Road, Ruimsig, Roodepoort, Gauteng
          <span className="mx-2">|</span>
          <a
            href="tel:+27117942473"
            className="transition-colors hover:text-foreground"
          >
            011 794 2473
          </a>
          <span className="mx-2">|</span>
          <a
            href="mailto:info@tresjolie.co.za"
            className="transition-colors hover:text-foreground"
          >
            info@tresjolie.co.za
          </a>
        </p>

        <p className="mt-8 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Tres Jolie. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary">Tres Jolie</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A Mediterranean country restaurant surrounded by exquisite gardens
              in the heart of Ruimsig.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                Plot 22 Peter Road, Ruimsig, Johannesburg
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+27117942473" className="hover:text-foreground">
                  011 794 2473
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:info@tresjolie.co.za"
                  className="hover:text-foreground"
                >
                  info@tresjolie.co.za
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-foreground">Opening Hours</h4>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>Tue – Sun: 9:00 AM – 5:30 PM</p>
                  <p>Fri – Sat Dinner: 6:00 PM – 10:00 PM</p>
                  <p className="text-destructive">Monday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tres Jolie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

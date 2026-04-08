import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Table",
  description:
    "Reserve your table at Tres Jolie in under a minute. Choose your date, time, and party size — we'll send you a confirmation with all the details.",
  openGraph: {
    title: "Book a Table | Tres Jolie",
    description:
      "Reserve your table at Tres Jolie — Mediterranean dining in Ruimsig, Johannesburg.",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

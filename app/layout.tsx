import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tres Jolie | Book a Table",
    template: "%s | Tres Jolie",
  },
  description:
    "Book your table at Tres Jolie — a Mediterranean country restaurant in Ruimsig, Johannesburg. Breakfast, lunch & dinner surrounded by exquisite gardens.",
  keywords: [
    "Tres Jolie",
    "restaurant booking",
    "Ruimsig",
    "Johannesburg",
    "Mediterranean restaurant",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

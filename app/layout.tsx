import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tresjolie.co.za"),
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
  openGraph: {
    siteName: "Tres Jolie",
    locale: "en_ZA",
    type: "website",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "Tres Jolie restaurant in Ruimsig, Johannesburg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none"
        >
          Skip to content
        </a>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

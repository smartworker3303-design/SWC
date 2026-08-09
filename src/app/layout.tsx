import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "../context/WishlistContext";
import { ProductsProvider } from "../context/ProductsContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saleemwatchcenter.com"),
  title: "Saleem Watch Center | Luxury Hand Watches & Wall Clocks in Karachi",
  description: "Discover Saleem Watch Center (SWC) - Your premier destination for luxury hand watches, elegant wall clocks, and premium timepieces. Experience timeless craftsmanship.",
  keywords: [
    "Saleem Watch Center", "saleem watch center", "saleem watches", 
    "SWC", "swc.com", "Karachi watch center", "watches in Karachi",
    "luxury watches", "hand watches", "wall clocks", "premium clocks", 
    "gold watches", "black watches", "Swiss watches", "chronograph watches",
    "men's watches", "women's luxury watches", "vintage timepieces",
    "branded watches Pakistan", "original watches Karachi", 
    "watch store near me", "best watch shop in Karachi", "horology"
  ].join(", "),
  authors: [{ name: "Saleem Watch Center" }],
  openGraph: {
    title: "Saleem Watch Center | Premium Watches & Clocks",
    description: "Discover Saleem Watch Center's (SWC) exclusive collection of luxury hand watches and elegant wall clocks.",
    url: "https://saleemwatchcenter.com",
    siteName: "Saleem Watch Center",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saleem Watch Center",
    description: "Luxury hand watches and elegant wall clocks.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Saleem Watch Center",
    "image": "https://saleemwatchcenter.com/icon",
    "description": "Premier destination for luxury hand watches, elegant wall clocks, and premium timepieces.",
    "url": "https://saleemwatchcenter.com",
    "telephone": "+92-300-0000000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Karachi",
      "addressCountry": "PK"
    }
  };

  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-luxury-black text-white flex flex-col min-h-screen">
        <ProductsProvider>
          <WishlistProvider>
            <Header />
            <Carousel />
            <main className="flex-grow">{children}</main>
            <Footer />
          </WishlistProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}

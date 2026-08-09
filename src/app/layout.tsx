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
  title: "Saleem Watch Center | Luxury Hand Watches & Wall Clocks",
  description: "Discover Saleem Watch Center's (SWC) exclusive collection of luxury hand watches and elegant wall clocks. Experience timeless craftsmanship, premium black & gold design, and exquisite precision in Karachi and beyond.",
  keywords: "Saleem Watch Center, saleem watch center, watches, wall clocks, hand watches, luxury watches, premium clocks, SWC, swc.com, gold watches, black watches, Karachi watch center",
  authors: [{ name: "Saleem Watch Center" }],
  openGraph: {
    title: "Saleem Watch Center | Luxury Hand Watches",
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
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
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

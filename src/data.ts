export interface Product {
  id: string;
  name: string;
  category: "hand-watches" | "wall-clocks";
  subcategory?: "mens" | "womens";
  brand?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  description: string;
  specs: { [key: string]: string };
  featured: boolean;
  tag?: string;
}

// Products are managed entirely via the Admin Panel and stored in Supabase.
// This array is intentionally empty — do NOT add hardcoded products here,
// as it would cause them to re-seed on every fresh visit and override admin changes.
export const products: Product[] = [];

export const reviews = [
  {
    name: "Nadeem Saleem",
    role: "Collector & Business Owner",
    rating: 5,
    text: "The SWC Royale Chrono is a work of art. The automatic movement is exceptionally smooth, and the black-and-gold styling commands attention in every meeting. Exceptional craftsmanship!"
  },
  {
    name: "Sarah Jenkins",
    role: "Interior Designer",
    rating: 5,
    text: "I recommended the Solaris Gold Sunburst clock to one of my high-end clients. It completely transformed their living room wall. It is silent, beautiful, and looks far more expensive than it is."
  },
  {
    name: "Kamran Khan",
    role: "Watch Enthusiast",
    rating: 4.9,
    text: "I own several Swiss watches, but the Sovereign Gold Chrono has become my daily wear. The leather strap is extremely comfortable, and the dial has a beautiful depth. Shipping and packaging was top-notch!\""
  }
];

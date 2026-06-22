export interface Product {
  id: string;
  name: string;
  category: "hand-watches" | "wall-clocks";
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  specs: { [key: string]: string };
  featured: boolean;
  tag?: string;
}

export const products: Product[] = [
  {
    id: "hw-royale",
    name: "SWC Royale Chrono",
    category: "hand-watches",
    price: 185000,
    rating: 4.9,
    reviews: 142,
    image: "/images/hero_luxury_watch.png",
    description: "Our flagship timepiece. The SWC Royale Chrono represents the absolute peak of horological precision. Designed with deep luxury black and highly polished 24K gold electroplated casing, it features a skeleton watch face showing the intricate self-winding mechanical movement.",
    specs: {
      "Case Diameter": "42mm",
      "Movement": "Automatic Mechanical (Self-Winding)",
      "Water Resistance": "100m (10 ATM)",
      "Band Material": "24K Gold Electroplated Stainless Steel",
      "Glass Type": "Anti-Reflective Sapphire Crystal",
      "Power Reserve": "48 Hours"
    },
    featured: true,
    tag: "Signature"
  },
  {
    id: "hw-gold-chronograph",
    name: "The Sovereign Gold Chrono",
    category: "hand-watches",
    price: 125000,
    rating: 4.8,
    reviews: 98,
    image: "/images/gold_chronograph.png",
    description: "A bold statement of elegance. This chronograph combines the warmth of polished yellow gold with the rugged elegance of hand-stitched premium black Italian leather. Features triple sub-dials, stopwatch function, and date indicator.",
    specs: {
      "Case Diameter": "41mm",
      "Movement": "Swiss Quartz Chronograph",
      "Water Resistance": "50m (5 ATM)",
      "Band Material": "Premium Italian Black Leather",
      "Glass Type": "Scratch-Resistant Mineral Crystal",
      "Warranty": "2 Years"
    },
    featured: true,
    tag: "Bestseller"
  },
  {
    id: "hw-classic-gold",
    name: "Aurelia Minimalist Gold",
    category: "hand-watches",
    price: 89000,
    rating: 4.7,
    reviews: 64,
    image: "/images/classic_gold.png",
    description: "Sleek, slim, and sophisticated. The Aurelia Minimalist Gold is a unisex masterpiece designed for those who appreciate understated luxury. Features an ultra-thin gold mesh strap and a matte black face with delicate gold needles.",
    specs: {
      "Case Thickness": "6.5mm (Ultra-Thin)",
      "Movement": "Japanese Miyota Quartz",
      "Water Resistance": "30m (3 ATM)",
      "Band Material": "Polished Gold Stainless Steel Mesh",
      "Clasp Type": "Slide-Lock Buckle",
      "Weight": "65 grams"
    },
    featured: false,
    tag: "New Arrival"
  },
  {
    id: "wc-sunburst",
    name: "Solaris Gold Sunburst",
    category: "wall-clocks",
    price: 45000,
    rating: 4.9,
    reviews: 110,
    image: "/images/sunburst_clock.png",
    description: "Transform your living space into a gallery of luxury. The Solaris Sunburst features stunning gold metallic rays radiating outwards from a central black clock face. It runs on a completely silent quartz sweep movement, making it perfect for bedrooms and quiet offices.",
    specs: {
      "Diameter": "60cm (24 inches)",
      "Movement": "Silent Sweep Quartz (Non-Ticking)",
      "Material": "Solid Brass & Electroplated Iron",
      "Weight": "2.4 kg",
      "Battery Type": "1x AA Battery (Included)",
      "Mounting Type": "Integrated Wall Bracket"
    },
    featured: true,
    tag: "Best for Living Rooms"
  },
  {
    id: "wc-geometric",
    name: "Metropolis Geometric",
    category: "wall-clocks",
    price: 38000,
    rating: 4.8,
    reviews: 75,
    image: "/images/modern_geometric_clock.png",
    description: "A perfect fusion of modern geometry and premium horology. The Metropolis features abstract gold polygons floating on a matte black background, creating an intriguing 3D effect. The clock hands are finished in a polished gold coating.",
    specs: {
      "Dimensions": "45cm x 45cm",
      "Movement": "Silent Sweep Quartz",
      "Material": "Powder-Coated Steel & Gold Foil accents",
      "Style": "Contemporary / Abstract",
      "Weight": "1.8 kg"
    },
    featured: true,
    tag: "Art Piece"
  },
  {
    id: "wc-minimal-gold",
    name: "Aeon Minimal Black & Gold",
    category: "wall-clocks",
    price: 29000,
    rating: 4.6,
    reviews: 53,
    image: "/images/minimal_gold_clock.png",
    description: "Pure simplicity. The Aeon features a circular matte black steel dial framed by a narrow, polished gold rim. The needle hands rotate smoothly and silently, embodying minimalist luxury for modern interiors.",
    specs: {
      "Diameter": "35cm (14 inches)",
      "Movement": "Silent Quartz Movement",
      "Material": "Spun Aluminum & Brass Outer Ring",
      "Face Cover": "High-Transparency Glass",
      "Battery Life": "Up to 18 Months"
    },
    featured: false,
    tag: "Minimalist"
  }
];

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
    text: "I own several Swiss watches, but the Sovereign Gold Chrono has become my daily wear. The leather strap is extremely comfortable, and the dial has a beautiful depth. Shipping and packaging was top-notch!"
  }
];

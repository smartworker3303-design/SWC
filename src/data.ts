export interface Product {
  id: string;
  name: string;
  category: "hand-watches" | "wall-clocks";
  subcategory?: "mens" | "womens";
  brand?: string;
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
  },
  {
    id: "prod-gen-1",
    name: "Luxury Wall Clock Model 1",
    category: "wall-clocks",
    price: 54249,
    rating: Number(4.2),
    reviews: 49,
    image: "/images/products/swc_product_1.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-2",
    name: "Luxury Wall Clock Model 2",
    category: "wall-clocks",
    price: 19746,
    rating: Number(5.0),
    reviews: 97,
    image: "/images/products/swc_product_2.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-3",
    name: "Luxury Wall Clock Model 3",
    category: "wall-clocks",
    price: 56961,
    rating: Number(4.2),
    reviews: 113,
    image: "/images/products/swc_product_3.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-4",
    name: "Luxury Wall Clock Model 4",
    category: "wall-clocks",
    price: 14743,
    rating: Number(4.8),
    reviews: 18,
    image: "/images/products/swc_product_4.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-5",
    name: "Luxury Wall Clock Model 5",
    category: "wall-clocks",
    price: 12031,
    rating: Number(4.9),
    reviews: 89,
    image: "/images/products/swc_product_5.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-6",
    name: "Luxury Wall Clock Model 6",
    category: "wall-clocks",
    price: 46537,
    rating: Number(4.9),
    reviews: 151,
    image: "/images/products/swc_product_6.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-7",
    name: "Luxury Wall Clock Model 7",
    category: "wall-clocks",
    price: 24602,
    rating: Number(4.3),
    reviews: 61,
    image: "/images/products/swc_product_7.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-8",
    name: "Luxury Wall Clock Model 8",
    category: "wall-clocks",
    price: 22463,
    rating: Number(4.6),
    reviews: 179,
    image: "/images/products/swc_product_8.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-9",
    name: "Luxury Wall Clock Model 9",
    category: "wall-clocks",
    price: 16442,
    rating: Number(4.4),
    reviews: 69,
    image: "/images/products/swc_product_9.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-10",
    name: "Luxury Wall Clock Model 10",
    category: "wall-clocks",
    price: 35855,
    rating: Number(4.9),
    reviews: 62,
    image: "/images/products/swc_product_10.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-11",
    name: "Luxury Wall Clock Model 11",
    category: "wall-clocks",
    price: 50679,
    rating: Number(4.6),
    reviews: 113,
    image: "/images/products/swc_product_11.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-12",
    name: "Luxury Wall Clock Model 12",
    category: "wall-clocks",
    price: 47968,
    rating: Number(4.5),
    reviews: 128,
    image: "/images/products/swc_product_12.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-13",
    name: "Luxury Wall Clock Model 13",
    category: "wall-clocks",
    price: 22663,
    rating: Number(4.5),
    reviews: 131,
    image: "/images/products/swc_product_13.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-14",
    name: "Luxury Wall Clock Model 14",
    category: "wall-clocks",
    price: 55721,
    rating: Number(4.0),
    reviews: 85,
    image: "/images/products/swc_product_14.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-15",
    name: "Luxury Wall Clock Model 15",
    category: "wall-clocks",
    price: 16540,
    rating: Number(4.9),
    reviews: 63,
    image: "/images/products/swc_product_15.webp",
    description: "An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-16",
    name: "Executive Men's Chrono 16",
    category: "hand-watches",
    subcategory: "mens",
    price: 41323,
    rating: Number(4.8),
    reviews: 123,
    image: "/images/products/swc_product_16.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-17",
    name: "Elegant Women's Timepiece 17",
    category: "hand-watches",
    subcategory: "womens",
    price: 42868,
    rating: Number(4.8),
    reviews: 16,
    image: "/images/products/swc_product_17.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-18",
    name: "Executive Men's Chrono 18",
    category: "hand-watches",
    subcategory: "mens",
    price: 20180,
    rating: Number(4.5),
    reviews: 76,
    image: "/images/products/swc_product_18.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-19",
    name: "Elegant Women's Timepiece 19",
    category: "hand-watches",
    subcategory: "womens",
    price: 36866,
    rating: Number(4.7),
    reviews: 64,
    image: "/images/products/swc_product_19.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-20",
    name: "Executive Men's Chrono 20",
    category: "hand-watches",
    subcategory: "mens",
    price: 58780,
    rating: Number(4.6),
    reviews: 31,
    image: "/images/products/swc_product_20.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-21",
    name: "Elegant Women's Timepiece 21",
    category: "hand-watches",
    subcategory: "womens",
    price: 17853,
    rating: Number(4.2),
    reviews: 77,
    image: "/images/products/swc_product_21.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-22",
    name: "Executive Men's Chrono 22",
    category: "hand-watches",
    subcategory: "mens",
    price: 28781,
    rating: Number(4.4),
    reviews: 166,
    image: "/images/products/swc_product_22.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-23",
    name: "Elegant Women's Timepiece 23",
    category: "hand-watches",
    subcategory: "womens",
    price: 53598,
    rating: Number(4.4),
    reviews: 21,
    image: "/images/products/swc_product_23.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-24",
    name: "Executive Men's Chrono 24",
    category: "hand-watches",
    subcategory: "mens",
    price: 32679,
    rating: Number(4.6),
    reviews: 79,
    image: "/images/products/swc_product_24.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-25",
    name: "Elegant Women's Timepiece 25",
    category: "hand-watches",
    subcategory: "womens",
    price: 15311,
    rating: Number(4.2),
    reviews: 55,
    image: "/images/products/swc_product_25.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-26",
    name: "Executive Men's Chrono 26",
    category: "hand-watches",
    subcategory: "mens",
    price: 18801,
    rating: Number(4.0),
    reviews: 68,
    image: "/images/products/swc_product_26.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-27",
    name: "Elegant Women's Timepiece 27",
    category: "hand-watches",
    subcategory: "womens",
    price: 14225,
    rating: Number(4.3),
    reviews: 48,
    image: "/images/products/swc_product_27.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-28",
    name: "Executive Men's Chrono 28",
    category: "hand-watches",
    subcategory: "mens",
    price: 53957,
    rating: Number(4.4),
    reviews: 47,
    image: "/images/products/swc_product_28.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-29",
    name: "Elegant Women's Timepiece 29",
    category: "hand-watches",
    subcategory: "womens",
    price: 57488,
    rating: Number(4.9),
    reviews: 55,
    image: "/images/products/swc_product_29.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-30",
    name: "Executive Men's Chrono 30",
    category: "hand-watches",
    subcategory: "mens",
    price: 40252,
    rating: Number(4.0),
    reviews: 29,
    image: "/images/products/swc_product_30.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-31",
    name: "Elegant Women's Timepiece 31",
    category: "hand-watches",
    subcategory: "womens",
    price: 25877,
    rating: Number(4.9),
    reviews: 199,
    image: "/images/products/swc_product_31.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-32",
    name: "Executive Men's Chrono 32",
    category: "hand-watches",
    subcategory: "mens",
    price: 40094,
    rating: Number(4.9),
    reviews: 57,
    image: "/images/products/swc_product_32.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-33",
    name: "Elegant Women's Timepiece 33",
    category: "hand-watches",
    subcategory: "womens",
    price: 47514,
    rating: Number(4.7),
    reviews: 154,
    image: "/images/products/swc_product_33.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-34",
    name: "Executive Men's Chrono 34",
    category: "hand-watches",
    subcategory: "mens",
    price: 48133,
    rating: Number(4.3),
    reviews: 27,
    image: "/images/products/swc_product_34.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-35",
    name: "Elegant Women's Timepiece 35",
    category: "hand-watches",
    subcategory: "womens",
    price: 13014,
    rating: Number(4.1),
    reviews: 19,
    image: "/images/products/swc_product_35.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-36",
    name: "Executive Men's Chrono 36",
    category: "hand-watches",
    subcategory: "mens",
    price: 34389,
    rating: Number(4.7),
    reviews: 150,
    image: "/images/products/swc_product_36.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-37",
    name: "Elegant Women's Timepiece 37",
    category: "hand-watches",
    subcategory: "womens",
    price: 23926,
    rating: Number(4.7),
    reviews: 66,
    image: "/images/products/swc_product_37.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-38",
    name: "Executive Men's Chrono 38",
    category: "hand-watches",
    subcategory: "mens",
    price: 43212,
    rating: Number(4.1),
    reviews: 7,
    image: "/images/products/swc_product_38.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-39",
    name: "Elegant Women's Timepiece 39",
    category: "hand-watches",
    subcategory: "womens",
    price: 37710,
    rating: Number(4.0),
    reviews: 103,
    image: "/images/products/swc_product_39.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-40",
    name: "Executive Men's Chrono 40",
    category: "hand-watches",
    subcategory: "mens",
    price: 10373,
    rating: Number(5.0),
    reviews: 26,
    image: "/images/products/swc_product_40.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-41",
    name: "Elegant Women's Timepiece 41",
    category: "hand-watches",
    subcategory: "womens",
    price: 12431,
    rating: Number(4.4),
    reviews: 145,
    image: "/images/products/swc_product_41.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-42",
    name: "Executive Men's Chrono 42",
    category: "hand-watches",
    subcategory: "mens",
    price: 34081,
    rating: Number(4.5),
    reviews: 11,
    image: "/images/products/swc_product_42.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-43",
    name: "Elegant Women's Timepiece 43",
    category: "hand-watches",
    subcategory: "womens",
    price: 26319,
    rating: Number(4.1),
    reviews: 41,
    image: "/images/products/swc_product_43.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-44",
    name: "Executive Men's Chrono 44",
    category: "hand-watches",
    subcategory: "mens",
    price: 21248,
    rating: Number(4.8),
    reviews: 151,
    image: "/images/products/swc_product_44.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-45",
    name: "Elegant Women's Timepiece 45",
    category: "hand-watches",
    subcategory: "womens",
    price: 54183,
    rating: Number(4.6),
    reviews: 38,
    image: "/images/products/swc_product_45.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-46",
    name: "Executive Men's Chrono 46",
    category: "hand-watches",
    subcategory: "mens",
    price: 54180,
    rating: Number(4.5),
    reviews: 149,
    image: "/images/products/swc_product_46.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-47",
    name: "Elegant Women's Timepiece 47",
    category: "hand-watches",
    subcategory: "womens",
    price: 54328,
    rating: Number(4.6),
    reviews: 14,
    image: "/images/products/swc_product_47.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-48",
    name: "Executive Men's Chrono 48",
    category: "hand-watches",
    subcategory: "mens",
    price: 18679,
    rating: Number(4.3),
    reviews: 129,
    image: "/images/products/swc_product_48.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-49",
    name: "Elegant Women's Timepiece 49",
    category: "hand-watches",
    subcategory: "womens",
    price: 46842,
    rating: Number(4.9),
    reviews: 149,
    image: "/images/products/swc_product_49.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-50",
    name: "Executive Men's Chrono 50",
    category: "hand-watches",
    subcategory: "mens",
    price: 37429,
    rating: Number(4.4),
    reviews: 110,
    image: "/images/products/swc_product_50.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-51",
    name: "Elegant Women's Timepiece 51",
    category: "hand-watches",
    subcategory: "womens",
    price: 51208,
    rating: Number(4.0),
    reviews: 173,
    image: "/images/products/swc_product_51.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-52",
    name: "Executive Men's Chrono 52",
    category: "hand-watches",
    subcategory: "mens",
    price: 34508,
    rating: Number(4.2),
    reviews: 197,
    image: "/images/products/swc_product_52.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-53",
    name: "Elegant Women's Timepiece 53",
    category: "hand-watches",
    subcategory: "womens",
    price: 12646,
    rating: Number(4.9),
    reviews: 47,
    image: "/images/products/swc_product_53.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-54",
    name: "Executive Men's Chrono 54",
    category: "hand-watches",
    subcategory: "mens",
    price: 48152,
    rating: Number(4.5),
    reviews: 155,
    image: "/images/products/swc_product_54.webp",
    description: "A bold statement of elegance for men. Features durable build and sophisticated design.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  },
  {
    id: "prod-gen-55",
    name: "Elegant Women's Timepiece 55",
    category: "hand-watches",
    subcategory: "womens",
    price: 36858,
    rating: Number(4.2),
    reviews: 181,
    image: "/images/products/swc_product_55.webp",
    description: "Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
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

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  X, 
  Heart, 
  Star, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  ChevronLeft,
  Award,
  ShieldCheck
} from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import { useWishlist } from "../../context/WishlistContext";
import MouseTrail from "../../components/MouseTrail";

export default function WomenWatchPage() {
  const { products, isLoading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [brandFilter, setBrandFilter] = useState("all");

  // Dynamically extract all available brands for women's watches
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>(["Rolex", "Cartier", "Omega", "Audemars Piguet", "SWC Royale"]);
    products.forEach(p => {
      if (p.category === "hand-watches" && p.subcategory === "womens" && p.brand && p.brand.trim()) {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Filter and sort Women's Watches (category === 'hand-watches' and subcategory === 'womens')
  const womensProducts = useMemo(() => {
    // 1. Filter
    const filtered = products.filter(product => {
      const isHandWatch = product.category === "hand-watches";
      const isWomens = product.subcategory === "womens";
      const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.tag && product.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return isHandWatch && isWomens && matchesBrand && matchesSearch;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "newest") {
        const aIsNew = a.tag && /new/i.test(a.tag);
        const bIsNew = b.tag && /new/i.test(b.tag);
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;

        const aIndex = products.indexOf(a);
        const bIndex = products.indexOf(b);
        return bIndex - aIndex;
      }
      // default / featured: respect custom sortOrder position
      const aOrder = a.sortOrder !== undefined && a.sortOrder > 0 ? a.sortOrder : 999999;
      const bOrder = b.sortOrder !== undefined && b.sortOrder > 0 ? b.sortOrder : 999999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [products, searchQuery, sortBy, brandFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Women&apos;s Watches...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <MouseTrail />

      {/* Back button */}
      <div className="text-left">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Men&apos;s Watches
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="glass-panel p-8 sm:p-12 relative overflow-hidden border border-gold-500/15 flex flex-col items-start justify-center space-y-4 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_50%,rgba(212,175,55,0.08),transparent_50%)] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-gold-400" />
          Feminine Elegance & Grace
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Women&apos;s <span className="gold-gradient-text">Luxury Watches</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-base max-w-2xl font-light leading-relaxed">
          Discover our curated collection of delicate rose gold, diamond halo bezels, and timeless luxury wristwatches crafted for the sophisticated woman.
        </p>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 pt-4 border-t border-gray-800/80 w-full max-w-lg">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span className="text-xs text-gray-300 font-medium">100% Genuine</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span className="text-xs text-gray-300 font-medium">Bespoke Warranties</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <Sparkles className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span className="text-xs text-gray-300 font-medium">Luxury Packaging</span>
          </div>
        </div>
      </div>

      {/* Catalog Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-900 pb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold">
            Women&apos;s Collection ({womensProducts.length} designs)
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64 md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search women's watches..."
              className="w-full pl-10 pr-10 py-2.5 bg-luxury-charcoal border border-gold-500/15 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 text-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gold-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full bg-luxury-charcoal border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-sm transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="all">All Brands</option>
              {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-luxury-charcoal border border-gold-500/15 text-white py-2.5 px-4 focus:outline-none focus:border-gold-500 text-sm transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="featured">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {womensProducts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-gold-500/10 rounded-lg max-w-xl mx-auto space-y-4">
          <p className="text-gold-500 text-lg font-medium font-serif">No Women&apos;s Watches Match</p>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any women&apos;s models matching your search criteria.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setBrandFilter("all"); setSortBy("featured"); }}
            className="px-6 py-2.5 bg-gold-500/10 text-gold-500 border border-gold-500/30 text-xs font-bold uppercase tracking-wider hover:bg-gold-500 hover:text-black transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {womensProducts.map((product) => {
          const favorite = isInWishlist(product.id);
          return (
            <div 
              key={product.id}
              className="glass-panel glass-panel-hover overflow-hidden flex flex-col group relative"
            >
              {/* Discount Badge */}
              {(product.discount || (product.originalPrice && product.originalPrice > product.price)) && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 z-20 shadow-lg rounded-sm border border-red-400/30">
                  {product.discount || `${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF`}
                </span>
              )}

              {/* Tag Overlay */}
              {product.tag && (
                <span className={`absolute top-4 ${(product.discount || (product.originalPrice && product.originalPrice > product.price)) ? "left-24 sm:left-28" : "left-4"} bg-gold-600/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest uppercase px-2.5 py-1 z-20`}>
                  {product.tag}
                </span>
              )}

              {/* Wishlist Toggle Button */}
              <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/20 hover:border-gold-500/50 hover:bg-black/90 text-gold-500 transition-all shadow-md"
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${favorite ? "fill-gold-500" : ""}`} />
              </button>

              {/* Product Image Container */}
              <Link href={`/product/${product.id}`} className="relative h-72 w-full overflow-hidden bg-black flex items-center justify-center border-b border-gold-500/10">
                <Image 
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  className="object-cover scale-100 group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* View Details Hover Card Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-gold-500 text-black px-5 py-3 font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-4 h-4" />
                    Explore Details
                  </div>
                </div>
              </Link>

              {/* Product Metadata */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                    <span>Women&apos;s Hand Watch</span>
                    {product.brand && <span className="text-gray-400 font-medium">{product.brand}</span>}
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-serif text-lg font-bold group-hover:text-gold-400 transition-colors text-white">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Rating Reviews */}
                <div className="flex items-center gap-1.5 text-xs text-gold-500">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-gold-500" : "text-gray-700"}`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white pl-1">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>

                {/* Available colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold">Colors:</span>
                    {product.colors.map((c, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-300 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price and Action Button */}
                <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {product.originalPrice && product.originalPrice > product.price ? "Special Offer" : "Price starting at"}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-xl font-bold text-gold-400">Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through text-xs font-mono">Rs. {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/product/${product.id}`}
                    className="p-2.5 rounded-none border border-gold-500/30 text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

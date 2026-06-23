"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Star, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ShoppingBag, 
  Eye, 
  MessageSquare,
  ChevronRight,
  RefreshCw,
  Heart,
  Smartphone
} from "lucide-react";
import { reviews, Product } from "../data";
import { useProducts } from "../context/ProductsContext";
import { useWishlist } from "../context/WishlistContext";

export default function Home() {
  const { products, isLoading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filtered featured products (maximum 3 items for home showcase)
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading SWC Curation...</p>
      </div>
    );
  }



  const getWhatsAppLink = (productName: string) => {
    const text = encodeURIComponent(`Hi Saleem Watch Center, I am highly interested in the "${productName}" from swc.com. Please share availability and delivery options!`);
    return `https://wa.me/923212200321?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans relative">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract gold dust backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.08),rgba(0,0,0,0))] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs sm:text-sm tracking-wider font-semibold uppercase animate-pulse">
              <Award className="w-4 h-4" />
              Pakistan's Premier Luxury Watch Dealer
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-tight font-extrabold tracking-tight">
              Crafting <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Timeless Legacy</span> <br />
              For Generations.
            </h1>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
              Explore our curation of world-class hand watches and luxurious wall clocks. At Saleem Watch Center, precision meets gold-standard aesthetics, creating statements that outlive time.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/hand-watch" 
                className="gold-gradient-bg hover:opacity-90 text-black px-8 py-4 rounded-none font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)]"
              >
                Explore Hand Watches
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/wall-clock" 
                className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black px-8 py-4 rounded-none font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Wall Clocks
                <Clock className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro details stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-8 border-t border-gray-800 w-full max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">25+</p>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Years of Trust</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">12k+</p>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Happy Clients</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">100%</p>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Genuine Care</p>
              </div>
            </div>
            
          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px]">
              
              {/* Outer decorative gold rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-gold-500/20 animate-[spin_120s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-gold-500/10 animate-[spin_80s_linear_infinite]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] animate-gold-glow rounded-full" />
              
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-gold-500/30 bg-neutral-950 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <Image 
                  src="/images/hero_luxury_watch.png"
                  alt="SWC Royale Premium Watch"
                  fill
                  priority
                  className="object-cover scale-105 hover:scale-115 transition-transform duration-700"
                  sizes="(max-w-768px) 280px, 420px"
                />
              </div>

              {/* Floating micro accent card */}
              <div className="absolute -bottom-4 -left-4 glass-panel py-3 px-4 flex items-center gap-3 animate-bounce">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400">
                  <Star className="w-4 h-4 fill-gold-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Model Choice</p>
                  <p className="text-xs font-bold text-gold-400">SWC Royale Chrono</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* 2. Highlighted Categories */}
      <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-900 bg-black/40">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <p className="text-gold-500 text-xs sm:text-sm tracking-widest uppercase font-semibold">Exquisite Collections</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider">
              Browse By Category
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-6">
            
            {/* Category: Hand Watches */}
            <Link 
              href="/hand-watch"
              className="relative h-96 group overflow-hidden cursor-pointer border border-gold-500/10 glass-panel-hover flex flex-col justify-end p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <Image 
                src="/images/gold_chronograph.png"
                alt="Hand Watches Collection"
                fill
                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                sizes="(max-w-768px) 100vw, 500px"
              />
              <div className="z-20 text-left space-y-2">
                <span className="bg-gold-500 text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
                  Wrist Prestige
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Hand Watches
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm max-w-sm font-light">
                  Chrono dials, minimal aesthetics, and automatic mechanical complications engineered for executive elegance.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-bold uppercase pt-2 group-hover:translate-x-2 transition-transform">
                  Explore Collection
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Category: Wall Clocks */}
            <Link 
              href="/wall-clock"
              className="relative h-96 group overflow-hidden cursor-pointer border border-gold-500/10 glass-panel-hover flex flex-col justify-end p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <Image 
                src="/images/sunburst_clock.png"
                alt="Premium Wall Clocks Collection"
                fill
                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                sizes="(max-w-768px) 100vw, 500px"
              />
              <div className="z-20 text-left space-y-2">
                <span className="bg-gold-500 text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
                  Space Aesthetics
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Wall Clocks
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm max-w-sm font-light">
                  Modern geometric layouts, sunburst artwork, and completely silent movements designed to enhance luxury interiors.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-gold-400 font-bold uppercase pt-2 group-hover:translate-x-2 transition-transform">
                  Explore Collection
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. Featured Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-900 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-gold-500 text-xs sm:text-sm tracking-widest uppercase font-semibold">SWC Masterpieces</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Featured Timepieces
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const favorite = isInWishlist(product.id);
              return (
                <div 
                  key={product.id}
                  className="glass-panel glass-panel-hover overflow-hidden flex flex-col group relative"
                >
                  
                  {/* Tag Overlay */}
                  {product.tag && (
                    <span className="absolute top-4 left-4 bg-gold-600/90 backdrop-blur-sm text-black text-[9px] font-black tracking-widest uppercase px-2.5 py-1 z-20">
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

                  {/* Product Image Container (wrapping standard Next.js Link) */}
                  <Link href={`/product/${product.id}`} className="relative h-72 w-full overflow-hidden bg-black flex items-center justify-center border-b border-gold-500/10">
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-108 transition-transform duration-500 ease-out"
                      sizes="(max-w-768px) 100vw, 380px"
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
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                        {product.category === "hand-watches" ? "Hand Watch" : "Premium Wall Clock"}
                      </p>
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

                    {/* Price and Action Button */}
                    <div className="flex items-center justify-between border-t border-gray-900 pt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Price starting at</span>
                        <span className="font-serif text-xl font-bold text-gold-400">Rs. {product.price.toLocaleString()}</span>
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
      </section>



      {/* 5. Heritage Overview Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 bg-gold-500/5 blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="relative h-60 w-full overflow-hidden border border-gold-500/20 shadow-lg">
                <Image 
                  src="/images/classic_gold.png" 
                  alt="Crafting wrist watches"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="240px"
                />
              </div>
              <div className="glass-panel p-6 text-center space-y-1">
                <Award className="w-6 h-6 text-gold-500 mx-auto" />
                <p className="font-serif text-lg font-bold text-gold-400">Est. 2001</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Heritage & Pride</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="glass-panel p-6 text-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-gold-500 mx-auto" />
                <p className="font-serif text-lg font-bold text-gold-400">100% Genuine</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Original Warranties</p>
              </div>
              <div className="relative h-60 w-full overflow-hidden border border-gold-500/20 shadow-lg">
                <Image 
                  src="/images/modern_geometric_clock.png" 
                  alt="Crafting wall clocks"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="240px"
                />
              </div>
            </div>

          </div>

          <div className="lg:col-span-7 text-left space-y-6">
            <p className="text-gold-500 text-xs sm:text-sm tracking-widest uppercase font-semibold">The Saleem Heritage</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Honoring 25 Years of <br />
              <span className="gold-gradient-text">Horological Mastery</span>
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mt-2" />
            
            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              Founded on the pillars of authenticity, precision, and luxury, Saleem Watch Center has served generations of discerning watch collectors and decorators. What began as a boutique repair workshop in 2001 has blossomed into Pakistan’s premier destination for luxury wristwatches and artful wall clocks.
            </p>
            
            <div className="flex gap-4 pt-2">
              <Link 
                href="/about"
                className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase px-6 py-3.5 shadow-md flex items-center gap-1.5 hover:opacity-90"
              >
                Read Our Story
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://wa.me/923212200321?text=Hi%20Saleem%20Watch%20Center%2C%20I%20would%20like%20to%20inquire%20about%20your%20showroom%20location%20and%20timings."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors px-6 py-3.5 font-bold text-xs uppercase tracking-widest text-center"
              >
                Find Our Showroom
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Reviews Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-900 bg-black/40">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <p className="text-gold-500 text-xs sm:text-sm tracking-widest uppercase font-semibold">Client Endorsements</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Trusted by True Connoisseurs
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div 
                key={index}
                className="glass-panel p-8 text-left flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                {/* Background quote mark ornament */}
                <span className="absolute -top-6 -right-2 text-[150px] text-gold-500/5 font-serif select-none pointer-events-none">“</span>
                
                {/* Stars */}
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-500" />
                  ))}
                </div>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic font-light flex-grow">
                  "{rev.text}"
                </p>

                <div className="border-t border-gray-900 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                    <span className="font-serif text-gold-400 font-bold">{rev.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{rev.name}</h4>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

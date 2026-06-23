"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  Star, 
  MessageSquare, 
  ChevronLeft, 
  Smartphone, 
  Clock, 
  Award,
  ShieldCheck,
  Truck,
  Sparkles,
  Eye,
  ArrowRight
} from "lucide-react";
import { useProducts } from "../../../context/ProductsContext";
import { useWishlist } from "../../../context/WishlistContext";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const { products, isLoading } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Find the product
  const product = products.find(p => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Timepiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-gold-500">Timepiece Not Found</h1>
        <p className="text-gray-400 text-sm max-w-md">
          The requested timepiece model ID "{id}" could not be located in Saleem Watch Center's catalog.
        </p>
        <Link 
          href="/" 
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3.5"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const isHandWatch = product.category === "hand-watches";
  const favorite = isInWishlist(product.id);

  // Get up to 3 related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const getWhatsAppLink = (productName: string) => {
    const text = encodeURIComponent(`Hi Saleem Watch Center, I am highly interested in purchasing the "${productName}" from swc.com. Please share availability details!`);
    return `https://wa.me/923212200321?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
      
      {/* Navigation breadcrumbs */}
      <div>
        <Link 
          href={isHandWatch ? "/hand-watch" : "/wall-clock"} 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {isHandWatch ? "Hand Watches" : "Wall Clocks"}
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Image Column */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[480px] lg:h-[550px] w-full bg-black border border-gold-500/15 overflow-hidden flex items-center justify-center group shadow-2xl">
          <Image 
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-w-1024px) 100vw, 600px"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-gold-600 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 z-10">
              {product.tag}
            </span>
          )}
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-[10px] text-gold-400 uppercase tracking-widest font-black">
              {isHandWatch ? <Smartphone className="w-3.5 h-3.5 text-gold-500" /> : <Clock className="w-3.5 h-3.5 text-gold-500" />}
              {isHandWatch ? "Executive Wristwatch" : "Luxury Wall Clock"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 text-xs text-gold-500 pt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-gold-500 text-gold-500" : "text-gray-700"}`} 
                  />
                ))}
              </div>
              <span className="font-bold text-white pl-1">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="border-y border-gray-900 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Premium Price</span>
              <span className="font-serif text-3xl font-bold text-gold-400">Rs. {product.price.toLocaleString()}</span>
            </div>
            
            {/* Wishlist Button */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex items-center gap-2 border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all ${favorite ? "bg-gold-500/10 border-gold-500 text-gold-500" : "border-gray-800 text-gray-400 hover:border-gold-500/50 hover:text-gold-400"}`}
            >
              <Heart className={`w-4 h-4 ${favorite ? "fill-gold-500" : ""}`} />
              {favorite ? "Saved in Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
            {product.description}
          </p>

          {/* Luxury badges check */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-900 pb-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>100% Genuine Caliber</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>SWC Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <span>Secure Shipping Insured</span>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest border-b border-gray-900 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-500" />
              Technical Specifications
            </h3>
            <div className="border border-gold-500/10 divide-y divide-gray-900">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div key={specKey} className="grid grid-cols-2 p-3 text-xs bg-luxury-charcoal/20">
                  <span className="text-gray-500 font-light">{specKey}</span>
                  <span className="text-gray-300 font-medium text-right">{specVal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={getWhatsAppLink(product.name)}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-grow gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-4 text-center flex items-center justify-center gap-2 hover:opacity-90 shadow-[0_4px_25px_rgba(212,175,55,0.25)]"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              Inquire on WhatsApp
            </a>
            <button 
              onClick={() => {
                const text = encodeURIComponent(`Hi Saleem Watch Center, I would like to schedule a phone consultation for the timepiece "${product.name}".`);
                window.open(`https://wa.me/923212200321?text=${text}`, "_blank");
              }}
              className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all px-6 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Request Consultation
            </button>
          </div>

        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-900 pt-16 space-y-8">
          <div className="text-left space-y-2">
            <p className="text-gold-500 text-xs tracking-widest uppercase font-semibold">Carefully Curated</p>
            <h2 className="font-serif text-2xl font-bold">Related Masterpieces</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => {
              const relFavorite = isInWishlist(relProduct.id);
              return (
                <div 
                  key={relProduct.id}
                  className="glass-panel glass-panel-hover overflow-hidden flex flex-col group relative"
                >
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(relProduct.id); }}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 border border-gold-500/20 text-gold-500 shadow-sm"
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${relFavorite ? "fill-gold-500" : ""}`} />
                  </button>

                  <Link href={`/product/${relProduct.id}`} className="relative h-60 w-full overflow-hidden bg-black flex items-center justify-center border-b border-gold-500/10">
                    <Image 
                      src={relProduct.image}
                      alt={relProduct.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 250px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-gold-500 text-black px-4 py-2 font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 space-y-3 flex flex-col justify-between flex-grow">
                    <div className="space-y-1">
                      <h4 className="font-serif text-md font-bold text-white group-hover:text-gold-400 transition-colors">
                        {relProduct.name}
                      </h4>
                      <p className="text-gold-400 text-xs font-serif font-semibold">
                        Rs. {relProduct.price.toLocaleString()}
                      </p>
                    </div>

                    <Link 
                      href={`/product/${relProduct.id}`}
                      className="text-[10px] font-extrabold text-gray-400 group-hover:text-gold-400 transition-all uppercase tracking-widest flex items-center gap-1 pt-2 border-t border-gray-900"
                    >
                      View Timepiece
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}

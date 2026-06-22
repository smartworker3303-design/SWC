"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  Trash2, 
  MessageSquare, 
  Eye, 
  ArrowRight,
  ChevronLeft,
  ShoppingBag
} from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistPage() {
  const { products, isLoading } = useProducts();
  const { wishlist, toggleWishlist } = useWishlist();

  // Find all items in products that are in the user's wishlist
  const savedItems = products.filter(p => wishlist.includes(p.id));

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-gold-500 animate-spin" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Loading Saved Items...</p>
      </div>
    );
  }

  const getWhatsAppLink = (productName: string) => {
    const text = encodeURIComponent(`Hi Saleem Watch Center, I would like to inquire about the availability of "${productName}" from my swc.com wishlist.`);
    return `https://wa.me/923000000000?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
      
      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold-400 font-bold uppercase transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          Saved Collections
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          My Saved <span className="gold-gradient-text">Timepieces</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
          Manage your favorite designs, compare technical specifications, or contact our private client team to check store availability.
        </p>
      </div>

      {/* Empty State */}
      {savedItems.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gold-500/10 max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-gold-500/15 flex items-center justify-center mx-auto text-gold-500/40">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold">Your Wishlist is Empty</h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto font-light leading-relaxed">
              Explore Saleem Watch Center collections and save hand watches or wall clocks that catch your eye.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <Link 
              href="/hand-watch" 
              className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3"
            >
              Hand Watches
            </Link>
            <Link 
              href="/wall-clock" 
              className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors px-6 py-3 text-xs font-bold uppercase tracking-widest"
            >
              Wall Clocks
            </Link>
          </div>
        </div>
      ) : (
        /* Saved items list */
        <div className="space-y-8">
          <div className="border-b border-gray-900 pb-4">
            <h2 className="font-serif text-xl font-semibold">Saved Items ({savedItems.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedItems.map((product) => {
              return (
                <div 
                  key={product.id}
                  className="glass-panel glass-panel-hover overflow-hidden flex flex-col group relative"
                >
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-gold-500/15 text-red-400 hover:text-red-500 transition-colors shadow-sm"
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Product Image Link */}
                  <Link href={`/product/${product.id}`} className="relative h-64 w-full overflow-hidden bg-black flex items-center justify-center border-b border-gold-500/10">
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 380px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-gold-500 text-black px-4 py-2.5 font-extrabold text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        View Specs
                      </div>
                    </div>
                  </Link>

                  {/* Info and Actions */}
                  <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gold-400 font-bold uppercase tracking-widest block">
                        {product.category === "hand-watches" ? "Wristwatch" : "Wall Clock"}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <h4 className="font-serif text-lg font-bold text-white group-hover:text-gold-400 transition-colors leading-tight">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="font-serif text-md font-bold text-gold-400 pt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-3 border-t border-gray-900">
                      <a 
                        href={getWhatsAppLink(product.name)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="gold-gradient-bg text-black font-extrabold text-xs tracking-widest uppercase py-3 text-center flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4 fill-black" />
                        Inquire Price
                      </a>
                      
                      <Link 
                        href={`/product/${product.id}`}
                        className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black py-3 text-center text-xs font-bold uppercase tracking-widest transition-all"
                      >
                        Full Details
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Heart, 
  Menu, 
  X
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist } = useWishlist();
  const pathname = usePathname();
  if (pathname === "/admin-panel") return null;

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all">
            <span className="font-serif text-lg font-bold text-gold-500 tracking-wider">SWC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-lg tracking-widest font-extrabold gold-gradient-text uppercase">
              Saleem Watch Center
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest font-light -mt-1">
              EST. 2001 • SWC.COM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <Link 
            href="/" 
            className={`transition-colors ${isLinkActive("/") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Home
          </Link>
          <Link 
            href="/hand-watch" 
            className={`transition-colors ${isLinkActive("/hand-watch") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Hand Watches
          </Link>
          <Link 
            href="/wall-clock" 
            className={`transition-colors ${isLinkActive("/wall-clock") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Wall Clocks
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors ${isLinkActive("/about") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Our Legacy
          </Link>
        </nav>

        {/* Actions (Wishlist & Hamburger) */}
        <div className="flex items-center gap-4">
          
          {/* Wishlist Link */}
          <Link 
            href="/wishlist" 
            className="relative cursor-pointer group p-2 rounded-full hover:bg-gold-500/10 transition-colors"
            aria-label="View Wishlist"
          >
            <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${wishlist.length > 0 ? "fill-gold-500 text-gold-500" : "text-gray-300"}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-600 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-full hover:bg-gold-500/10 text-gold-500 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-gold-500/10 absolute top-20 left-0 w-full animate-fade-in-up py-6 px-4 flex flex-col gap-4 shadow-2xl">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 border-b border-gray-800 text-center tracking-widest font-medium text-sm ${isLinkActive("/") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Home
          </Link>
          <Link 
            href="/hand-watch" 
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 border-b border-gray-800 text-center tracking-widest font-medium text-sm ${isLinkActive("/hand-watch") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Hand Watches
          </Link>
          <Link 
            href="/wall-clock" 
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 border-b border-gray-800 text-center tracking-widest font-medium text-sm ${isLinkActive("/wall-clock") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Wall Clocks
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 text-center tracking-widest font-medium text-sm ${isLinkActive("/about") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
          >
            Our Legacy
          </Link>
        </div>
      )}
    </header>
  );
}

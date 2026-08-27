"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart,
  ShoppingBag,
  User,
  LogOut
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (pathname === "/admin-panel") return null;

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-0 md:h-20 flex flex-wrap md:flex-nowrap items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group order-1">
          <div className="w-10 h-10 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all">
            <span className="font-serif text-lg font-bold text-gold-500 tracking-wider">SWC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-lg tracking-widest font-extrabold gold-gradient-text uppercase">
              Saleem Watch Center
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest font-light -mt-1">
              EST. 1984 • SWC.COM
            </span>
          </div>
        </Link>

        {/* Desktop & Mobile Navigation Links */}
        <nav className="flex items-center justify-between sm:justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium order-3 md:order-2 w-full md:w-auto mt-3 md:mt-0 pb-1 md:pb-0 overflow-x-auto md:overflow-visible no-scrollbar whitespace-nowrap">
          <Link 
            href="/" 
            className={`transition-colors py-1 ${isLinkActive("/") ? "text-gold-500 font-bold" : "text-gray-300 hover:text-gold-500"}`}
          >
            Men&apos;s Watches
          </Link>
          <Link 
            href="/women-watch" 
            className={`transition-colors py-1 ${isLinkActive("/women-watch") ? "text-gold-500 font-bold" : "text-gray-300 hover:text-gold-500"}`}
          >
            Women&apos;s Watches
          </Link>
          <Link 
            href="/wall-clock" 
            className={`transition-colors py-1 ${isLinkActive("/wall-clock") ? "text-gold-500 font-bold" : "text-gray-300 hover:text-gold-500"}`}
          >
            Wall Clocks
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors py-1 ${isLinkActive("/about") ? "text-gold-500 font-bold" : "text-gray-300 hover:text-gold-500"}`}
          >
            Our Legacy
          </Link>
        </nav>

        {/* Actions (Wishlist & Profile) */}
        <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3">
          
          {/* Cart Link (formerly Wishlist) */}
          <Link 
            href="/wishlist" 
            className="relative cursor-pointer group p-2 rounded-full hover:bg-gold-500/10 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingCart className={`w-5 h-5 transition-transform group-hover:scale-110 ${wishlist.length > 0 ? "text-gold-500" : "text-gray-300"}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-600 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Auth & Orders Buttons */}
          {user ? (
            <div className="flex items-center gap-1">
              <Link 
                href="/my-orders"
                className="relative cursor-pointer group p-2 rounded-full hover:bg-gold-500/10 transition-colors"
                aria-label="My Orders"
                title="My Orders"
              >
                <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-gold-500 transition-colors" />
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative cursor-pointer group p-2 rounded-full hover:bg-gold-500/10 transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5 text-gray-300 group-hover:text-gold-500 transition-colors" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-gold-500/20 shadow-2xl py-4 px-4 flex flex-col gap-3 z-50">
                    <div className="flex flex-col border-b border-gray-800 pb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Email</span>
                      <span className="text-xs text-gray-200 truncate font-medium">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex flex-col border-b border-gray-800 pb-3">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Phone</span>
                        <span className="text-xs text-gray-200 font-medium">{user.phone}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 mt-1 w-full py-2 bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest rounded-sm"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href="/login"
              className="relative cursor-pointer group p-2 rounded-full hover:bg-gold-500/10 transition-colors"
              aria-label="Sign In"
            >
              <User className="w-5 h-5 text-gray-300 group-hover:text-gold-500 transition-colors" />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart,
  ShoppingBag,
  Menu, 
  X,
  User,
  LogOut
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              EST. 1984 • SWC.COM
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
          <div className="relative group py-2">
            <Link 
              href="/hand-watch" 
              className={`transition-colors ${isLinkActive("/hand-watch") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"}`}
            >
              Hand Watches
            </Link>
            <div className="absolute top-full left-0 mt-0 w-48 bg-black/95 backdrop-blur-md border border-gold-500/20 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
              <Link 
                href="/hand-watch?subcat=mens" 
                className="px-4 py-2.5 text-xs text-gray-300 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
              >
                Men Watches
              </Link>
              <Link 
                href="/hand-watch?subcat=womens" 
                className="px-4 py-2.5 text-xs text-gray-300 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
              >
                Women Watches
              </Link>
            </div>
          </div>
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
          <div className="flex justify-center gap-4 pb-2 border-b border-gray-800">
            <Link 
              href="/hand-watch?subcat=mens" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-gray-400 hover:text-gold-500 tracking-widest uppercase font-medium"
            >
              Men Watches
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              href="/hand-watch?subcat=womens" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-gray-400 hover:text-gold-500 tracking-widest uppercase font-medium"
            >
              Women Watches
            </Link>
          </div>
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
          
          {/* Mobile Auth */}
          <div className="pt-4 border-t border-gray-800 flex justify-center">
            {user ? (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gold-500 tracking-widest uppercase font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gold-500 tracking-widest uppercase font-medium"
              >
                <User className="w-4 h-4" />
                Client Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

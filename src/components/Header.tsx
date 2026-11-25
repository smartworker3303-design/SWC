"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart,
  ShoppingBag,
  User,
  LogOut,
  Package
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { orders: allOrders } = useOrders();
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin-panel")) return null;

  const userOrders = (allOrders || []).filter(o => 
    user && (
      o.user_id === user.id || 
      o.user_id === user.email || 
      (user.phone && o.phone === user.phone)
    )
  );

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  // Close profile dropdown whenever route changes
  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

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
                {userOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-600 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {userOrders.length}
                  </span>
                )}
              </Link>
              
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`relative cursor-pointer group p-2 rounded-full transition-colors ${
                    profileOpen ? "bg-gold-500/20 text-gold-500" : "hover:bg-gold-500/10 text-gray-300"
                  }`}
                  aria-label="Profile"
                  aria-expanded={profileOpen}
                >
                  <User className={`w-5 h-5 transition-colors ${profileOpen ? "text-gold-500" : "group-hover:text-gold-500"}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-2rem)] bg-black/95 backdrop-blur-md border border-gold-500/30 shadow-2xl py-4 px-4 flex flex-col gap-3 z-50 rounded-sm">
                    <div className="flex flex-col border-b border-gray-800 pb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Email</span>
                      <span className="text-xs text-gray-200 truncate font-medium" title={user.email}>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex flex-col border-b border-gray-800 pb-3">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Phone</span>
                        <span className="text-xs text-gray-200 font-medium">{user.phone}</span>
                      </div>
                    )}

                    {/* My Orders Button */}
                    <Link 
                      href="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between w-full py-2.5 px-3 bg-gold-500 text-black hover:bg-gold-400 transition-all duration-200 text-xs font-bold uppercase tracking-wider rounded-sm shadow-[0_0_12px_rgba(212,175,55,0.25)] group"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>My Orders</span>
                      </div>
                      {userOrders.length > 0 ? (
                        <span className="bg-black text-gold-400 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                          {userOrders.length}
                        </span>
                      ) : (
                        <span className="text-black/70 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                      )}
                    </Link>

                    {/* Sign Out Button */}
                    <button 
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-black border border-gold-500/20 hover:border-gold-500 transition-colors text-xs font-bold uppercase tracking-widest rounded-sm"
                    >
                      <LogOut className="w-3.5 h-3.5" />
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

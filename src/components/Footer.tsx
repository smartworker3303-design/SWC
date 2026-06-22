"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  
  // Exclude footer on admin panel
  if (pathname === "/admin-panel") return null;

  return (
    <footer className="relative bg-gradient-to-b from-[#0a0a0a] to-[#030303] border-t border-gold-500/10 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-left">
      {/* Premium ambient gold glow in the background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Legacy (Grid span: 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gold-500 flex items-center justify-center bg-black/60 shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <span className="font-serif text-sm font-bold text-gold-500 tracking-wider">SWC</span>
              </div>
              <span className="font-serif text-lg tracking-widest font-extrabold gold-gradient-text uppercase">
                Saleem Watch Center
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Curating exceptional hand watches and artful wall clocks since 2001. We provide horological precision wrapped in black & gold elegance. Experience over 25 years of trust and craftsmanship.
            </p>
            
            {/* Social Media Link Icons - Premium Gold Border Glow and Roll Hover */}
            <div className="flex items-center gap-3 pt-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full border border-gold-500/20 hover:border-gold-500 bg-neutral-900/60 text-gold-500 hover:text-black hover:bg-gold-500 transition-all duration-300 flex items-center justify-center shadow-md shadow-black/50"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full border border-gold-500/20 hover:border-gold-500 bg-neutral-900/60 text-gold-500 hover:text-black hover:bg-gold-500 transition-all duration-300 flex items-center justify-center shadow-md shadow-black/50"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full border border-gold-500/20 hover:border-gold-500 bg-neutral-900/60 text-gold-500 hover:text-black hover:bg-gold-500 transition-all duration-300 flex items-center justify-center shadow-md shadow-black/50"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.025 0 12 0 12s0 3.975.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.474 20.455 12 20.455 12 20.455s7.524 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Grid span: 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-gold-500/10 pb-2">
              Collections
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400 font-light">
              <Link href="/hand-watch" className="hover:text-gold-500 hover:pl-1 transition-all duration-200">
                Premium Hand Watches
              </Link>
              <Link href="/wall-clock" className="hover:text-gold-500 hover:pl-1 transition-all duration-200">
                Luxury Wall Clocks
              </Link>
              <Link href="/about" className="hover:text-gold-500 hover:pl-1 transition-all duration-200">
                Our 25-Year Legacy
              </Link>
              <Link href="/wishlist" className="hover:text-gold-500 hover:pl-1 transition-all duration-200 flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-gold-500" />
                <span>My Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Column 3: Showroom & Hours (Grid span: 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-gold-500/10 pb-2">
              Showroom Details
            </h4>
            <div className="space-y-3.5 text-xs text-gray-400 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Ground Floor, SWC Plaza, Mall Road, Lahore, Pakistan</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="hover:text-gold-500 transition-colors">concierge@swc.com</span>
              </div>

              <div className="flex items-start gap-3 pt-1 border-t border-neutral-900/60">
                <Clock className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-[11px]">Monday - Saturday</span>
                  <span className="text-[10px] text-gray-500">11:00 AM - 9:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Subscriber (Grid span: 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-gold-500/10 pb-2">
              Private Alerts
            </h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Subscribe to receive private alerts regarding limited edition restocks and exclusive vintage catalog drops.
            </p>
            
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                alert("Successfully joined private SWC alerts."); 
                (e.target as HTMLFormElement).reset(); 
              }}
              className="flex flex-col sm:flex-row border border-gold-500/20 max-w-sm overflow-hidden"
            >
              <input 
                type="email" 
                required
                placeholder="Your email address" 
                className="bg-black text-xs text-white px-3 py-3 focus:outline-none flex-grow w-full border-0 focus:ring-0 placeholder-gray-600 focus:bg-neutral-900/50 transition-all"
              />
              <button 
                type="submit" 
                className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest px-4 py-3 transition-all hover:opacity-90 flex-shrink-0 cursor-pointer flex items-center justify-center gap-1 sm:w-auto w-full"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 font-light gap-4">
          <p>© {new Date().getFullYear()} Saleem Watch Center. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
            <a href="https://swc.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">SWC.COM Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

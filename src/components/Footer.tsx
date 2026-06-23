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
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://www.google.com/maps/place/Saleem+watch+Center/@24.9017659,67.1933494,17z/data=!3m1!4b1!4m6!3m5!1s0x3eb33700354c175b:0xebc964e9c1b0082a!8m2!3d24.9017659!4d67.1933494!16s%2Fg%2F11wwbq8sv7!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gold-500 transition-colors leading-relaxed"
                  >
                    <span className="text-white font-medium block text-[11px]">Model Colony Branch</span>
                    Model Colony, Karachi
                  </a>
                  <a 
                    href="https://www.google.com/maps/place/24%C2%B053'35.5%22N+67%C2%B011'40.9%22E/@24.8931852,67.1921059,17z/data=!3m1!4b1!4m4!3m3!8m2!3d24.8931852!4d67.1946808?hl=en&entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-gold-500 transition-colors leading-relaxed"
                  >
                    <span className="text-white font-medium block text-[11px]">Liaquat Market Branch</span>
                    Liaquat Market, Malir, Karachi
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <a href="tel:+923212200321" className="hover:text-gold-500 transition-colors">+92 321 2200321</a>
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

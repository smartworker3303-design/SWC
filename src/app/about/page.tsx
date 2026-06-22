"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Award, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left">
      
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
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Established in 2001 (25 Years of Luxury)
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          The Legacy of <br />
          <span className="gold-gradient-text">Saleem Watch Center</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
          For a quarter of a century, we have served as the benchmark for luxury timepieces and wall decor in Pakistan, combining deep horological technical knowledge with custom client experiences.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Story copy */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            An Uncompromising Journey in Precision
          </h2>
          <div className="w-16 h-0.5 bg-gold-500" />
          
          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            Founded in 2001 by Saleem Akhter, Saleem Watch Center (SWC) emerged from a passion for precision engineering and luxury aesthetics. Over the last 25 years, our boutique showroom has grown from a specialized restoration workshop into a grand sanctuary for horological enthusiasts, offering an unparalleled collection of premium timepieces.
          </p>

          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            Over the past two and a half decades, we have expanded our curation to catalog premium hand watches and luxury wall clocks. Today, SWC serves collectors, designers, and decorators across the country. Each clock and watch in our store is individually checked for calibration and timing accuracy by our in-house watchmakers.
          </p>

          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            Whether you are looking for an executive chronograph watch to mark a milestone, an automatic skeleton watch, or a geometric wall clock to redefine your living space, Saleem Watch Center offers the gold standard.
          </p>
        </div>

        {/* Story visuals */}
        <div className="lg:col-span-5 relative h-96 w-full bg-black border border-gold-500/15 overflow-hidden flex items-center justify-center shadow-2xl">
          <Image 
            src="/images/hero_luxury_watch.png"
            alt="SWC Watchmaking Heritage"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-w-1024px) 100vw, 500px"
          />
        </div>

      </div>

      {/* Value Pillars Grid */}
      <section className="space-y-8 border-t border-gray-900 pt-16">
        <div className="text-center space-y-2">
          <p className="text-gold-500 text-xs tracking-widest uppercase font-semibold">SWC Standards</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Our Core Philosophy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 space-y-4 hover:border-gold-500/35 transition-all text-left">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold">100% Authenticity Guaranteed</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              We directly source our watches and clocks from authorized manufacturers and verified collectors. We never sell replicas or grey-market timepieces.
            </p>
          </div>

          <div className="glass-panel p-8 space-y-4 hover:border-gold-500/35 transition-all text-left">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold">Certified Calibration</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Our in-house watchmakers inspect every wristwatch movement and clock gear before it enters your home. Accuracy is non-negotiable at Saleem Watch Center.
            </p>
          </div>

          <div className="glass-panel p-8 space-y-4 hover:border-gold-500/35 transition-all text-left">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold">Lifetime Consultations</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Our support does not end at checkout. From battery replacements to mounting support or luxury watch cleaning, SWC is by your side.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <div className="glass-panel p-8 sm:p-12 border border-gold-500/20 text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5 pointer-events-none" />
        <h3 className="font-serif text-xl sm:text-2xl font-bold">Looking for a Signature Timepiece?</h3>
        <p className="text-gray-400 text-xs sm:text-sm max-w-lg mx-auto">
          Browse our categories or send an inquiry to schedule a private client phone consultation with an adviser.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/hand-watch" 
            className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 shadow-md hover:scale-105 transition-all flex items-center gap-1"
          >
            Hand Watches
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a 
            href="https://wa.me/923000000000?text=Hi%20Saleem%20Watch%20Center%2C%20I%20would%20like%20to%20connect%20with%20your%20private%20client%20concierge."
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-all px-6 py-3 text-xs font-bold uppercase tracking-widest text-center"
          >
            Contact Concierge
          </a>
        </div>
      </div>

    </div>
  );
}

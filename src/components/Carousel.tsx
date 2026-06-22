"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
}

const slides: Slide[] = [
  {
    id: "hw-royale",
    title: "SWC Royale Chrono",
    subtitle: "Signature series mechanical skeleton timepiece electroplated in 24K gold.",
    image: "/images/hero_luxury_watch.png",
    link: "/product/hw-royale",
    tag: "SIGNATURE TIMEPIECE"
  },
  {
    id: "wc-sunburst",
    title: "Solaris Gold Sunburst",
    subtitle: "Bespoke brass sunburst design with silent quartz sweep movements.",
    image: "/images/sunburst_clock.png",
    link: "/product/wc-sunburst",
    tag: "LUXURY WALL ART"
  },
  {
    id: "hw-gold-chronograph",
    title: "The Sovereign Gold Chrono",
    subtitle: "Premium Swiss caliber chronograph with hand-stitched Italian black leather.",
    image: "/images/gold_chronograph.png",
    link: "/product/hw-gold-chronograph",
    tag: "ELITE COLLECTION"
  }
];

export default function Carousel() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // If on admin panel, do not render the carousel
  if (pathname === "/admin-panel") return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Bulletproof Autoplay: Starts on mount, runs every 3 seconds, cannot be paused or stuck by cursor hover/scroll state
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Touch Swipe Handlers for Mobile responsiveness (advances slide without pausing timer)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diffX > minSwipeDistance) {
      nextSlide();
    } else if (diffX < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to determine inline styles for smooth direction-aware horizontal sliding
  const getSlideStyles = (index: number): React.CSSProperties => {
    const isActive = index === currentIndex;
    const isLeft = index === (currentIndex - 1 + slides.length) % slides.length;
    
    let transform = "translateX(100%)";
    let opacity = 0;
    let zIndex = 0;
    let pointerEvents: "auto" | "none" = "none";
    
    if (isActive) {
      transform = "translateX(0)";
      opacity = 1;
      zIndex = 10;
      pointerEvents = "auto";
    } else if (isLeft) {
      transform = "translateX(-100%)";
      opacity = 0;
      zIndex = 0;
      pointerEvents = "none";
    }
    
    return {
      transform,
      opacity,
      zIndex,
      pointerEvents,
    };
  };

  return (
    <section 
      className="relative w-full overflow-hidden h-[300px] sm:h-[400px] md:h-[480px] lg:h-[550px] border-b border-gold-500/10 bg-black group"
      aria-label="Luxury Collections Carousel"
    >
      {/* CSS Styles block for custom horizontal slide transition & slide-specific animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slide-transition {
          transition: transform 1.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-royale-zoom {
          animation: royaleZoom 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-solaris-pan {
          animation: solarisPan 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-sovereign-reveal {
          animation: sovereignReveal 3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes royaleZoom {
          0% { transform: scale(1); filter: blur(3px); }
          100% { transform: scale(1.06); filter: blur(0); }
        }
        @keyframes solarisPan {
          0% { transform: scale(1.1) translateX(-12px); filter: brightness(0.85); }
          100% { transform: scale(1.03) translateX(0); filter: brightness(1); }
        }
        @keyframes sovereignReveal {
          0% { transform: scale(1.01) rotate(-1deg); filter: contrast(1.1); }
          100% { transform: scale(1.06) rotate(0deg); filter: contrast(1); }
        }
      `}} />

      {/* Stacked Slides Track */}
      <div 
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = currentIndex === index;
          
          // Determine the unique class for each slide image when it is active
          let animationClass = "";
          if (isActive) {
            if (index === 0) animationClass = "animate-royale-zoom";
            else if (index === 1) animationClass = "animate-solaris-pan";
            else if (index === 2) animationClass = "animate-sovereign-reveal";
          }

          return (
            <div 
              key={slide.id} 
              className="absolute inset-0 w-full h-full slide-transition"
              style={getSlideStyles(index)}
            >
              {/* Slide Background Image */}
              <div className="absolute inset-0 w-full h-full bg-neutral-950">
                <Image 
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  priority={index === 0} 
                  className={`object-cover w-full h-full opacity-70 ${animationClass}`}
                  sizes="100vw"
                />
              </div>

              {/* Premium Black and Gold Gradient Overlays for High Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-12 md:px-20 lg:px-32 max-w-7xl mx-auto w-full h-full">
                <div className="max-w-2xl text-left space-y-3 sm:space-y-5 animate-fade-in-up">
                  <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-gold-500 uppercase">
                    {slide.tag}
                  </span>
                  
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h2>
                  
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>
                  
                  <div className="pt-2 sm:pt-4">
                    <Link 
                      href={slide.link}
                      className="inline-flex items-center gap-2 gold-gradient-bg hover:opacity-90 text-black px-5 sm:px-6 py-2.5 sm:py-3.5 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
                    >
                      Discover Collection
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full border border-gold-500/20 bg-black/40 text-gold-500 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 opacity-75 md:opacity-0 md:group-hover:opacity-100 cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full border border-gold-500/20 bg-black/40 text-gold-500 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 opacity-75 md:opacity-0 md:group-hover:opacity-100 cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Navigation Dots / Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === index 
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-gold-500" 
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-500 hover:bg-gold-500/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

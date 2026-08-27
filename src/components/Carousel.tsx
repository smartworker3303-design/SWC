"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
}

const homeSlides: Slide[] = [
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

const mensSlides: Slide[] = [
  {
    id: "mens-hero-1",
    title: "Men's Executive Chrono",
    subtitle: "Precision engineering meets masculine elegance in our latest men's collection.",
    image: "/images/products/swc_product_11.webp",
    link: "/",
    tag: "MEN's COLLECTION"
  },
  {
    id: "mens-hero-2",
    title: "The Aviator Series",
    subtitle: "Dark, bold dials combined with premium metallic bands.",
    image: "/images/products/swc_product_13.webp",
    link: "/",
    tag: "SIGNATURE TIMEPIECE"
  },
  {
    id: "mens-hero-3",
    title: "Midnight Stealth",
    subtitle: "Built for endurance, styled for the boardroom.",
    image: "/images/products/swc_product_14.webp",
    link: "/",
    tag: "ELITE COLLECTION"
  }
];

const womensSlides: Slide[] = [
  {
    id: "womens-hero-1",
    title: "The Rose Gold Elegance",
    subtitle: "Delicate proportions and jewel-encrusted bezels for her.",
    image: "/images/products/swc_product_20.webp",
    link: "/women-watch",
    tag: "WOMEN's COLLECTION"
  },
  {
    id: "womens-hero-2",
    title: "Diamond Halo",
    subtitle: "Feminine sophistication radiating with timeless grace.",
    image: "/images/products/swc_product_21.webp",
    link: "/women-watch",
    tag: "LUXURY TIMEPIECE"
  },
  {
    id: "womens-hero-3",
    title: "Slimline Classic",
    subtitle: "Minimalist design crafted from the finest materials.",
    image: "/images/products/swc_product_24.webp",
    link: "/women-watch",
    tag: "ELITE COLLECTION"
  }
];

const wallClockSlides: Slide[] = [
  {
    id: "clock-hero-1",
    title: "Grand Masterpiece",
    subtitle: "Elevate your living space with our premium wall clocks.",
    image: "/images/products/swc_product_1.webp",
    link: "/wall-clock",
    tag: "WALL CLOCKS"
  },
  {
    id: "clock-hero-2",
    title: "Solaris Sunburst",
    subtitle: "A modern classic that captures the eye in any room.",
    image: "/images/products/swc_product_2.webp",
    link: "/wall-clock",
    tag: "LUXURY WALL ART"
  },
  {
    id: "clock-hero-3",
    title: "Minimalist Pendulum",
    subtitle: "Sleek metallic finish with silent sweep technology.",
    image: "/images/products/swc_product_3.webp",
    link: "/wall-clock",
    tag: "ELITE COLLECTION"
  }
];

function CarouselContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subcat = searchParams.get('subcat');

  let activeSlides = homeSlides;
  if (pathname === '/wall-clock') {
    activeSlides = wallClockSlides;
  } else if (pathname === '/women-watch' || subcat === 'womens') {
    activeSlides = womensSlides;
  } else if (pathname === '/hand-watch' || pathname === '/') {
    activeSlides = mensSlides;
  }

  const slides = activeSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset index when slides change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [slides]);

  const shouldHideCarousel = pathname === "/" || pathname === "/admin-panel" || pathname.startsWith("/product/");

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Bulletproof Autoplay
  useEffect(() => {
    if (shouldHideCarousel) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldHideCarousel, slides.length]);

  if (shouldHideCarousel) return null;

  // Touch Swipe Handlers
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

      <div 
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = currentIndex === index;
          
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

              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

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

export default function Carousel() {
  return (
    <Suspense fallback={<div className="h-[300px] sm:h-[400px] md:h-[480px] lg:h-[550px] bg-black border-b border-gold-500/10"></div>}>
      <CarouselContent />
    </Suspense>
  );
}

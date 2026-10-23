import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const slides = [
  {
    type: 'video',
    src: '/images/Galaxy S23 Series_ Unveiling _ Samsung.mp4',
    title: 'Discover Samsung Galaxy',
    subtitle: 'Galaxy smartphones',
    description: 'Browse Samsung phones available in the ZimMobile catalogue.',
    action: 'Shop Samsung',
    brand: 'Samsung'
  },
  {
    type: 'image',
    src: '/images/iphone-17-pro-max-banner.png',
    title: 'Find your next iPhone',
    subtitle: 'Apple iPhone',
    description: 'Explore available iPhone models and compare their options.',
    action: 'Shop iPhone',
    brand: 'Apple'
  },
  {
    type: 'image',
    src: '/images/selected-phone-offers.png',
    title: 'Offers on selected phones',
    subtitle: 'Current offers',
    description: 'See listed phones with original and current prices.',
    action: 'View offers',
    brand: 'all'
  },
  {
    type: 'video',
    src: '/images/iPhone 16 Pro Reveal (4K).mp4',
    title: 'Explore iPhone',
    subtitle: 'Designed to stand out',
    description: 'Compare iPhone models currently available in the catalogue.',
    action: 'Shop iPhone',
    brand: 'Apple'
  }
] as const;

export const CatalogBannerCarousel: React.FC = () => {
  const { setFilters } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const browseSlide = () => {
    const slide = slides[activeSlide];
    setFilters(prev => ({
      ...prev,
      selectedBrand: slide.brand,
      searchQuery: '',
      condition: 'all',
      priceRange: [0, 2000],
      storage: [],
      onlyInStock: false,
      only5G: false,
      sortBy: slide.brand === 'all' ? 'discount' : prev.sortBy
    }));
  };

  return (
    <section
      aria-label="Phone promotions"
      className="relative mb-5 h-[160px] overflow-hidden rounded-2xl bg-zinc-950 text-white sm:mb-8 sm:h-auto sm:aspect-[3.8/1] sm:min-h-[230px] sm:rounded-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={event => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={event => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) > 50) goToSlide(activeSlide + (distance < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          aria-hidden={index !== activeSlide}
          className={`absolute inset-0 ${index === activeSlide ? 'block' : 'hidden'}`}
        >
          {slide.type === 'video' ? index === activeSlide ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : null : (
            <img
              src={slide.src}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
          <div className="relative z-10 flex h-full items-center px-3 pb-6 sm:px-8 sm:pb-8 lg:px-10">
            <div className="max-w-[76%] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:max-w-xl">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#FFFFFF] sm:text-xs sm:tracking-[0.16em]">{slide.subtitle}</p>
              <h2 className="mt-1 text-base font-extrabold leading-tight text-[#FFFFFF] sm:mt-2 sm:text-3xl lg:text-4xl">{slide.title}</h2>
              <p className="mt-1 hidden text-xs text-[#FFFFFF] sm:mt-2 sm:block sm:text-sm">{slide.description}</p>
              <button
                type="button"
                onClick={browseSlide}
                className="mt-2 inline-flex min-h-8 items-center gap-1 rounded-lg bg-[#F5B301] px-2.5 text-[9px] font-bold text-zinc-950 transition-colors hover:bg-[#E5A500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-4 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                {slide.action}
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => goToSlide(activeSlide - 1)}
        aria-label="Previous promotion"
        className="absolute left-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4 sm:h-10 sm:w-10"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide(activeSlide + 1)}
        aria-label="Next promotion"
        className="absolute right-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 sm:h-10 sm:w-10"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5 sm:bottom-3 sm:gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Show promotion ${index + 1}`}
            aria-current={index === activeSlide ? 'true' : undefined}
            className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              index === activeSlide ? 'w-6 bg-[#F5B301]' : 'w-2 bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

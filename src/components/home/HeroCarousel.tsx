import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroCarouselProps {
  onNavigateToCatalog?: () => void;
}

const slides = [
  
  {
    type: 'video',
    src: '/images/videoplayback.mp4',
    title: 'Find Your Next Galaxy',
    subtitle: 'Power meets innovation',
    description:
      'Discover smartphones designed for your everyday life.',
  },
  {
    type: 'image',
    src: '/images/iphone-17-pro-max-banner.png',
    title: 'Only for iPhone 17 Pro Max',
    subtitle: 'Made for a perfect fit',
    description:
      'Designed for the 6.9-inch model. Explore premium accessories for your iPhone.',
  },
  {
    type: 'video',
    src: '/images/iPhone 16 Pro Reveal (4K).mp4',
    poster: '/images/smartphone-promo-poster.jpg',
    title: 'Technology in Motion',
    subtitle: 'Discover something better',
    description:
      'Explore premium smartphones and the latest mobile technology.',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onNavigateToCatalog,
}) => {
  const { setFilters } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const browseIPhones = () => {
    setFilters((prev) => ({
      ...prev,
      selectedBrand: 'Apple',
      searchQuery: '',
      condition: 'all',
      priceRange: [0, 2000],
      storage: [],
      onlyInStock: false,
      only5G: false,
    }));

    onNavigateToCatalog?.();
  };

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-black text-white"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;

        const distance =
          e.changedTouches[0].clientX - touchStartX.current;

        if (Math.abs(distance) > 50) {
          goToSlide(activeSlide + (distance < 0 ? 1 : -1));
        }

        touchStartX.current = null;
      }}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`relative ${
            index === activeSlide ? 'block' : 'hidden'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              key={slide.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={slide.poster}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={slide.src}
              alt={slide.title}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Fixed banner height */}
          <div className="relative h-[350px] sm:h-[430px] lg:h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />

            <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-5 sm:px-8 lg:px-12">
              <div className="max-w-[85%] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFFFFF] sm:text-sm">
                  {slide.subtitle}
                </p>

                <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#FFFFFF] sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#FFFFFF]">
                  {slide.description}
                </p>

                <button
                  type="button"
                  onClick={browseIPhones}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5B301] px-5 text-sm font-bold text-black transition-colors hover:bg-[#E5A500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore iPhones
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Previous and next arrows */}
      <button
        type="button"
        onClick={() => goToSlide(activeSlide - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:left-5"
      >
        <ArrowLeft size={20} />
      </button>

      <button
        type="button"
        onClick={() => goToSlide(activeSlide + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 sm:right-5"
      >
        <ArrowRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeSlide ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all ${
              index === activeSlide
                ? 'w-7 bg-[#F5B301]'
                : 'w-2.5 bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

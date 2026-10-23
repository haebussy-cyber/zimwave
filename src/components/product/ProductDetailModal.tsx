import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Zap, 
  MessageCircle, 
  Share2, 
  Check, 
  Heart, 
  Scale, 
  Info, 
  ChevronRight, 
  Package, 
  Clock, 
  RotateCcw,
  Sparkles,
  MapPin,
  Lock
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, STORE_LOCATIONS } from '../../data/products';
import { Footer } from '../layout/Footer';
import { Header } from '../layout/Header';

const ProductDetailContent: React.FC<{
  product: Product;
  onNavigateToCatalog?: () => void;
}> = ({ product, onNavigateToCatalog }) => {
  const { 
    closeProductModal, 
    addToCart, 
    formatPrice, 
    wishlist, 
    toggleWishlist,
    compareList,
    toggleCompare,
    openCheckout,
    activeCity,
    openProductModal
  } = useStore();

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'locations'>('specs');
  const [copiedShare, setCopiedShare] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProductModal();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const priceInfo = formatPrice(currentVariant.priceUSD);
  const originalPriceInfo = currentVariant.originalPriceUSD 
    ? formatPrice(currentVariant.originalPriceUSD) 
    : null;

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const similarProducts = PRODUCTS
    .filter(item => item.id !== product.id)
    .sort((first, second) => Number(second.brand === product.brand) - Number(first.brand === product.brand))
    .slice(0, 4);

  // Storage choices
  const availableStorages = Array.from(new Set(product.variants.map(v => v.storage)));
  // Color choices for selected storage
  const matchingColors = product.variants.filter(v => v.storage === currentVariant.storage);

  const handleSelectStorage = (storage: string) => {
    const nextVariant = product.variants.find(v => v.storage === storage && v.colorName === currentVariant.colorName)
      || product.variants.find(v => v.storage === storage)
      || product.variants[0];
    if (nextVariant) setSelectedVariantId(nextVariant.id);
  };

  const handleSelectColor = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant, 1);
    closeProductModal();
    openCheckout();
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant, 1);
    closeProductModal();
  };

  const handleShare = () => {
    const text = `Check out the ${product.name} (${currentVariant.storage}) at ZimMobile Zimbabwe for ${priceInfo.usdFormatted}!`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Pre-filled WhatsApp link
  const whatsappMessage = encodeURIComponent(
    `Hello ZimMobile Harare! 📱\nI would like to inquire about purchasing:\n*${product.name}*\n• Variant: ${currentVariant.storage} - ${currentVariant.colorName}\n• Price: ${priceInfo.usdFormatted} (${priceInfo.zwlFormatted})\n• Delivery city: ${activeCity}\n\nIs this in stock for same-day dispatch today?`
  );
  const whatsappUrl = `https://wa.me/263771234567?text=${whatsappMessage}`;

  const allImages = [currentVariant.image, ...product.galleryImages];
  const returnToCatalog = () => {
    closeProductModal();
    onNavigateToCatalog?.();
  };

  return (
    <div className="light fixed inset-0 z-50 flex items-stretch justify-center bg-[#F7F6F2] text-zinc-950 animate-fade-in">
      {/* Modal Dialog */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="product-detail-title" tabIndex={-1} className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-[#F7F6F2]">
        <Header
          onNavigateToCatalog={returnToCatalog}
          onClose={returnToCatalog}
          extraMenuContent={
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={isWishlisted}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-white/5 bg-[#131620] p-2.5 text-xs font-semibold text-white light:bg-white light:text-zinc-900"
              >
                <Heart className={`h-4 w-4 text-[#F5B301] ${isWishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
                {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleCompare(product.id);
                }}
                aria-pressed={isCompared}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-white/5 bg-[#131620] p-2.5 text-xs font-semibold text-white light:bg-white light:text-zinc-900"
              >
                <Scale className="h-4 w-4 text-[#F5B301]" aria-hidden="true" />
                {isCompared ? 'Remove comparison' : 'Compare phone'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="col-span-2 flex min-h-11 items-center gap-2 rounded-xl border border-white/5 bg-[#131620] p-2.5 text-xs font-semibold text-white light:bg-white light:text-zinc-900"
              >
                <Share2 className="h-4 w-4 text-[#F5B301]" aria-hidden="true" />
                {copiedShare ? 'Link copied' : 'Share this phone'}
              </button>
            </div>
          }
        />

        {/* Scrollable Content Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
          <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-4 sm:space-y-8 sm:px-8 sm:py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 light:border-black/5 flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[#F5B301]/10 rounded-full blur-3xl"></div>
                <img 
                  src={allImages[activeImageIndex] || currentVariant.image} 
                  alt={product.name} 
                  className="max-h-full max-w-[90%] object-contain drop-shadow-2xl z-10 transition-all duration-300"
                />

                {currentVariant.stock <= 3 && (
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg border border-white/20 bg-black/60 text-[#FFFFFF] text-xs font-black [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Only {currentVariant.stock} units remaining in Harare
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto w-full py-1">
                {allImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={`View ${product.name} image ${i + 1}`}
                    aria-pressed={activeImageIndex === i}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border p-1 transition-all ${
                      activeImageIndex === i 
                        ? 'border-[#F5B301] ring-2 ring-[#F5B301]/30 bg-white/5' 
                        : 'border-white/10 light:border-black/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Trust Badges Strip under Image */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5 light:border-black/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Official 12-Month Hardware Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 light:text-zinc-600">
                  <RotateCcw className="w-4 h-4 shrink-0 text-[#F5B301]" />
                  <span>7-Day Return & Replacement Policy</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 light:text-zinc-600">
                  <MapPin className="w-4 h-4 shrink-0 text-[#F5B301]" />
                  <span>Available for collection at Eastgate Mall Harare</span>
                </div>
              </div>
            </div>

            {/* Product Details & Variant Selectors (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              <div>
                <h1 id="product-detail-title" className="text-xl sm:text-2xl font-black text-white light:text-zinc-950 font-display">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-600 mt-1 leading-relaxed">
                  {product.tagline}
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold">
                  <span className={currentVariant.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}>
                    {currentVariant.stock > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-600">{currentVariant.storage} · {currentVariant.colorName}</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#131620] light:bg-white border border-white/8 light:border-black/8 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Price in Zimbabwe
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-display">
                      {priceInfo.primary}
                    </span>
                    {originalPriceInfo && (
                      <span className="text-sm text-zinc-500 line-through">
                        {originalPriceInfo.primary}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 light:text-zinc-600 font-medium mt-0.5">
                    Estimated local equivalent: <strong className="text-white light:text-zinc-900">{priceInfo.secondary}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                    Duty & Tax Included
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    SKU: {currentVariant.sku}
                  </div>
                </div>
              </div>

              {/* Storage Variant Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-2">
                  Select Storage Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableStorages.map(storage => {
                    const isSelected = currentVariant.storage === storage;
                    const variantForPrice = product.variants.find(v => v.storage === storage);
                    return (
                      <button
                        key={storage}
                        onClick={() => handleSelectStorage(storage)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center min-w-[80px] ${
                          isSelected
                            ? 'border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301] light:text-[#D99B00] ring-1 ring-[#F5B301]'
                            : 'border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 text-zinc-300 light:text-zinc-700 hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm">{storage}</span>
                        {variantForPrice && (
                          <span className="text-[10px] opacity-75 font-normal">
                            ${variantForPrice.priceUSD}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Variant Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-2">
                  Select Color: <span className="text-[#F5B301] light:text-[#D99B00]">{currentVariant.colorName}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {matchingColors.map(variant => {
                    const isSelected = currentVariant.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleSelectColor(variant.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#F5B301] bg-[#F5B301]/10 text-white light:text-black font-bold ring-1 ring-[#F5B301]'
                            : 'border-white/10 light:border-black/10 bg-white/5 light:bg-black/5 text-zinc-300 light:text-zinc-700'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                          style={{ backgroundColor: variant.colorHex }} 
                        />
                        <span>{variant.colorName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#F5B301]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery ETA for selected city */}
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-black/5 border border-white/5 light:border-black/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white light:text-zinc-900 block">
                      Delivery to {activeCity}
                    </span>
                    <span className="text-zinc-400">
                      {activeCity.includes('Harare') || activeCity.includes('Chitungwiza') 
                        ? 'Guaranteed Same-Day Delivery (FREE for orders over $100)' 
                        : 'Overnight Courier via Swift Express (1-2 business days)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Concierge Action Button */}
              <div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-400" />
                  <span>Chat on WhatsApp about this {product.name}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tabbed Specs / Description / Zimbabwe Reviews */}
          <div className="mt-8 pt-6 border-t border-white/10 light:border-black/10">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-white/10 light:border-black/10 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'specs' 
                    ? 'bg-[#F5B301] text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Detailed Specifications
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'description' 
                    ? 'bg-[#F5B301] text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                In The Box & Overview
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'locations' 
                    ? 'bg-[#F5B301] text-black shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Store Locations
              </button>
            </div>

            {/* Tab: Specs */}
            {activeTab === 'specs' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Display Screen</span>
                  <span className="font-semibold text-right max-w-[60%]">{product.specs.screen}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Processor / Silicon</span>
                  <span className="font-semibold text-right max-w-[60%]">{product.specs.processor}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">RAM Memory</span>
                  <span className="font-semibold text-right">{product.specs.ram}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Rear Cameras</span>
                  <span className="font-semibold text-right max-w-[60%]">{product.specs.rearCamera}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Selfie Camera</span>
                  <span className="font-semibold text-right">{product.specs.selfieCamera}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Battery Capacity</span>
                  <span className="font-semibold text-right">{product.specs.battery}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Charging Speed</span>
                  <span className="font-semibold text-right">{product.specs.charging}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">SIM & Network</span>
                  <span className="font-semibold text-right max-w-[60%]">{product.specs.sim}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Water Resistance</span>
                  <span className="font-semibold text-right">{product.specs.waterResistance}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 light:bg-black/5 flex justify-between">
                  <span className="text-zinc-400">Warranty Coverage</span>
                  <span className="font-bold text-[#F5B301] light:text-[#D99B00] text-right">{product.specs.warranty}</span>
                </div>
              </div>
            )}

            {/* Tab: Description */}
            {activeTab === 'description' && (
              <div className="mt-4 space-y-4 text-xs sm:text-sm text-zinc-300 light:text-zinc-700">
                <p className="leading-relaxed">{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-bold text-white light:text-zinc-900 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#F5B301]" />
                    Original Box Contents:
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-zinc-400 light:text-zinc-600">
                    {product.boxContents.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Store locations */}
            {activeTab === 'locations' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {STORE_LOCATIONS.map(location => (
                  <div key={location.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs light:border-black/10 light:bg-white">
                    <h4 className="font-bold text-white light:text-zinc-900">{location.name}</h4>
                    <p className="mt-1 text-zinc-400 light:text-zinc-600">{location.address}</p>
                    <p className="mt-2 text-zinc-300 light:text-zinc-700">{location.hours}</p>
                    <a className="mt-2 inline-block font-semibold text-[#F5B301] light:text-amber-800" href={`tel:${location.phone.replaceAll(' ', '')}`}>
                      {location.phone}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
          <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 sm:py-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">More to explore</p>
              <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">Similar phones</h2>
            </div>
            <div
              aria-label="Similar phones, scroll horizontally"
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] sm:gap-4"
            >
              {similarProducts.map(similarProduct => (
                <button
                  key={similarProduct.id}
                  type="button"
                  onClick={() => openProductModal(similarProduct)}
                  className="group flex w-[min(76vw,260px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 sm:w-[280px]"
                >
                  <span className="flex aspect-[4/3] w-full items-center justify-center bg-[#F7F7F5] p-2">
                    <img
                      src={similarProduct.variants[0]?.image}
                      alt={similarProduct.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{similarProduct.brand}</span>
                    <span className="mt-1 line-clamp-2 text-xs font-semibold text-zinc-900 sm:text-sm">{similarProduct.name}</span>
                    {similarProduct.variants[0] && (
                      <span className="mt-2 text-sm font-bold text-emerald-700">
                        {formatPrice(similarProduct.variants[0].priceUSD).primary}
                      </span>
                    )}
                    <span className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                      {similarProduct.tagline}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
          <Footer />
        </div>

        {/* Sticky Bottom Action Bar for Mobile & Desktop */}
        <div className="z-30 flex shrink-0 items-center justify-between gap-3 border-t border-zinc-200 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl sm:p-4">
          <div className="hidden sm:block">
            <span className="text-xs text-zinc-400 block">Total for {currentVariant.storage}</span>
            <div className="text-xl font-black text-emerald-700 font-display">
              {priceInfo.primary}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              disabled={currentVariant.stock <= 0}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 text-xs font-bold text-white transition-all hover:bg-white/15 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 light:bg-black/10 light:text-zinc-900 sm:flex-initial sm:text-sm"
            >
              <span>{currentVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentVariant.stock <= 0}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#F5B301] px-7 text-xs font-extrabold text-black shadow-xl shadow-[#F5B301]/25 transition-all hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none light:bg-[#D99B00] sm:flex-initial sm:text-sm"
            >
              <Zap className="h-4 w-4 fill-black" aria-hidden="true" />
              <span>{currentVariant.stock > 0 ? 'Buy Now' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC<{ onNavigateToCatalog?: () => void }> = ({ onNavigateToCatalog }) => {
  const { activeProductModal } = useStore();
  if (!activeProductModal) return null;
  return <ProductDetailContent key={activeProductModal.id} product={activeProductModal} onNavigateToCatalog={onNavigateToCatalog} />;
};

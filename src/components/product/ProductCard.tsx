import React, { useState } from 'react';
import { Heart, Scale, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
  minPriceUSD?: number;
  maxPriceUSD?: number;
  eligibleVariantIds?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  minPriceUSD,
  maxPriceUSD,
  eligibleVariantIds
}) => {
  const {
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    openProductModal
  } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');

  const eligibleVariants = product.variants.filter(variant =>
    (!eligibleVariantIds || eligibleVariantIds.includes(variant.id)) &&
    (minPriceUSD === undefined || variant.priceUSD >= minPriceUSD) &&
    (maxPriceUSD === undefined || variant.priceUSD <= maxPriceUSD)
  );
  const selectedVariant = eligibleVariants.find(variant => variant.id === selectedVariantId)
    ?? eligibleVariants[0]
    ?? product.variants[0];

  if (!selectedVariant) return null;

  const price = formatPrice(selectedVariant.priceUSD);
  const originalPrice = selectedVariant.originalPriceUSD && selectedVariant.originalPriceUSD > selectedVariant.priceUSD
    ? formatPrice(selectedVariant.originalPriceUSD)
    : null;
  const savingsUSD = selectedVariant.originalPriceUSD && originalPrice
    ? selectedVariant.originalPriceUSD - selectedVariant.priceUSD
    : 0;
  const savings = savingsUSD > 0 ? formatPrice(savingsUSD) : null;
  const savingsPercent = savingsUSD > 0 && selectedVariant.originalPriceUSD
    ? Math.round((1 - selectedVariant.priceUSD / selectedVariant.originalPriceUSD) * 100)
    : null;
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const isInStock = selectedVariant.stock > 0;

  const openDetails = () => {
    if (onOpenDetail) onOpenDetail(product);
    else openProductModal(product);
  };

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <button
          type="button"
          onClick={openDetails}
          aria-label={`View ${product.name} details`}
          className="block aspect-[4/3] w-full bg-[#F7F7F5] p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D99B00] sm:p-2"
        >
          <img
            src={selectedVariant.image}
            alt={`${product.name}, ${selectedVariant.colorName}, ${selectedVariant.storage}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
          />
        </button>

        <span className="absolute left-2 top-2 max-w-[calc(100%-5.5rem)] truncate rounded-md border border-white/30 bg-black/60 px-2 py-1 text-[10px] font-semibold text-[#FFFFFF] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:left-3 sm:top-3 sm:text-xs">
          {product.condition}
        </span>

        <div className="absolute right-2 top-2 flex gap-1 sm:right-3 sm:top-3">
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            aria-label={isCompared ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
            aria-pressed={isCompared}
            className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B00] ${
              isCompared
                ? 'border-[#D99B00] bg-amber-100 text-amber-900'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 hidden min-h-11 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex">
          {eligibleVariants.length > 1 && (
            <>
            {eligibleVariants.slice(0, 5).map(variant => (
              <button
                type="button"
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                aria-label={`Select ${variant.colorName}, ${variant.storage}`}
                aria-pressed={selectedVariant.id === variant.id}
                title={`${variant.colorName} • ${variant.storage}`}
                className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-2 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B00] ${
                  selectedVariant.id === variant.id
                    ? 'border-amber-500 bg-amber-50 text-amber-950'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ backgroundColor: variant.colorHex }}
                  aria-hidden="true"
                />
                <span>{variant.storage}</span>
              </button>
            ))}
            {eligibleVariants.length > 5 && (
              <span className="shrink-0 text-[10px] text-zinc-500">+{eligibleVariants.length - 5}</span>
            )}
            </>
          )}
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{product.brand}</p>
        <button
          type="button"
          onClick={openDetails}
          className="mt-0.5 min-h-10 text-left text-sm font-semibold leading-5 text-zinc-900 line-clamp-2 hover:text-amber-800 focus-visible:outline-none focus-visible:underline sm:text-base"
        >
          {product.name}
        </button>

        <p className="mt-1 hidden min-h-5 truncate text-xs text-zinc-600 sm:block">
          {selectedVariant.storage} · {selectedVariant.colorName}
        </p>
        <p className="mt-0.5 hidden min-h-4 truncate text-[11px] text-zinc-500 sm:block">
          {product.specs.ram}
        </p>
        <p className="mt-1 hidden min-h-9 text-xs leading-4 text-zinc-600 line-clamp-2 sm:block">
          {product.tagline}
        </p>
        <p className={`mt-1 text-xs font-medium ${isInStock ? 'text-emerald-700' : 'text-rose-700'}`}>
          {isInStock ? 'In stock' : 'Out of stock'}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-bold leading-tight text-emerald-700 sm:text-xl">{price.primary}</span>
            {originalPrice && (
              <>
                <span className="text-xs text-zinc-500 line-through">{originalPrice.primary}</span>
                {savings && savingsPercent !== null && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Save {savings.primary} ({savingsPercent}%)
                  </span>
                )}
              </>
            )}
          </div>
          {price.secondary && (
            <p className="mt-0.5 text-[11px] text-zinc-500">Approx. {price.secondary}</p>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isWishlisted}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                isWishlisted
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => addToCart(product, selectedVariant, 1)}
              disabled={!isInStock}
              aria-label={isInStock ? `Add ${product.name} to cart` : `${product.name} unavailable`}
              title={isInStock ? 'Add to cart' : 'Unavailable'}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5B301] text-zinc-950 transition-colors hover:bg-[#E5A500] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 motion-reduce:transition-none"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

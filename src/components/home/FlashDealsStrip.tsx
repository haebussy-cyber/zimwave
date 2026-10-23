import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { PRODUCTS } from '../../data/products';

export const FlashDealsStrip: React.FC = () => {
  const offerProducts = PRODUCTS.filter(product =>
    product.isFlashDeal && product.variants.some(variant =>
      variant.originalPriceUSD !== undefined && variant.originalPriceUSD > variant.priceUSD
    )
  ).slice(0, 4);

  if (offerProducts.length === 0) return null;

  return (
    <section className="border-y border-zinc-200 bg-[#EFECE6] py-7 sm:py-9">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Current offers</p>
            <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">Offers on selected phones</h2>
            <p className="mt-1 text-sm text-zinc-600">Savings are calculated from the listed original and current prices.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {offerProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
};

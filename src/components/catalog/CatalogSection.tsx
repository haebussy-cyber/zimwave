import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { CatalogBannerCarousel } from './CatalogBannerCarousel';
import { FilterState, Product } from '../../types';

export const CatalogSection: React.FC = () => {
  const { products, filters, setFilters, resetFilters } = useStore();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const filterDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterSheetOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    filterDialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterSheetOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = filterDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === filterDialogRef.current)) {
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
  }, [isFilterSheetOpen]);

  const brands = ['all', 'Apple', 'Samsung', 'Xiaomi', 'Tecno'];

  const matchingVariants = (product: Product) => product.variants.filter(variant =>
    variant.priceUSD >= filters.priceRange[0] &&
    variant.priceUSD <= filters.priceRange[1] &&
    (filters.storage.length === 0 || filters.storage.includes(variant.storage)) &&
    (!filters.onlyInStock || variant.stock > 0)
  );

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        const matchesSpecs = Object.values(product.specs).some(s => s.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesTags && !matchesSpecs) return false;
      }

      // Brand filter
      if (filters.selectedBrand !== 'all' && product.brand !== filters.selectedBrand) {
        return false;
      }

      // Condition filter
      if (filters.condition !== 'all' && product.condition !== filters.condition) {
        return false;
      }

      // Price filter
      if (matchingVariants(product).length === 0) {
        return false;
      }

      // Only 5G
      if (filters.only5G && !product.specs.network.includes('5G')) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = Math.min(...matchingVariants(a).map(variant => variant.priceUSD));
      const priceB = Math.min(...matchingVariants(b).map(variant => variant.priceUSD));
      if (filters.sortBy === 'price-low') return priceA - priceB;
      if (filters.sortBy === 'price-high') return priceB - priceA;
      if (filters.sortBy === 'discount') {
        const getDiscount = (product: Product) => Math.max(0, ...matchingVariants(product).map(variant =>
          variant.originalPriceUSD && variant.originalPriceUSD > variant.priceUSD
            ? (variant.originalPriceUSD - variant.priceUSD) / variant.originalPriceUSD
            : 0
        ));
        const discA = getDiscount(a);
        const discB = getDiscount(b);
        return discB - discA;
      }
      return 0; // featured default
    });
  }, [products, filters]);

  const brandCategories = useMemo(() => {
    const availableBrands = [...new Set(products.map(product => product.brand))];
    return availableBrands.map(brand => {
      const brandProducts = products.filter(product => product.brand === brand);
      return {
        brand,
        productCount: brandProducts.length,
        image: brandProducts[0].variants[0]?.image
      };
    });
  }, [products]);

  const hasActiveFilters = filters.searchQuery || filters.selectedBrand !== 'all' || filters.condition !== 'all' || filters.storage.length > 0 || filters.onlyInStock || filters.only5G || filters.priceRange[0] > 0 || filters.priceRange[1] < 2000;
  const showBrandCategories = filters.selectedBrand === 'all' && !hasActiveFilters && filteredProducts.length > 4;
  const showHorizontalShelf = filteredProducts.length > 8;
  const leadingProductsCount = showBrandCategories || showHorizontalShelf ? 4 : filteredProducts.length;
  const carouselStart = Math.max(4, filteredProducts.length - 6);

  return (
    <section id="catalog" className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <CatalogBannerCarousel />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#F5B301]"></span>
            <span>Flagship Collection Zimbabwe</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1 font-display tracking-tight">
            Phones
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Compare available models, storage options and prices.
          </p>
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {brands.map(brand => (
            <button
              key={brand}
              type="button"
              aria-pressed={filters.selectedBrand === brand}
              onClick={() => setFilters(prev => ({ ...prev, selectedBrand: brand }))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.selectedBrand === brand
                  ? 'bg-[#F5B301] text-zinc-950 font-black'
                  : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {brand === 'all' ? 'All Brands' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Filters, Active Count, Sort */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:mb-6">
        
        {/* Left: Filter Trigger & Active Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3.5 text-xs font-bold text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            <SlidersHorizontal className="h-4 w-4 text-amber-800" aria-hidden="true" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#F5B301]"></span>
            )}
          </button>

          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Showing <strong className="text-zinc-950">{filteredProducts.length}</strong> phones
          </span>

          {/* Quick Active Chips */}
          {filters.searchQuery && (
            <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-950">
              <span>"{filters.searchQuery}"</span>
              <button type="button" aria-label="Clear search filter" onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-1 flex min-h-10 items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort Options */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="catalog-sort" className="text-zinc-600 hidden sm:inline">Sort:</label>
          <select
            id="catalog-sort"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Flash Discount</option>
          </select>
        </div>
      </div>

      {/* 2-Column Mobile Product Grid (3 cols on MD, 4 cols on XL) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.slice(0, leadingProductsCount).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              eligibleVariantIds={matchingVariants(product).map(variant => variant.id)}
              minPriceUSD={filters.priceRange[0]}
              maxPriceUSD={filters.priceRange[1]}
            />
          ))}
          {showBrandCategories && (
            <section className="col-span-full my-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:my-4 sm:rounded-3xl sm:p-5">
              <div className="mb-3 sm:mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 sm:text-xs">Explore the range</p>
                <h3 className="mt-1 text-base font-bold text-zinc-950 sm:text-xl">Shop phones by brand</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, selectedBrand: 'all', searchQuery: '' }))}
                  className="group relative flex min-h-32 overflow-hidden rounded-2xl bg-sky-50 p-3 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 sm:min-h-40 sm:p-4"
                >
                  <span className="relative z-10">
                    <span className="block text-sm font-bold text-zinc-950 sm:text-base">All phones</span>
                    <span className="mt-1 block text-[10px] text-zinc-600 sm:text-xs">{products.length} models</span>
                  </span>
                  {products[0]?.variants[0]?.image && (
                    <img
                      src={products[0].variants[0].image}
                      alt=""
                      loading="lazy"
                      className="absolute bottom-1 right-1 h-20 w-24 object-contain transition-transform group-hover:scale-105 sm:h-28 sm:w-32"
                    />
                  )}
                </button>
                {brandCategories.map((category, index) => (
                  <button
                    key={category.brand}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, selectedBrand: category.brand, searchQuery: '' }))}
                    className={`group relative flex min-h-32 overflow-hidden rounded-2xl p-3 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 sm:min-h-40 sm:p-4 ${
                      ['bg-violet-50', 'bg-emerald-50', 'bg-orange-50', 'bg-rose-50', 'bg-cyan-50'][index % 5]
                    }`}
                  >
                    <span className="relative z-10">
                      <span className="block text-sm font-bold text-zinc-950 sm:text-base">{category.brand}</span>
                      <span className="mt-1 block text-[10px] text-zinc-600 sm:text-xs">{category.productCount} {category.productCount === 1 ? 'model' : 'models'}</span>
                    </span>
                    {category.image && (
                      <img
                        src={category.image}
                        alt=""
                        loading="lazy"
                        className="absolute bottom-1 right-1 h-20 w-24 object-contain transition-transform group-hover:scale-105 sm:h-28 sm:w-32"
                      />
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
          {filteredProducts.slice(
            leadingProductsCount,
            showHorizontalShelf ? carouselStart : undefined
          ).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              eligibleVariantIds={matchingVariants(product).map(variant => variant.id)}
              minPriceUSD={filters.priceRange[0]}
              maxPriceUSD={filters.priceRange[1]}
            />
          ))}
          {showHorizontalShelf && (
            <section className="col-span-full my-2 min-w-0 rounded-2xl border border-zinc-200 bg-[#EFECE6] p-3 sm:my-4 sm:rounded-3xl sm:p-5">
              <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 sm:text-xs">More to discover</p>
                  <h3 className="mt-1 text-base font-bold text-zinc-950 sm:text-xl">Explore more phones</h3>
                </div>
                <span className="shrink-0 text-[10px] text-zinc-600 sm:text-xs">Swipe to browse</span>
              </div>
              <div
                role="region"
                aria-label="More phones, scroll horizontally"
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin] sm:gap-4"
              >
                {filteredProducts.slice(carouselStart, -2).map(product => (
                  <div key={product.id} className="w-[min(76vw,240px)] shrink-0 snap-start sm:w-[260px]">
                    <ProductCard
                      product={product}
                      eligibleVariantIds={matchingVariants(product).map(variant => variant.id)}
                      minPriceUSD={filters.priceRange[0]}
                      maxPriceUSD={filters.priceRange[1]}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          {showHorizontalShelf && filteredProducts.slice(-2).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              eligibleVariantIds={matchingVariants(product).map(variant => variant.id)}
              minPriceUSD={filters.priceRange[0]}
              maxPriceUSD={filters.priceRange[1]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center space-y-3 sm:p-12">
          <Search className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 font-display">
            No matching phones found
          </h3>
          <p className="mx-auto max-w-sm text-xs text-zinc-600">
            Try adjusting your search, price range, or other filters.
          </p>
          <button
            onClick={resetFilters}
            className="min-h-11 rounded-xl bg-[#F5B301] px-4 text-xs font-bold text-zinc-950 hover:bg-[#E5A500]"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Filter Bottom Sheet Modal */}
      {isFilterSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
        >
          <button
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 cursor-default"
            onClick={() => setIsFilterSheetOpen(false)}
          />

          <div ref={filterDialogRef} role="dialog" aria-modal="true" aria-labelledby="filter-dialog-title" tabIndex={-1} className="relative z-10 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl">
            
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-amber-800" />
                <h3 id="filter-dialog-title" className="text-sm font-bold text-zinc-950 sm:text-base">
                  Filter Handsets
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Filters Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 text-xs">
              
              {/* Max Price Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between font-bold text-zinc-800">
                  <span>Maximum Budget</span>
                  <span className="font-black text-amber-900">${filters.priceRange[1]} USD</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full accent-[#F5B301]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>$150 (Budget)</span>
                  <span>$1,000 (Pro)</span>
                  <span>$2,000 (Ultra Flagship)</span>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="mb-2 block font-bold uppercase tracking-wider text-zinc-800">
                  Condition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All Devices' },
                    { id: 'Brand New Sealed', label: 'Brand New' },
                    { id: 'Certified Pre-Owned Pristine', label: 'Certified Pristine' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, condition: c.id }))}
                      className={`min-h-11 rounded-xl border px-2 text-center transition-all ${
                        filters.condition === c.id 
                          ? 'border-amber-500 bg-amber-50 font-bold text-amber-950'
                          : 'border-zinc-200 bg-white text-zinc-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Capacities */}
              <div>
                <label className="mb-2 block font-bold uppercase tracking-wider text-zinc-800">
                  Storage Capacity
                </label>
                <div className="flex flex-wrap gap-2">
                  {['128GB', '256GB', '512GB', '1TB'].map(size => {
                    const isSelected = filters.storage.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          storage: isSelected 
                            ? prev.storage.filter(s => s !== size)
                            : [...prev.storage, size]
                        }))}
                        className={`min-h-11 rounded-xl border px-3 font-bold transition-all ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50 text-amber-950'
                            : 'border-zinc-200 bg-white text-zinc-700'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 border-t border-zinc-200 pt-3">
                <label className="flex min-h-11 items-center justify-between gap-3 cursor-pointer text-zinc-800">
                  <span>Only show in-stock variants</span>
                  <input
                    type="checkbox"
                    checked={filters.onlyInStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, onlyInStock: e.target.checked }))}
                    className="h-5 w-5 accent-[#D99B00]"
                  />
                </label>

                <label className="flex min-h-11 items-center justify-between gap-3 cursor-pointer text-zinc-800">
                  <span>5G capable phones</span>
                  <input
                    type="checkbox"
                    checked={filters.only5G}
                    onChange={(e) => setFilters(prev => ({ ...prev, only5G: e.target.checked }))}
                    className="h-5 w-5 accent-[#D99B00]"
                  />
                </label>
              </div>

            </div>

            {/* Sheet Footer */}
            <div className="flex gap-2 border-t border-zinc-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => { resetFilters(); setIsFilterSheetOpen(false); }}
                className="min-h-11 rounded-xl border border-zinc-300 px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="min-h-11 flex-1 rounded-xl bg-[#F5B301] text-xs font-extrabold text-zinc-950 shadow-sm hover:bg-[#E5A500]"
              >
                View {filteredProducts.length} Results
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

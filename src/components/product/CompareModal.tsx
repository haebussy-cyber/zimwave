import React from 'react';
import { 
  X, 
  Scale, 
  Trash2, 
  Plus, 
  ShoppingBag, 
  Zap, 
  Check, 
  Star 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const CompareModal: React.FC = () => {
  const { 
    isCompareOpen, 
    closeCompare, 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    formatPrice,
    addToCart,
    openProductModal 
  } = useStore();

  if (!isCompareOpen) return null;

  const comparedProducts = PRODUCTS.filter(p => compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={closeCompare} />

      <div className="relative w-full max-w-5xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950 font-display">
                Side-by-Side Phone Comparison
              </h3>
              <p className="text-[11px] text-zinc-400">
                Comparing {comparedProducts.length} of 3 maximum devices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={closeCompare}
              className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto flex-1">
          {comparedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scale className="w-12 h-12 text-zinc-500 mx-auto" />
              <div className="text-base font-bold text-white light:text-zinc-900">
                No phones selected to compare yet
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Tap the compare icon on any phone card to compare specifications side-by-side.
              </p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              {/* Product Top Header Cards */}
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-white/10 light:border-black/10">
                {comparedProducts.map(p => {
                  const variant = p.variants[0];
                  const price = formatPrice(variant.priceUSD);
                  return (
                    <div key={p.id} className="p-4 rounded-2xl bg-[#131620] light:bg-white border border-white/5 relative flex flex-col justify-between">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 right-2 text-zinc-400 hover:text-rose-400 p-1"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-col items-center text-center">
                        <img 
                          src={variant.image} 
                          alt={p.name} 
                          className="w-24 h-24 object-contain mb-2 drop-shadow-lg" 
                        />
                        <span className="text-[10px] uppercase font-bold text-[#F5B301]">{p.brand}</span>
                        <h4 className="text-xs font-bold text-white light:text-zinc-900 font-display line-clamp-1">{p.name}</h4>
                        <div className="text-sm font-black text-[#F5B301] light:text-[#D99B00] mt-1 font-display">
                          {price.primary}
                        </div>
                        <div className="text-[10px] text-zinc-400">≈ {price.secondary}</div>
                      </div>

                      <div className="mt-3 flex gap-1.5">
                        <button
                          onClick={() => {
                            addToCart(p, variant, 1);
                            closeCompare();
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-[#F5B301] text-black font-bold text-xs hover:opacity-90 transition-opacity"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            closeCompare();
                            openProductModal(p);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white light:text-zinc-900 text-xs font-bold"
                        >
                          Specs
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Fill empty slots */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-dashed border-white/10 light:border-black/10 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                    <Plus className="w-6 h-6 text-zinc-400 mb-1" />
                    <span className="text-xs">Add phone from catalog</span>
                  </div>
                ))}
              </div>

              {/* Spec Rows Comparison Table */}
              <div className="mt-6 space-y-4 text-xs">
                {[
                  { label: 'Display & Screen', key: 'screen' },
                  { label: 'Processor', key: 'processor' },
                  { label: 'RAM Memory', key: 'ram' },
                  { label: 'Rear Cameras', key: 'rearCamera' },
                  { label: 'Selfie Camera', key: 'selfieCamera' },
                  { label: 'Battery Capacity', key: 'battery' },
                  { label: 'Fast Charging', key: 'charging' },
                  { label: 'Operating System', key: 'os' },
                  { label: 'Network & SIM', key: 'sim' },
                  { label: 'Water Resistance', key: 'waterResistance' },
                  { label: 'Zimbabwe Warranty', key: 'warranty' }
                ].map(row => (
                  <div key={row.key} className="py-2.5 border-b border-white/5 light:border-black/5">
                    <div className="text-[11px] font-bold text-[#F5B301] light:text-[#D99B00] uppercase tracking-wider mb-2">
                      {row.label}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {comparedProducts.map(p => (
                        <div key={p.id} className="text-zinc-200 light:text-zinc-800 text-xs pr-2">
                          {(p.specs as any)[row.key] || '—'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

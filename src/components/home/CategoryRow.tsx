import React from 'react';
import { 
  Smartphone, 
  Sparkles, 
  RotateCw, 
  Clock, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Headphones,
  Scale
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryRow: React.FC<{ onSelectBrand?: (b: string) => void }> = ({ onSelectBrand }) => {
  const { 
    openPhoneFinder, 
    openTradeIn, 
    openLayaway, 
    openCompare,
    setFilters 
  } = useStore();

  const categories = [
    {
      id: 'all',
      title: 'All Phones',
      icon: Smartphone,
      action: () => setFilters(prev => ({ ...prev, selectedBrand: 'all', searchQuery: '' }))
    },
    {
      id: 'apple',
      title: 'Apple iPhone',
      icon: Zap,
      action: () => setFilters(prev => ({ ...prev, selectedBrand: 'Apple', searchQuery: '' }))
    },
    {
      id: 'samsung',
      title: 'Samsung Galaxy',
      icon: Sparkles,
      action: () => setFilters(prev => ({ ...prev, selectedBrand: 'Samsung', searchQuery: '' }))
    },
    {
      id: 'budget',
      title: 'Under $200',
      icon: Flame,
      action: () => setFilters(prev => ({ ...prev, priceRange: [0, 200], searchQuery: '' }))
    },
    {
      id: 'finder',
      title: 'Phone Finder',
      icon: Sparkles,
      highlight: true,
      action: openPhoneFinder
    },
    {
      id: 'tradein',
      title: 'Trade-In',
      icon: RotateCw,
      action: openTradeIn
    },
    {
      id: 'compare',
      title: 'Compare',
      icon: Scale,
      action: openCompare
    },
    {
      id: 'layaway',
      title: 'Layaway (EcoCash)',
      icon: Clock,
      action: openLayaway
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={cat.action}
              className={`flex flex-col items-center gap-2 p-3 sm:p-3.5 rounded-2xl border min-w-[85px] sm:min-w-[105px] transition-all shrink-0 ${
                cat.highlight
                  ? 'border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301] light:text-[#D99B00] shadow-md shadow-[#F5B301]/10'
                  : 'border-white/5 light:border-black/5 bg-[#131620] light:bg-white text-zinc-300 light:text-zinc-700 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                cat.highlight ? 'bg-[#F5B301] text-black font-bold' : 'bg-white/5 light:bg-black/5 text-[#F5B301]'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-center tracking-tight whitespace-nowrap">
                {cat.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

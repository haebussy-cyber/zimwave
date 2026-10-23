import React from 'react';
import { 
  Home, 
  Smartphone, 
  Package,
  ShoppingBag, 
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface StickyMobileNavProps {
  currentView: 'home' | 'catalog' | 'orders';
  onSelectView: (view: 'home' | 'catalog' | 'orders') => void;
}

export const StickyMobileNav: React.FC<StickyMobileNavProps> = ({ currentView, onSelectView }) => {
  const { 
    cartTotalCount, 
    openCart
  } = useStore();

  return (
    <>
      {/* Floating WhatsApp Action Pill (Bottom Right) */}
      <aside aria-label="Support and Quick Contact" className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-3 z-40 sm:bottom-6 sm:right-6">
        <a
          href="https://wa.me/263771234567?text=Hello%20ZimMobile!%20I%20have%20an%20inquiry%20about%20ordering%20a%20phone"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-3.5 text-black font-extrabold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5 fill-black" />
          <span className="hidden xs:inline">WhatsApp Harare</span>
        </a>
      </aside>

      {/* Sticky Bottom Bar for Mobile Devices */}
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0D12]/95 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-xl light:border-black/10 light:bg-white/95 sm:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          
          <button
            type="button"
            onClick={() => onSelectView('home')}
            aria-current={currentView === 'home' ? 'page' : undefined}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition-all ${
              currentView === 'home' ? 'text-[#F5B301]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('catalog')}
            aria-current={currentView === 'catalog' ? 'page' : undefined}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition-all ${
              currentView === 'catalog' ? 'text-[#F5B301]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-semibold">Phones</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('orders')}
            aria-current={currentView === 'orders' ? 'page' : undefined}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition-all ${
              currentView === 'orders' ? 'text-[#F5B301]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-semibold">My orders</span>
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart${cartTotalCount > 0 ? `, ${cartTotalCount} items` : ''}`}
            className="relative flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-zinc-400 hover:text-white"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartTotalCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F5B301] px-1 text-[9px] font-black text-black">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Cart</span>
          </button>

        </div>
      </nav>
    </>
  );
};

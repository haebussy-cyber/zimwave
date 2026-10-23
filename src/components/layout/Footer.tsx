import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Zap, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Heart,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_LOCATIONS, ZIM_EXCHANGE_RATE } from '../../data/products';

export const Footer: React.FC<{ onNavigateToCatalog?: () => void }> = ({ onNavigateToCatalog }) => {
  const { 
    openPhoneFinder, 
    openTradeIn, 
    openLayaway, 
    openDocs, 
    openAdmin,
    openContentModal 
  } = useStore();

  return (
    <footer className="w-full border-t border-white/8 bg-[#08090D] pt-8 pb-20 text-zinc-400 transition-colors light:border-black/8 light:bg-[#EFECE6] light:text-zinc-600 sm:pb-8">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#F5B301] to-[#D99B00] flex items-center justify-center text-black font-black text-lg">
                Z
              </div>
              <div>
                <span className="text-xl font-black text-white light:text-zinc-950 font-display">
                  ZimMobile
                </span>
                <span className="text-[10px] font-bold text-[#F5B301] block -mt-1">
                  PREMIER TECH BOUTIQUE • HARARE
                </span>
              </div>
            </div>

            <p className="max-w-sm text-xs leading-relaxed">
              Zimbabwe's premier mobile tech destination. 100% genuine factory sealed devices, 12-month stamped warranty, instant EcoCash USSD checkout, and same-day Harare delivery.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-xl bg-white/5 light:bg-black/5 text-[11px] font-semibold text-zinc-300 light:text-zinc-700">
                Ref Rate: 1 USD = {ZIM_EXCHANGE_RATE} ZiG
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold">
                Harare Stock Live
              </div>
            </div>
          </div>

          {/* Boutique Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white light:text-zinc-900 uppercase tracking-wider">
              Store Locations
            </h4>
            <ul className="space-y-2 text-xs">
              {STORE_LOCATIONS.map(store => (
                <li key={store.id} className="space-y-0.5">
                  <strong className="text-zinc-200 light:text-zinc-800 block">{store.name}</strong>
                  <span className="text-[11px] text-zinc-400 block">{store.address}</span>
                  <span className="text-[10px] text-[#F5B301]">{store.phone}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white light:text-zinc-900 uppercase tracking-wider">
              Special Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={openPhoneFinder} className="hover:text-[#F5B301] transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F5B301]" />
                  <span>Phone Finder Quiz</span>
                </button>
              </li>
              <li>
                <button onClick={openTradeIn} className="hover:text-[#F5B301] transition-colors flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3 text-[#F5B301]" />
                  <span>Trade-In Valuator</span>
                </button>
              </li>
              <li>
                <button onClick={openLayaway} className="hover:text-[#F5B301] transition-colors flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#F5B301]" />
                  <span>EcoCash Layaway Plan</span>
                </button>
              </li>
              <li>
                <button onClick={openDocs} className="hover:text-[#F5B301] transition-colors">
                  System Architecture & Checklist
                </button>
              </li>
              <li>
                <button onClick={openAdmin} className="hover:text-[#F5B301] transition-colors">
                  Merchant Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white light:text-zinc-900 uppercase tracking-wider">
              Trust & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openContentModal('warranty')} className="hover:text-white transition-colors">
                  12-Month Official Warranty
                </button>
              </li>
              <li>
                <button onClick={() => openContentModal('warranty')} className="hover:text-white transition-colors">
                  7-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => openContentModal('shipping')} className="hover:text-white transition-colors">
                  Harare Same-Day Shipping Guide
                </button>
              </li>
              <li>
                <button onClick={() => openContentModal('about')} className="hover:text-white transition-colors">
                  About Our Harare Company
                </button>
              </li>
              <li>
                <button onClick={() => openContentModal('privacy')} className="hover:text-white transition-colors">
                  Zimbabwe Data Protection Act
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-5 border-t border-white/5 light:border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-semibold text-zinc-300 light:text-zinc-700">Accepted in Zimbabwe:</span>
            <span className="px-2 py-0.5 rounded bg-white/5 light:bg-black/5 font-bold text-[#F5B301]">EcoCash</span>
            <span className="px-2 py-0.5 rounded bg-white/5 light:bg-black/5">Cash on Delivery</span>
            <span className="px-2 py-0.5 rounded bg-white/5 light:bg-black/5">PayNow (Visa/Mastercard)</span>
            <span className="px-2 py-0.5 rounded bg-white/5 light:bg-black/5">OneMoney</span>
            <span className="px-2 py-0.5 rounded bg-white/5 light:bg-black/5">In-Store Swipe</span>
          </div>

          <div className="text-[11px] text-zinc-500 text-center sm:text-right">
            © 2026 ZimMobile Zimbabwe (Pvt) Ltd. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};

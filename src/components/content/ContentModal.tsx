import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, Lock, FileText, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_LOCATIONS } from '../../data/products';

export const ContentModal: React.FC = () => {
  const { activeContentModal, closeContentModal } = useStore();

  if (!activeContentModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={closeContentModal} />

      <div className="relative w-full max-w-2xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 text-[#F5B301] flex items-center justify-center">
              {activeContentModal === 'warranty' && <ShieldCheck className="w-4 h-4" />}
              {activeContentModal === 'shipping' && <Truck className="w-4 h-4" />}
              {activeContentModal === 'about' && <MapPin className="w-4 h-4" />}
              {(activeContentModal === 'privacy' || activeContentModal === 'terms') && <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white light:text-zinc-950 font-display capitalize">
                {activeContentModal === 'warranty' && 'Official 12-Month Warranty & Returns'}
                {activeContentModal === 'shipping' && 'Harare & Zimbabwe Shipping Policy'}
                {activeContentModal === 'about' && 'About ZimMobile Zimbabwe'}
                {activeContentModal === 'privacy' && 'Privacy Policy (Data Protection Act)'}
                {activeContentModal === 'terms' && 'Terms of Service'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Official Consumer Guarantees & Operating Guidelines
              </p>
            </div>
          </div>
          <button 
            onClick={closeContentModal}
            className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 light:text-zinc-700 leading-relaxed">
          
          {activeContentModal === 'warranty' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <strong>100% Genuine Stamped Guarantee:</strong> Every sealed phone includes an official serialized warranty certificate honored at our Harare & Bulawayo labs.
              </div>

              <h4 className="font-bold text-white light:text-zinc-900 text-sm">1. 12-Month Hardware Coverage</h4>
              <p>
                Our warranty protects against manufacturer defects, battery anomalies, display touch sensor malfunctions, logic board faults, and network modem issues. Repairs or unit replacements are executed within 48-72 business hours at our Eastgate Harare central engineering hub.
              </p>

              <h4 className="font-bold text-white light:text-zinc-900 text-sm">2. 7-Day Hassle-Free Returns</h4>
              <p>
                If your device experiences any technical fault within 7 calendar days of receipt, we provide an immediate exchange or full refund in the original currency of payment (USD cash or EcoCash reversal).
              </p>
            </div>
          )}

          {activeContentModal === 'shipping' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white light:text-zinc-900 text-sm">Same-Day Harare & Chitungwiza Dispatch</h4>
              <p>
                Orders placed before 3:00 PM are dispatched via our internal motorbike courier fleet within 2-4 hours. Delivery is FREE on all orders exceeding $100 USD. For orders under $100 USD, a flat $5 Harare fee applies.
              </p>

              <h4 className="font-bold text-white light:text-zinc-900 text-sm">Nationwide Zimbabwe Express Courier</h4>
              <p>
                For Bulawayo, Mutare, Gweru, Masvingo, Kwekwe, and Victoria Falls, shipments are dispatched daily via Swift Express or FedEx with tamper-evident security tape. Orders arrive within 24 to 48 hours.
              </p>

              <h4 className="font-bold text-white light:text-zinc-900 text-sm">In-Store Collection Hubs</h4>
              <div className="space-y-2 pt-1">
                {STORE_LOCATIONS.map(s => (
                  <div key={s.id} className="p-3 rounded-xl bg-white/5 light:bg-black/5 text-xs">
                    <strong className="text-white light:text-zinc-900">{s.name}</strong>
                    <div className="text-zinc-400 mt-0.5">{s.address}</div>
                    <div className="text-[11px] text-[#F5B301] mt-0.5">{s.hours} • Phone: {s.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeContentModal === 'about' && (
            <div className="space-y-3">
              <p>
                <strong>ZimMobile</strong> was established to end the frustration of fake refurbished phones, exorbitant street markups, and unbacked promises in Zimbabwe's consumer electronics market.
              </p>
              <p>
                We operate as a luxury tech boutique with high-volume direct distributor channels for Apple, Samsung, Xiaomi, and Tecno. By combining instant EcoCash USSD checkout, verified Cash-on-Delivery, and rapid motorbike logistics across Harare and Chitungwiza, we make owning world-class smartphones effortless, safe, and transparent.
              </p>
            </div>
          )}

          {(activeContentModal === 'privacy' || activeContentModal === 'terms') && (
            <div className="space-y-3">
              <h4 className="font-bold text-white light:text-zinc-900 text-sm">
                Compliance with Zimbabwe's Data Protection Act [Chapter 11:22]
              </h4>
              <p>
                ZimMobile processes personal customer data (including phone numbers, recipient names, and delivery addresses) strictly for the fulfillment of orders and delivery coordination with our Harare courier dispatchers.
              </p>
              <p>
                We do not sell or lease customer information to third-party telemarketing networks. Payment details entered during EcoCash or PayNow transactions are encrypted end-to-end and never stored on local servers.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

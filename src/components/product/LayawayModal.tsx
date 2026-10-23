import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const LayawayModal: React.FC = () => {
  const { isLayawayOpen, closeLayaway, formatPrice } = useStore();

  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [depositPercent, setDepositPercent] = useState<25 | 35 | 50>(25);
  const [durationMonths, setDurationMonths] = useState<1 | 2 | 3>(2);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isLayawayOpen) return null;

  const product = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const totalPriceUSD = product.variants[0].priceUSD;

  const depositUSD = Math.round((totalPriceUSD * depositPercent) / 100);
  const remainingUSD = totalPriceUSD - depositUSD;
  const monthlyInstallmentUSD = Math.round(remainingUSD / durationMonths);
  const weeklyInstallmentUSD = Math.round(remainingUSD / (durationMonths * 4));

  const priceDeposit = formatPrice(depositUSD);
  const priceMonthly = formatPrice(monthlyInstallmentUSD);
  const priceWeekly = formatPrice(weeklyInstallmentUSD);

  const whatsappLayawayMsg = encodeURIComponent(
    `Hello ZimMobile Zimbabwe! 🤝\nI want to initiate an EcoCash Layaway Plan for:\n*${product.name}* ($${totalPriceUSD} USD)\n• Initial Deposit (${depositPercent}%): $${depositUSD} USD\n• Duration: ${durationMonths} Month(s)\n• Monthly installment: $${monthlyInstallmentUSD} USD\n\nName: ${customerName || 'Customer'}\nPhone: ${customerPhone || 'Not provided'}\n\nPlease send me the EcoCash merchant layaway reference code!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={closeLayaway} />

      <div className="relative w-full max-w-xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950 font-display">
                EcoCash Layaway Plan
              </h3>
              <p className="text-[11px] text-zinc-400">
                Lock in your price today with 0% interest & pay flexible installments
              </p>
            </div>
          </div>
          <button 
            onClick={closeLayaway}
            className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Select Phone */}
          <div>
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-1.5">
              Select Device to Reserve
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs sm:text-sm text-white light:text-zinc-900 font-semibold"
            >
              {PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.variants[0].priceUSD} USD)
                </option>
              ))}
            </select>
          </div>

          {/* Deposit Percentage */}
          <div>
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-2">
              Choose Initial EcoCash Deposit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 35, 50].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDepositPercent(pct as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    depositPercent === pct 
                      ? 'border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301] font-bold' 
                      : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white text-zinc-300'
                  }`}
                >
                  <div className="text-sm font-black">{pct}%</div>
                  <div className="text-[10px] opacity-75">${Math.round((totalPriceUSD * pct) / 100)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration in months */}
          <div>
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-2">
              Select Layaway Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { months: 1, label: '30 Days (1 Month)' },
                { months: 2, label: '60 Days (2 Months)' },
                { months: 3, label: '90 Days (3 Months)' }
              ].map(d => (
                <button
                  key={d.months}
                  onClick={() => setDurationMonths(d.months as any)}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    durationMonths === d.months 
                      ? 'border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301] font-bold' 
                      : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white text-zinc-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Installment breakdown card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131620] to-[#1C202F] light:from-white light:to-zinc-100 border border-[#F5B301]/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Deposit Due Today:</span>
              <span className="text-base font-black text-[#F5B301]">{priceDeposit.primary} ({priceDeposit.secondary})</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
              <span className="text-zinc-400">Monthly Installment ({durationMonths}x):</span>
              <span className="text-white light:text-zinc-900 font-bold">{priceMonthly.primary} / month</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
              <span className="text-zinc-400">Weekly Equivalent:</span>
              <span className="text-emerald-400 font-semibold">{priceWeekly.primary} / week</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-zinc-400">
              <span>Interest & Extra Fees:</span>
              <span className="font-bold text-emerald-400 uppercase">0% Interest Guarantee</span>
            </div>
          </div>

          {/* Action */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/263771234567?text=${whatsappLayawayMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-2xl bg-[#25D366] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#25D366]/20 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Lock This Device via WhatsApp Concierge</span>
            </a>
            <p className="text-[10px] text-center text-zinc-500">
              Device is securely locked in our Harare vault until the final installment is paid.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

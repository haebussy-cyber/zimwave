import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  Check, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const TradeInModal: React.FC = () => {
  const { isTradeInOpen, closeTradeIn, formatPrice } = useStore();

  const [currentBrand, setCurrentBrand] = useState('Apple');
  const [currentModel, setCurrentModel] = useState('iPhone 12');
  const [currentStorage, setCurrentStorage] = useState('128GB');
  const [condition, setCondition] = useState<'flawless' | 'good' | 'fair' | 'cracked'>('good');
  const [batteryHealth, setBatteryHealth] = useState('86%');
  const [targetPhoneId, setTargetPhoneId] = useState(PRODUCTS[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isTradeInOpen) return null;

  // Calculate estimated trade-in valuation
  const calculateTradeInValue = () => {
    let base = 200;
    if (currentBrand === 'Apple') {
      if (currentModel.includes('14')) base = 480;
      else if (currentModel.includes('13')) base = 350;
      else if (currentModel.includes('12')) base = 260;
      else if (currentModel.includes('11')) base = 190;
    } else if (currentBrand === 'Samsung') {
      if (currentModel.includes('S23')) base = 420;
      else if (currentModel.includes('S22')) base = 310;
      else if (currentModel.includes('S21')) base = 220;
      else base = 150;
    } else {
      base = 120;
    }

    if (condition === 'flawless') base *= 1.15;
    if (condition === 'fair') base *= 0.8;
    if (condition === 'cracked') base *= 0.5;

    return Math.round(base);
  };

  const estimatedValueUSD = calculateTradeInValue();
  const targetProduct = PRODUCTS.find(p => p.id === targetPhoneId) || PRODUCTS[0];
  const targetPriceUSD = targetProduct.variants[0].priceUSD;
  const netTopUpUSD = Math.max(0, targetPriceUSD - estimatedValueUSD);

  const priceValuation = formatPrice(estimatedValueUSD);
  const priceTopUp = formatPrice(netTopUpUSD);

  const whatsappTradeMsg = encodeURIComponent(
    `Hello ZimMobile Trade-in Desk! 🔄\nI would like to trade in my current phone:\n• Brand & Model: ${currentBrand} ${currentModel} (${currentStorage})\n• Condition: ${condition.toUpperCase()}\n• Battery Health: ${batteryHealth}\n• Estimated Trade-in Credit: $${estimatedValueUSD} USD\n\nI want to upgrade to: *${targetProduct.name}*\n• Estimated Cash Top-up: $${netTopUpUSD} USD\n\nName: ${customerName || 'Customer'}\nPhone: ${customerPhone || 'Not provided'}\n\nPlease confirm inspection appointment at your Harare / Bulawayo branch!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={closeTradeIn} />

      <div className="relative w-full max-w-xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950 font-display">
                Trade-In Estimator
              </h3>
              <p className="text-[11px] text-zinc-400">
                Swap your old phone for instant store credit towards a new device
              </p>
            </div>
          </div>
          <button 
            onClick={closeTradeIn}
            className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Step 1: Your Current Phone */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block">
              1. What phone are you trading in?
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Brand</label>
                <select
                  value={currentBrand}
                  onChange={(e) => setCurrentBrand(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs text-white light:text-zinc-900"
                >
                  <option value="Apple">Apple iPhone</option>
                  <option value="Samsung">Samsung Galaxy</option>
                  <option value="Xiaomi">Xiaomi / Redmi</option>
                  <option value="Tecno">Tecno / Infinix</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Model</label>
                <input
                  type="text"
                  value={currentModel}
                  onChange={(e) => setCurrentModel(e.target.value)}
                  placeholder="e.g. iPhone 12 Pro"
                  className="w-full h-10 px-3 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs text-white light:text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Storage</label>
                <select
                  value={currentStorage}
                  onChange={(e) => setCurrentStorage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs text-white light:text-zinc-900"
                >
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Battery Health % (Approx)</label>
                <input
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="e.g. 88%"
                  className="w-full h-10 px-3 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs text-white light:text-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Condition Chips */}
          <div>
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-2">
              Cosmetic Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'flawless', label: 'Flawless (No scratches)' },
                { id: 'good', label: 'Good (Minor wear)' },
                { id: 'fair', label: 'Fair (Noticeable dings)' },
                { id: 'cracked', label: 'Cracked Screen / Back' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCondition(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    condition === opt.id 
                      ? 'border-[#F5B301] bg-[#F5B301]/10 text-[#F5B301] font-bold' 
                      : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Upgrade Device */}
          <div>
            <label className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider block mb-1.5">
              2. Which new phone do you want to upgrade to?
            </label>
            <select
              value={targetPhoneId}
              onChange={(e) => setTargetPhoneId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 text-xs sm:text-sm text-white light:text-zinc-900 font-semibold"
            >
              {PRODUCTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — from ${p.variants[0].priceUSD} USD
                </option>
              ))}
            </select>
          </div>

          {/* Instant Valuation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131620] to-[#1C202F] light:from-white light:to-zinc-100 border border-[#F5B301]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Estimated Trade-in Credit:</span>
              <span className="text-xl font-black text-emerald-400 font-display">
                +${estimatedValueUSD} USD
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
              <span className="text-zinc-400">New Phone Retail:</span>
              <span className="text-white light:text-zinc-900 font-bold">${targetPriceUSD} USD</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-xs font-bold text-white light:text-zinc-900">Estimated Cash Top-Up:</span>
              <div className="text-right">
                <span className="text-lg font-black text-[#F5B301] font-display">
                  {priceTopUp.primary}
                </span>
                <span className="text-[10px] text-zinc-400 block">≈ {priceTopUp.secondary}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Action */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/263771234567?text=${whatsappTradeMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-2xl bg-[#25D366] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#25D366]/20 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Submit Valuation to WhatsApp Concierge</span>
            </a>
            <p className="text-[10px] text-center text-zinc-500">
              Bring device to our Eastgate Harare or Ascot Bulawayo stores for instant 15-minute verification & phone handover.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

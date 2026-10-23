import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Smartphone, 
  Camera, 
  BatteryCharging, 
  Cpu, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const PhoneFinderModal: React.FC = () => {
  const { 
    isPhoneFinderOpen, 
    closePhoneFinder, 
    products, 
    openProductModal, 
    formatPrice,
    addToCart 
  } = useStore();

  const [step, setStep] = useState(1);
  const [budgetRange, setBudgetRange] = useState<'budget' | 'mid' | 'premium' | 'flagship'>('mid');
  const [primaryPriority, setPrimaryPriority] = useState<'camera' | 'battery' | 'performance' | 'value'>('camera');
  const [brandPreference, setBrandPreference] = useState<'any' | 'Apple' | 'Samsung' | 'Xiaomi' | 'Tecno'>('any');
  const [conditionPref, setConditionPref] = useState<'any' | 'new' | 'preowned'>('any');

  if (!isPhoneFinderOpen) return null;

  // Filter & score products
  const calculateMatches = (): { product: Product; score: number; reason: string }[] => {
    return products.map(product => {
      let score = 70;
      let reason = 'Balanced daily driver with great specs';
      const minPrice = Math.min(...product.variants.map(v => v.priceUSD));

      // Budget scoring
      if (budgetRange === 'budget' && minPrice <= 250) {
        score += 25;
        reason = 'Perfect fit for your under $250 budget';
      } else if (budgetRange === 'mid' && minPrice > 250 && minPrice <= 600) {
        score += 25;
        reason = 'Unmatched price-to-performance sweet spot';
      } else if (budgetRange === 'premium' && minPrice > 600 && minPrice <= 1100) {
        score += 25;
        reason = 'High-end specs with flagship materials';
      } else if (budgetRange === 'flagship' && minPrice > 1000) {
        score += 25;
        reason = 'Zero compromises: ultimate mobile engineering';
      }

      // Priority scoring
      if (primaryPriority === 'camera' && (product.tags.includes('Leica') || product.name.includes('Pro Max') || product.name.includes('Ultra'))) {
        score += 20;
        reason = 'Class-leading sensors and low-light optical zoom';
      }
      if (primaryPriority === 'battery' && product.specs.battery.includes('5,000')) {
        score += 20;
        reason = 'Massive 5,000mAh cell with fast charging';
      }
      if (primaryPriority === 'performance' && (product.specs.processor.includes('A18') || product.specs.processor.includes('Snapdragon 8'))) {
        score += 20;
        reason = 'Elite flagship silicon ready for heavy multitasking';
      }

      // Brand match
      if (brandPreference !== 'any' && product.brand === brandPreference) {
        score += 15;
      }

      // Condition match
      if (conditionPref === 'new' && product.condition === 'Brand New Sealed') score += 10;
      if (conditionPref === 'preowned' && product.condition.includes('Pre-Owned')) score += 10;

      return { product, score: Math.min(99, score), reason };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const matches = calculateMatches();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={closePhoneFinder} />

      <div className="relative w-full max-w-xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950 font-display">
                Smart Phone Finder
              </h3>
              <p className="text-[11px] text-zinc-400">
                {step <= 4 ? `Question ${step} of 4 • Tailored for Zimbabwean Users` : 'Your Tailored Matches'}
              </p>
            </div>
          </div>
          <button 
            onClick={closePhoneFinder}
            className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Question 1: Budget */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white light:text-zinc-900 font-display">
                  What is your ideal budget in USD?
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  We price in USD with instant EcoCash & Cash on Delivery options.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'budget', label: 'Under $200 USD', desc: 'Tecno Spark, Redmi budget champions' },
                  { id: 'mid', label: '$200 - $550 USD', desc: 'Galaxy A55, iPhone 13, Redmi Note 13 Pro+' },
                  { id: 'premium', label: '$550 - $1,000 USD', desc: 'iPhone 15 Pro, Pixel 8 Pro, Z Fold 5' },
                  { id: 'flagship', label: '$1,000+ USD Flagship', desc: 'iPhone 16 Pro Max, S24 Ultra, Xiaomi 14 Ultra' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setBudgetRange(item.id as any);
                      setStep(2);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      budgetRange === item.id 
                        ? 'border-[#F5B301] bg-[#F5B301]/10 ring-1 ring-[#F5B301]' 
                        : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white hover:border-white/25'
                    }`}
                  >
                    <div className="text-xs font-bold text-white light:text-zinc-900">{item.label}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Priority */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white light:text-zinc-900 font-display">
                  What feature matters most for your daily use?
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Tell us where your phone needs to excel.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'camera', label: 'Pro Camera & Zoom', icon: Camera, desc: 'High-res sensors, portrait skin tones & 4K video' },
                  { id: 'battery', label: '2-Day Battery Life', icon: BatteryCharging, desc: '5,000mAh + 67W/120W rapid charging' },
                  { id: 'performance', label: 'Heavy Gaming & Speed', icon: Cpu, desc: 'Flagship processors with high-refresh screens' },
                  { id: 'value', label: 'Maximum Value for Money', icon: Smartphone, desc: 'Best specs per dollar spent' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPrimaryPriority(item.id as any);
                        setStep(3);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        primaryPriority === item.id 
                          ? 'border-[#F5B301] bg-[#F5B301]/10 ring-1 ring-[#F5B301]' 
                          : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white hover:border-white/25'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#F5B301] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white light:text-zinc-900">{item.label}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question 3: Brand */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white light:text-zinc-900 font-display">
                  Do you have a preferred brand eco-system?
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Choose your loyal preference or keep it open.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['any', 'Apple', 'Samsung', 'Xiaomi', 'Tecno'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      setBrandPreference(brand as any);
                      setStep(4);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      brandPreference === brand 
                        ? 'border-[#F5B301] bg-[#F5B301]/10 font-bold text-[#F5B301]' 
                        : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white text-zinc-300 light:text-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-bold capitalize">
                      {brand === 'any' ? 'No Preference' : brand}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Condition */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white light:text-zinc-900 font-display">
                  Box Condition Preference
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  All devices (new or certified pristine) include our 12-month Harare warranty.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'any', label: 'Show Best Option (Either New or Pristine)' },
                  { id: 'new', label: 'Brand New Factory Sealed Only' },
                  { id: 'preowned', label: 'Certified Pre-Owned Pristine (Save 20-30%)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setConditionPref(opt.id as any);
                      setStep(5);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      conditionPref === opt.id 
                        ? 'border-[#F5B301] bg-[#F5B301]/10 font-bold' 
                        : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white light:text-zinc-900">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Step */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white light:text-zinc-900 font-display">
                    Top Recommendations For You
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Calculated based on your budget & performance priorities.
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#F5B301] flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart</span>
                </button>
              </div>

              <div className="space-y-3">
                {matches.map(({ product, score, reason }) => {
                  const defaultVariant = product.variants[0];
                  const price = formatPrice(defaultVariant.priceUSD);
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl bg-[#131620] light:bg-white border border-white/8 light:border-black/8 flex gap-3 items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={defaultVariant.image} 
                          alt={product.name} 
                          className="w-14 h-14 object-contain rounded-xl bg-black/20 p-1 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white light:text-zinc-900 font-display">
                              {product.name}
                            </span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              {score}% MATCH
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                            {reason}
                          </div>
                          <div className="text-xs font-bold text-[#F5B301] light:text-[#D99B00] mt-1">
                            {price.primary} <span className="text-[10px] text-zinc-500">({price.secondary})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            closePhoneFinder();
                            openProductModal(product);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white light:text-zinc-900 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product, defaultVariant, 1);
                            closePhoneFinder();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F5B301] text-black text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

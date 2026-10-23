import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  Tag, 
  Check, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PROMO_CODES } from '../../data/products';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateCartQuantity, 
    openCheckout, 
    formatPrice,
    cartTotalUSD,
    cartTotalCount,
    activeCity
  } = useStore();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountUSD: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
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
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 100;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotalUSD);
  const progressPercent = Math.min(100, Math.round((cartTotalUSD / FREE_DELIVERY_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    const promo = PROMO_CODES[code];

    if (!promo) {
      setPromoError('Invalid voucher code. Try "HARAREFREE" or "ECOCASH5"');
      return;
    }

    if (cartTotalUSD < promo.minOrderUSD) {
      setPromoError(`Minimum order of $${promo.minOrderUSD} required for this voucher`);
      return;
    }

    let discount = 0;
    if (promo.discountPercent) {
      discount = Math.round((cartTotalUSD * promo.discountPercent) / 100);
    } else if (promo.discountUSD) {
      discount = promo.discountUSD;
    }

    setAppliedPromo({
      code,
      discountUSD: discount,
      description: promo.description
    });
    setPromoCodeInput('');
  };

  const finalSubtotalUSD = cartTotalUSD;
  const discountAmountUSD = appliedPromo ? appliedPromo.discountUSD : 0;
  const estimatedDeliveryUSD = cartTotalUSD >= FREE_DELIVERY_THRESHOLD || (appliedPromo?.code === 'HARAREFREE') ? 0 : 5;
  const finalTotalUSD = Math.max(0, finalSubtotalUSD - discountAmountUSD + estimatedDeliveryUSD);

  const priceTotal = formatPrice(finalTotalUSD);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeCart} />

      {/* Drawer */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cart-dialog-title" tabIndex={-1} className="relative w-full max-w-md h-full bg-[#0B0D12] light:bg-[#F7F6F2] border-l border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/8 light:border-black/8 flex items-center justify-between bg-[#131620] light:bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F5B301]" />
            <h2 id="cart-dialog-title" className="text-base font-bold text-white light:text-zinc-950 font-display">
              Your Bag ({cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white light:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Tracker */}
        <div className="px-4 py-3 bg-[#131620]/60 light:bg-zinc-100 border-b border-white/5 text-xs">
          {remainingForFreeDelivery > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-zinc-300 light:text-zinc-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#F5B301]" />
                  Add <strong className="text-[#F5B301] light:text-[#D99B00]">${remainingForFreeDelivery}</strong> more for Free Harare Delivery!
                </span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 light:bg-black/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#F5B301] to-[#00C27A] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>You've unlocked Free Same-Day Harare Delivery! 🎉</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 light:bg-black/5 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8 text-[#F5B301]/60" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white light:text-zinc-900 font-display">
                  Your cart is empty. Let's fix that.
                </h3>
                <p className="text-xs text-zinc-400 light:text-zinc-500 mt-1 max-w-xs">
                  Discover genuine iPhones, Galaxy S24, or Tecno budget kings with instant EcoCash checkout.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 rounded-xl bg-[#F5B301] text-black text-xs font-bold shadow-lg shadow-[#F5B301]/20 hover:opacity-90 transition-opacity"
              >
                Browse Phones
              </button>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = formatPrice(item.variant.priceUSD * item.quantity);
              return (
                <div 
                  key={`${item.productId}-${item.variant.id}`}
                  className="p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5 light:border-black/5 flex gap-3 relative group"
                >
                  <img 
                    src={item.variant.image} 
                    alt={item.product.name} 
                    className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-xl bg-black/20 p-1 shrink-0" 
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white light:text-zinc-900 line-clamp-1 font-display">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.variant.id)}
                          aria-label={`Remove ${item.product.name} from cart`}
                          className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-zinc-400 light:text-zinc-500 mt-0.5">
                        {item.variant.storage} • {item.variant.colorName}
                      </div>

                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        ✓ 12-Month Stamped Zim Warranty
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 light:border-black/5">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-white/10 light:border-black/10 rounded-lg overflow-hidden bg-white/5 light:bg-black/5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.variant.id, item.quantity - 1)}
                          aria-label={`Decrease ${item.product.name} quantity`}
                          className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white light:text-zinc-900" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.variant.id, item.quantity + 1)}
                          aria-label={`Increase ${item.product.name} quantity`}
                          className="flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-[#F5B301] light:text-[#D99B00]">
                          {itemPrice.primary}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 light:border-black/10 bg-[#131620] light:bg-white space-y-3">
            
            {/* Promo Code Form */}
            <div>
              {appliedPromo ? (
                <div className="p-2.5 rounded-xl bg-[#F5B301]/10 border border-[#F5B301]/30 flex items-center justify-between text-xs text-[#F5B301]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Applied: {appliedPromo.code} (-${appliedPromo.discountUSD})</span>
                  </div>
                  <button 
                    onClick={() => setAppliedPromo(null)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter voucher (e.g. ECOCASH5)"
                    aria-label="Voucher code"
                    className="flex-1 h-9 px-3 rounded-xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 text-xs text-white light:text-zinc-900 placeholder:text-zinc-500 uppercase focus:outline-none focus:border-[#F5B301]"
                  />
                  <button
                    type="submit"
                    className="px-3 h-9 rounded-xl bg-white/10 light:bg-black/10 hover:bg-white/20 text-xs font-semibold text-white light:text-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <div className="text-[10px] text-rose-400 mt-1 pl-1">{promoError}</div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-400 light:text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white light:text-zinc-900 font-semibold">${finalSubtotalUSD.toLocaleString()}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[#F5B301]">
                  <span>Voucher Discount</span>
                  <span>-${appliedPromo.discountUSD}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Harare Same-Day Delivery</span>
                <span>{estimatedDeliveryUSD === 0 ? <strong className="text-emerald-400 font-semibold">FREE</strong> : `$${estimatedDeliveryUSD}`}</span>
              </div>
              <div className="pt-2 border-t border-white/5 light:border-black/5 flex items-baseline justify-between text-sm">
                <span className="font-bold text-white light:text-zinc-900">Total</span>
                <div className="text-right">
                  <span className="text-lg font-black text-[#F5B301] light:text-[#D99B00] font-display">
                    {priceTotal.primary}
                  </span>
                  <div className="text-[10px] text-zinc-400 font-normal">
                    ≈ {priceTotal.secondary}
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={openCheckout}
              className="w-full h-12 rounded-2xl bg-[#F5B301] light:bg-[#D99B00] text-black font-extrabold text-sm shadow-xl shadow-[#F5B301]/25 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>EcoCash USSD Instant Prompt • Cash on Delivery • 12-Mo Warranty</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

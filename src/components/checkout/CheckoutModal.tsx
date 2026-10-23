import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Smartphone, 
  CreditCard, 
  Building2, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  MessageCircle,
  Clock,
  Sparkles,
  QrCode,
  MapPin,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DeliveryMethod, PaymentMethodType, Order } from '../../types';
import { STORE_LOCATIONS, ZIM_EXCHANGE_RATE } from '../../data/products';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    isCheckoutOpen, 
    closeCheckout, 
    cartTotalUSD, 
    formatPrice, 
    placeOrder, 
    activeCity 
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Step 1: Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Step 2: Delivery Details
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('harare-same-day');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ecocash');
  const [ecocashPhone, setEcocashPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (!isCheckoutOpen) return null;

  // Delivery fee calculation
  const getDeliveryFee = () => {
    if (deliveryMethod.startsWith('store-pickup')) return 0;
    if (deliveryMethod === 'harare-same-day') {
      return cartTotalUSD >= 100 ? 0 : 5;
    }
    if (deliveryMethod === 'chitungwiza-same-day') return 7;
    if (deliveryMethod === 'provincial-courier') return 10;
    return 0;
  };

  const deliveryFee = getDeliveryFee();
  const grandTotalUSD = cartTotalUSD + deliveryFee;
  const priceGrand = formatPrice(grandTotalUSD);

  const handleProcessOrder = async () => {
    if (!customerName.trim() || customerPhone.trim().length < 7) {
      setOrderError('Enter your full name and a valid phone number.');
      return;
    }
    if (!deliveryMethod.startsWith('store-pickup') && !deliveryAddress.trim()) {
      setOrderError('Enter a delivery address or select store pickup.');
      return;
    }
    setOrderError('');
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName, customerPhone, customerEmail, deliveryCity: activeCity,
          deliveryAddress: deliveryMethod.startsWith('store-pickup')
            ? 'In-Store Pickup'
            : [deliveryAddress.trim(), specialInstructions.trim()].filter(Boolean).join(' — '),
          deliveryMethod, paymentMethod, paymentPhone: paymentMethod === 'ecocash' ? ecocashPhone : undefined,
          items: cart.map(item => ({ productId: item.productId, variantId: item.variant.id, quantity: item.quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Order could not be placed. Please try again.');
      const newOrder = result.order as Order;
      placeOrder(newOrder);
      setCreatedOrder(newOrder);
      setStep('success');
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Order could not be placed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // WhatsApp tracking link for completed order
  const whatsappTrackMsg = createdOrder
    ? encodeURIComponent(
        `Hello ZimMobile! 📦\nI just placed Order *${createdOrder.orderNumber}* for $${createdOrder.totalUSD} USD.\nName: ${createdOrder.customerName}\nPhone: ${createdOrder.customerPhone}\n\nPlease confirm my dispatch rider arrival time!`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeCheckout} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 light:border-black/10 shadow-2xl flex flex-col z-10 overflow-hidden my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 light:border-black/8 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950 font-display">
                {step === 'success' ? 'Order Confirmed!' : 'Express Checkout (Zimbabwe)'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {step === 'success' ? 'Your order has been recorded' : 'Step ' + step + ' of 3 • Guest checkout'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeCheckout}
            className="w-8 h-8 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        {step !== 'success' && (
          <div className="px-5 py-2.5 bg-[#131620]/60 light:bg-zinc-100 border-b border-white/5 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#F5B301] font-bold' : 'text-zinc-500'}`}>
              <span className="w-5 h-5 rounded-full bg-[#F5B301]/20 flex items-center justify-center text-[10px]">1</span>
              <span>Contact</span>
            </div>
            <span className="text-zinc-600">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#F5B301] font-bold' : 'text-zinc-500'}`}>
              <span className="w-5 h-5 rounded-full bg-[#F5B301]/20 flex items-center justify-center text-[10px]">2</span>
              <span>Delivery Address</span>
            </div>
            <span className="text-zinc-600">→</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#F5B301] font-bold' : 'text-zinc-500'}`}>
              <span className="w-5 h-5 rounded-full bg-[#F5B301]/20 flex items-center justify-center text-[10px]">3</span>
              <span>Payment (EcoCash)</span>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Guest contact details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white light:text-zinc-900 font-display">
                  Guest checkout
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Enter the contact details for this order. Phone verification is not currently available.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 light:text-zinc-700 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tendai Mutasa"
                    className="w-full h-11 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-xs sm:text-sm text-white light:text-zinc-900 focus:outline-none focus:border-[#F5B301]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 light:text-zinc-700 block mb-1">
                    Zimbabwe Phone Number (Econet / NetOne / Telecel)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 077 123 4567"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-xs sm:text-sm text-white light:text-zinc-900 focus:outline-none focus:border-[#F5B301]"
                    />
                  </div>
                </div>
              </div>

              <button type="button" disabled={!customerName.trim() || customerPhone.trim().length < 7}
                onClick={() => { setOrderError(''); setStep(2); }}
                className="w-full h-11 rounded-xl bg-[#F5B301] text-black font-bold text-xs sm:text-sm mt-3 flex items-center justify-center gap-1.5 disabled:opacity-50">
                <span>Continue as Guest</span><ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Delivery Method & Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white light:text-zinc-900 font-display">
                  Delivery Method & Address
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select doorstep delivery or free collection from our Harare & Bulawayo stores.
                </p>
              </div>

              {/* Delivery Options Cards */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'harare-same-day' as DeliveryMethod,
                    title: 'Harare Express Delivery (Same-Day)',
                    desc: 'Express bike rider arrives within 2-4 hours. Free for orders over $100.',
                    price: cartTotalUSD >= 100 ? 'FREE' : '$5'
                  },
                  {
                    id: 'chitungwiza-same-day' as DeliveryMethod,
                    title: 'Chitungwiza Express Delivery',
                    desc: 'Direct motorcycle delivery to Unit A through P & Seke.',
                    price: '$7'
                  },
                  {
                    id: 'provincial-courier' as DeliveryMethod,
                    title: 'Bulawayo / Provincial Courier (Swift Express)',
                    desc: 'Tracked insured overnight shipping to Bulawayo, Mutare, Gweru, Masvingo.',
                    price: '$10'
                  },
                  {
                    id: 'store-pickup-eastgate' as DeliveryMethod,
                    title: 'Collect at Eastgate Mall Harare',
                    desc: 'Shop 14 Ground Floor, Robert Mugabe Rd. Ready in 15 mins.',
                    price: 'FREE'
                  },
                  {
                    id: 'store-pickup-avondale' as DeliveryMethod,
                    title: 'Collect at Avondale Shopping Centre',
                    desc: 'Shop 2B, King George Rd, Harare. Ready in 15 mins.',
                    price: 'FREE'
                  }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      deliveryMethod === opt.id
                        ? 'border-[#F5B301] bg-[#F5B301]/10 ring-1 ring-[#F5B301]'
                        : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                        deliveryMethod === opt.id ? 'border-[#F5B301] bg-[#F5B301]' : 'border-zinc-500'
                      }`}>
                        {deliveryMethod === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white light:text-zinc-900">{opt.title}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#F5B301] light:text-[#D99B00] shrink-0">
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address inputs (if not pickup) */}
              {!deliveryMethod.startsWith('store-pickup') && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 light:text-zinc-700 block mb-1">
                      Street Address / House & Complex Details
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Stand 412, Borrowdale Brooke / 14 Fife Ave"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-xs sm:text-sm text-white light:text-zinc-900 focus:outline-none focus:border-[#F5B301]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 light:text-zinc-700 block mb-1">
                      Rider Notes / Landmarks (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Near total fuel station, white gate..."
                      className="w-full h-10 px-3.5 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-xs text-white light:text-zinc-900 focus:outline-none focus:border-[#F5B301]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 h-11 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 text-xs font-semibold text-zinc-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 h-11 rounded-xl bg-[#F5B301] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white light:text-zinc-900 font-display">
                  Select Zimbabwe Payment Method
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Payment providers are not connected yet. Orders remain unverified until payment is confirmed independently.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'ecocash' as PaymentMethodType,
                    name: 'EcoCash',
                    tag: 'Not connected',
                    desc: 'Select this to record your preferred method. No USSD request is sent by this site yet.',
                    icon: Zap
                  },
                  {
                    id: 'paynow' as PaymentMethodType,
                    name: 'PayNow',
                    tag: 'Not connected',
                    desc: 'No card payment is processed here; this choice is recorded for follow-up.',
                    icon: CreditCard
                  },
                  {
                    id: 'cod' as PaymentMethodType,
                    name: 'Cash on Delivery (Harare & Chitungwiza)',
                    tag: 'Payment pending',
                    desc: 'Cash collection is not verified until a team member confirms receipt.',
                    icon: DollarSign
                  },
                  {
                    id: 'store-pay' as PaymentMethodType,
                    name: 'Pay at Store Hub',
                    tag: 'Eastgate / Avondale',
                    desc: 'Payment is recorded as pending until staff confirm collection and payment.',
                    icon: Building2
                  }
                ].map(method => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#F5B301] bg-[#F5B301]/10 ring-1 ring-[#F5B301]'
                          : 'border-white/10 light:border-black/10 bg-[#131620] light:bg-white hover:border-white/20'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#F5B301] text-black font-bold' : 'bg-white/5 text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white light:text-zinc-900">{method.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F5B301]/15 text-[#F5B301] light:text-[#D99B00]">
                            {method.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{method.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EcoCash Phone Input */}
              {paymentMethod === 'ecocash' && (
                <div className="p-4 rounded-2xl bg-[#131620] light:bg-white border border-[#F5B301]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white light:text-zinc-900">EcoCash Subscriber Number</span>
                    <span className="text-[#F5B301] text-[10px]">Econet 077/078</span>
                  </div>
                  <input
                    type="tel"
                    value={ecocashPhone}
                    onChange={(e) => setEcocashPhone(e.target.value)}
                    placeholder="077 123 4567"
                    className="w-full h-11 px-3.5 rounded-xl bg-white/5 light:bg-black/5 border border-white/10 text-xs sm:text-sm text-white light:text-zinc-900 focus:outline-none focus:border-[#F5B301]"
                  />
                  <div className="text-[11px] text-zinc-400 leading-tight">No EcoCash USSD push is configured. This number is stored with the order for payment follow-up.</div>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-black/5 border border-white/5 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Items Subtotal</span>
                  <span>${cartTotalUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery ({deliveryMethod})</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-baseline justify-between text-sm font-bold text-white light:text-zinc-900">
                  <span>Final Total to Pay</span>
                  <div className="text-right">
                    <span className="text-base text-[#F5B301] light:text-[#D99B00] font-black font-display">
                      {priceGrand.primary}
                    </span>
                    <div className="text-[10px] text-zinc-400 font-normal">
                      ≈ {priceGrand.secondary}
                    </div>
                  </div>
                </div>
              </div>

              {orderError && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-xs text-red-400">{orderError}</p>}
              {/* Record the order; payment is not confirmed in this app. */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 h-12 rounded-2xl bg-white/5 light:bg-black/5 hover:bg-white/10 text-xs font-semibold text-zinc-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessOrder}
                  className="flex-1 h-12 rounded-2xl bg-[#F5B301] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#F5B301]/25 hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting order…</span>
                    </div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Place order — ${grandTotalUSD}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP: Success & Celebration */}
          {step === 'success' && createdOrder && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider">
                  Order received • Payment not yet verified
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white light:text-zinc-950 mt-1 font-display">
                  Order #{createdOrder.orderNumber}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
                  Thank you, <strong className="text-white light:text-zinc-900">{createdOrder.customerName}</strong>. We have reserved available stock and the team must confirm payment before fulfilment.
                </p>
              </div>

              {/* Delivery Details Card */}
              <div className="p-4 rounded-2xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Order status:</span>
                  <span className="font-bold text-white light:text-zinc-900 capitalize">{createdOrder.status}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Delivery Address:</span>
                  <span className="font-medium text-white light:text-zinc-900 max-w-[65%] text-right truncate">
                    {createdOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Payment Status:</span>
                  <span className="font-bold text-amber-400 uppercase">
                    {createdOrder.paymentStatus === 'paid' ? 'Paid' : createdOrder.paymentStatus === 'pending-cod' ? 'COD pending' : 'Unverified'}
                  </span>
                </div>
              </div>

              {/* WhatsApp Live Tracking CTA */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/263771234567?text=${whatsappTrackMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-2xl bg-[#25D366] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>Track My Order on WhatsApp</span>
                </a>

                <button
                  onClick={closeCheckout}
                  className="w-full h-11 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 light:text-zinc-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

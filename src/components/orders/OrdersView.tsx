import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Heart,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const OrdersView: React.FC = () => {
  const { orders, formatPrice, wishlist, openProductModal, addToCart } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white light:text-zinc-950 font-display">
            My Orders & Saved Devices
          </h2>
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#131620] light:bg-zinc-200 rounded-2xl border border-white/5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders' 
                ? 'bg-[#F5B301] text-black shadow-sm' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'wishlist' 
                ? 'bg-[#F5B301] text-black shadow-sm' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Wishlist ({wishlistedProducts.length})
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center sm:p-12">
              <Package className="mx-auto h-10 w-10 text-zinc-400" aria-hidden="true" />
              <h3 className="mt-3 text-base font-bold text-zinc-900">No orders to show yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-600">
                Orders placed from this session will appear here.
              </p>
            </div>
          ) : orders.map(order => {
            const price = formatPrice(order.totalUSD);

            // Determine timeline steps
            const timelineSteps = [
              { label: 'Order Confirmed', completed: true, time: order.createdAt },
              { label: 'Verified & Sealed', completed: ['packing', 'dispatching', 'delivered'].includes(order.status), time: '19:10' },
              { label: 'Out for Harare Delivery', completed: ['dispatching', 'delivered'].includes(order.status), time: '19:35' },
              { label: 'Delivered', completed: order.status === 'delivered', time: 'Pending' }
            ];

            return (
              <div 
                key={order.id}
                className="p-5 sm:p-7 rounded-3xl bg-[#131620] light:bg-white border border-white/8 light:border-black/8 shadow-xl space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5 light:border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F5B301]/10 flex items-center justify-center text-[#F5B301]">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white light:text-zinc-900 font-display">
                          Order {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 uppercase">
                          {order.paymentStatus === 'paid' ? 'Paid via EcoCash' : 'Cash on Delivery'}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">
                        Placed on {order.createdAt} • Destination: {order.deliveryCity}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-[#F5B301] light:text-[#D99B00] font-display">
                      {price.primary}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      ≈ {price.secondary}
                    </div>
                  </div>
                </div>

                {/* Visual Order Timeline Tracker */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider">
                    Live Dispatch Progress (Harare Logistics)
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {timelineSteps.map((step, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border text-xs ${
                          step.completed
                            ? 'border-[#F5B301]/40 bg-[#F5B301]/10 text-white light:text-zinc-900'
                            : 'border-white/5 bg-white/[0.02] text-zinc-500'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#F5B301]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />
                          )}
                          <span>{step.label}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">{step.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items & Rider Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  
                  {/* Item List (7 cols) */}
                  <div className="md:col-span-7 space-y-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Enclosed Hardware ({order.items.length})
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 light:bg-black/5">
                        <img src={item.image} alt={item.productName} className="w-12 h-12 object-contain rounded-xl bg-black/20 p-1 shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white light:text-zinc-900">{item.productName}</h4>
                          <span className="text-[11px] text-zinc-400">{item.variantLabel} • Qty: {item.quantity}</span>
                          <div className="text-[10px] text-emerald-400 mt-0.5">✓ 12-Month Stamped Zim Warranty</div>
                        </div>
                        <span className="text-xs font-bold text-[#F5B301]">${item.priceUSD * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Courier Contact (5 cols) */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-[#0B0D12] light:bg-[#F7F6F2] border border-white/5 space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Delivery Address:</span>
                      <strong className="text-white light:text-zinc-900 mt-0.5 block">{order.deliveryAddress}</strong>
                    </div>

                    {order.riderName && (
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-zinc-400 block text-[11px]">Assigned Dispatch Courier:</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-white light:text-zinc-900">{order.riderName}</span>
                          <span className="text-[#F5B301] font-semibold">{order.riderPhone}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <a
                        href={`https://wa.me/263771234567?text=${encodeURIComponent(
                          `Hello ZimMobile! Tracking inquiry for order ${order.orderNumber}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-10 rounded-xl bg-[#25D366] text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4 fill-black" />
                        <span>Contact Dispatch Rider</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#131620] light:bg-white border border-white/5 space-y-3">
              <Heart className="w-10 h-10 text-zinc-500 mx-auto" />
              <h3 className="text-base font-bold text-white light:text-zinc-900">Your wishlist is empty</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Tap the heart on any phone card to save devices for easy comparison later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlistedProducts.map(p => {
                const variant = p.variants[0];
                const price = formatPrice(variant.priceUSD);
                return (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#131620] light:bg-white border border-white/5 flex flex-col justify-between">
                    <div>
                      <img src={variant.image} alt={p.name} className="w-full aspect-square object-contain max-h-40 mb-2" />
                      <span className="text-[10px] text-[#F5B301] uppercase font-bold">{p.brand}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white light:text-zinc-900 line-clamp-1">{p.name}</h4>
                      <div className="text-sm font-black text-[#F5B301] mt-1 font-display">{price.primary}</div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => addToCart(p, variant, 1)}
                        className="flex-1 py-2 rounded-xl bg-[#F5B301] text-black font-bold text-xs"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => openProductModal(p)}
                        className="px-3 py-2 rounded-xl bg-white/10 text-white light:text-zinc-900 text-xs font-bold"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

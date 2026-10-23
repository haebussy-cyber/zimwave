import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useContent } from '../../context/ContentContext';
import { ZIM_EXCHANGE_RATE } from '../../data/products';
import { Order } from '../../types';
import { ProductsTab, HomepageTab } from './AdminTabs';

type Tab = 'overview' | 'products' | 'homepage' | 'orders' | 'cod';
const LOW_STOCK = 3;
const card = 'p-4 rounded-2xl bg-[#131620] light:bg-white border border-white/5';

export const AdminPortal: React.FC = () => {
  const { isAdminOpen, closeAdmin, orders, updateOrderStatus } = useStore();
  const { products } = useContent();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!isAdminOpen) return null;

  // Revenue/EcoCash figures are still placeholders until orders come from a real backend.
  const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalUSD : 0), 18450);
  const codPendingCount = orders.filter(o => o.paymentMethod === 'cod' && o.paymentStatus !== 'paid').length + 2;

  // Real numbers from the catalogue
  const variants = products.flatMap(p => (p as any).variants.map((v: any) => ({ p: p as any, v })));
  const unitsInStock = variants.reduce((s, x) => s + x.v.stock, 0);
  const lowStock = variants.filter(x => x.v.stock <= LOW_STOCK);
  const featuredCount = products.filter(p => (p as any).isFeatured).length;
  const stockValue = variants.reduce((s, x) => s + x.v.stock * x.v.priceUSD, 0);

  const tabs: [Tab, string][] = [
    ['overview', 'Overview'],
    ['products', `Products (${products.length})`],
    ['homepage', 'Homepage'],
    ['orders', `Orders (${orders.length})`],
    ['cod', `COD (${codPendingCount})`],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={closeAdmin} />
      <div className="relative w-full max-w-5xl bg-[#0B0D12] light:bg-[#F7F6F2] rounded-3xl border border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[92vh]">
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#131620] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5B301] text-black font-black flex items-center justify-center text-sm">ZM</div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white light:text-zinc-950">Shop dashboard</h3>
              <p className="text-[11px] text-zinc-400">Manage products, homepage, orders and cash collections</p>
            </div>
          </div>
          <button onClick={closeAdmin} aria-label="Close dashboard" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-[#131620]/60 light:bg-zinc-100 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${activeTab === id ? 'bg-[#F5B301] text-black' : 'text-zinc-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className={card}>
                  <span className="text-[11px] text-zinc-400">Revenue this month</span>
                  <div className="text-xl sm:text-2xl font-black text-[#F5B301] mt-1">${totalRevenueUSD.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">≈ ZiG {(totalRevenueUSD * ZIM_EXCHANGE_RATE).toLocaleString()}</div>
                </div>
                <div className={card}>
                  <span className="text-[11px] text-zinc-400">Products on the shop</span>
                  <div className="text-xl sm:text-2xl font-black text-white light:text-zinc-900 mt-1">{products.length}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{featuredCount} featured on homepage</div>
                </div>
                <div className={card}>
                  <span className="text-[11px] text-zinc-400">Units in stock</span>
                  <div className="text-xl sm:text-2xl font-black text-white light:text-zinc-900 mt-1">{unitsInStock}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Worth ${stockValue.toLocaleString()} at shop prices</div>
                </div>
                <div className={card}>
                  <span className="text-[11px] text-zinc-400">Needs restocking</span>
                  <div className={`text-xl sm:text-2xl font-black mt-1 ${lowStock.length ? 'text-amber-400' : 'text-emerald-400'}`}>{lowStock.length}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{LOW_STOCK} units or fewer</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Restock soon</h4>
                  {lowStock.slice(0, 6).map(({ p, v }) => (
                    <div key={`${p.id}-${v.id ?? v.storage}-${v.color}`} className="p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5 flex items-center gap-3 text-xs">
                      <img src={v.image} alt="" className="w-9 h-9 object-contain rounded-lg bg-black/20" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white light:text-zinc-900 truncate">{p.name}</div>
                        <div className="text-[11px] text-zinc-400">{[v.storage, v.color].filter(Boolean).join(' • ')}</div>
                      </div>
                      <span className={`font-bold ${v.stock === 0 ? 'text-red-400' : 'text-amber-400'}`}>{v.stock === 0 ? 'Sold out' : `${v.stock} left`}</span>
                    </div>
                  ))}
                  {!lowStock.length && <p className="text-xs text-zinc-400">Every variant is well stocked.</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Recent orders</h4>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-[#F5B301] hover:underline">View all</button>
                  </div>
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white light:text-zinc-900">{o.customerName} ({o.orderNumber})</div>
                        <div className="text-[11px] text-zinc-400">{o.items[0]?.productName} • {o.deliveryCity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[#F5B301]">${o.totalUSD}</div>
                        <span className="text-[10px] font-semibold text-emerald-400 capitalize">{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {!orders.length && <p className="text-xs text-zinc-400">No orders yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'homepage' && <HomepageTab />}

          {activeTab === 'orders' && (
            <div className="space-y-3 text-xs">
              <p className="text-zinc-400">Change an order’s status so the customer and rider can follow it.</p>
              {orders.map(order => (
                <div key={order.id} className={`${card} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white light:text-zinc-900 text-sm">{order.orderNumber}</span>
                      <span className="text-zinc-400 ml-2">by {order.customerName} ({order.customerPhone})</span>
                    </div>
                    <span className="font-black text-[#F5B301] text-sm">${order.totalUSD}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
                    <span className="text-zinc-400">Status:</span>
                    {(['confirmed', 'packing', 'dispatching', 'delivered'] as Order['status'][]).map(st => (
                      <button key={st} onClick={() => updateOrderStatus(order.id, st)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize ${order.status === st ? 'bg-[#F5B301] text-black' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!orders.length && <p className="text-zinc-400 py-8 text-center">Orders will appear here as customers check out.</p>}
            </div>
          )}

          {activeTab === 'cod' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5B301]/10 border border-[#F5B301]/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F5B301] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white light:text-zinc-900">Cash-on-delivery rider protocol</h4>
                  <p className="text-zinc-300 light:text-zinc-700 text-[11px] mt-0.5 leading-relaxed">
                    Riders carry sealed tamper-evident pouches with signed 12-month warranty cards. Cash collected in USD must be deposited at Eastgate Harare treasury before 6:30 PM.
                  </p>
                </div>
              </div>
              <div className={`${card} flex items-center justify-between`}>
                <div>
                  <div className="font-bold text-white light:text-zinc-900">Rider Tendai (Bike #04) - Fife Avenue Delivery</div>
                  <div className="text-[11px] text-zinc-400">Order ZM-84920 • $1,450 USD cash pending handover</div>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30">Mark reconciled</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
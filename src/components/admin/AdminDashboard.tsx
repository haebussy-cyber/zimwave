import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowUp, Boxes, Check, ChevronRight, CircleDollarSign,
  ClipboardList, FolderTree, Image as ImageIcon, LayoutDashboard, Package, Plus, Search,
  Settings, ShieldCheck, ShoppingBag, Trash2, Users,
} from 'lucide-react';
import type { Order, Product, ProductVariant } from '../../types';
import { DEFAULT_CONTENT, type Banner, type SiteContent } from '../../context/ContentContext';
import { useContent } from '../../context/ContentContext';
import { useStore } from '../../context/StoreContext';
import { adminRequest, uploadAdminImage } from '../../lib/supabase';
import { Field, ImagePicker, inputCls, ProductEditor } from './ProductEditor';

type Page = 'overview' | 'products' | 'inventory' | 'orders' | 'categories' | 'banners' | 'customers' | 'settings';
type Category = { id: string; name: string; slug: string; active: boolean; sort_order: number };
type AdminData = {
  products: Product[];
  orders: Order[];
  categories: Category[];
  content: SiteContent | null;
  lowStockThreshold: number;
  summary: {
    productCount: number; inStock: number; outOfStock: number; lowStock: number;
    totalOrders: number; pendingOrders: number; salesUSD: number; customers: number;
  };
};

const navigation: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'banners', label: 'Banners', icon: ImageIcon },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const blankData: AdminData = {
  products: [], orders: [], categories: [], content: DEFAULT_CONTENT, lowStockThreshold: 3,
  summary: { productCount: 0, inStock: 0, outOfStock: 0, lowStock: 0, totalOrders: 0, pendingOrders: 0, salesUSD: 0, customers: 0 },
};
const card = 'rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm';
const labelClass = 'text-xs font-medium text-zinc-600';

export const AdminDashboard: React.FC = () => {
  const { isAdminOpen, closeAdmin } = useStore();
  const { refreshCatalog } = useContent();
  const forceOpen = window.location.pathname === '/admin';
  const open = isAdminOpen || forceOpen;
  const [page, setPage] = useState<Page>('overview');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [data, setData] = useState<AdminData>(blankData);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<Category | null>(null);
  const [contentDraft, setContentDraft] = useState<SiteContent>(DEFAULT_CONTENT);
  const [thresholdDraft, setThresholdDraft] = useState('3');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const load = useCallback(async () => {
    const result = await adminRequest<AdminData>({ action: 'load' });
    setData({ ...result, content: result.content ?? DEFAULT_CONTENT });
    setContentDraft(result.content ?? DEFAULT_CONTENT);
    setThresholdDraft(String(result.lowStockThreshold));
  }, []);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    void load().catch(loadError => {
      if (alive) setError(loadError instanceof Error ? loadError.message : 'Unable to load admin data.');
    });
    return () => { alive = false; };
  }, [open, load]);

  const refresh = async (refreshPublic = false) => {
    setError('');
    await load();
    if (refreshPublic) await refreshCatalog();
  };
  const run = async (action: () => Promise<void>, success?: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      if (success) setNotice(success);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'The requested change failed.');
    } finally { setBusy(false); }
  };
  const variants = useMemo(() => data.products.flatMap(product =>
    product.variants.map(variant => ({ product, variant })),
  ), [data.products]);
  const customers = useMemo(() => {
    const unique = new Map<string, { name: string; phone: string; email?: string; orders: number; spend: number }>();
    data.orders.forEach(order => {
      const entry = unique.get(order.customerPhone) ?? {
        name: order.customerName, phone: order.customerPhone, email: order.customerEmail, orders: 0, spend: 0,
      };
      entry.orders += 1;
      if (order.paymentStatus === 'paid') entry.spend += order.totalUSD;
      unique.set(order.customerPhone, entry);
    });
    return [...unique.values()];
  }, [data.orders]);
  const q = search.trim().toLowerCase();
  const filteredProducts = data.products.filter(product =>
    `${product.name} ${product.brand} ${product.category ?? ''} ${product.variants.map(v => v.sku).join(' ')}`.toLowerCase().includes(q),
  );
  const filteredOrders = data.orders.filter(order =>
    `${order.orderNumber} ${order.customerName} ${order.customerPhone}`.toLowerCase().includes(q),
  );
  const filteredVariants = variants.filter(({ product, variant }) =>
    `${product.name} ${product.brand} ${product.category ?? ''} ${variant.sku}`.toLowerCase().includes(q),
  );
  const filteredCustomers = customers.filter(customer =>
    `${customer.name} ${customer.phone} ${customer.email ?? ''}`.toLowerCase().includes(q),
  );
  const productPage = filteredProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  const orderPage = filteredOrders.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  const inventoryPage = filteredVariants.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const saveProduct = async (product: Product) => {
    await run(async () => {
      await adminRequest({ action: 'product.save', product });
      await refresh(true);
      setEditing(null);
    }, 'Product saved to the catalogue.');
  };
  const upload = async (file: File) => uploadAdminImage(file);
  const saveContent = async () => {
    await run(async () => {
      await adminRequest({ action: 'content.save', content: contentDraft });
      await refresh(true);
    }, 'Homepage banners and content saved.');
  };
  const saveCategory = async () => {
    if (!categoryDraft) return;
    await run(async () => {
      await adminRequest({ action: 'category.save', id: categoryDraft.id, name: categoryDraft.name, slug: categoryDraft.slug, sortOrder: categoryDraft.sort_order, active: categoryDraft.active });
      setCategoryDraft(null);
      await refresh(true);
    }, 'Category saved.');
  };
  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete category “${category.name}”? Products will be preserved and unassigned.`)) return;
    await run(async () => {
      await adminRequest({ action: 'category.delete', id: category.id });
      await refresh(true);
    }, 'Category deleted; product records were preserved.');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#f5f5f3] text-zinc-900">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#141518] px-4 py-5 text-white md:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5B301] font-black text-black">ZM</span>
          <div><div className="font-bold">ZimMobile</div><div className="text-xs text-zinc-400">Store administration</div></div>
        </div>
        <nav className="mt-5 flex-1 space-y-1">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); setSearch(''); }} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium ${page === id ? 'bg-[#F5B301] text-black' : 'text-zinc-300 hover:bg-white/10'}`}>
              <Icon className="h-4 w-4" />{label}
              {id === 'orders' && data.summary.pendingOrders > 0 && <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px]">{data.summary.pendingOrders}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-7">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Store management</p><h1 className="text-xl font-bold">{navigation.find(item => item.id === page)?.label}</h1></div>
          <div className="flex items-center gap-2">
            <label className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${page}…`} className="h-10 w-60 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></label>
            {!forceOpen && <button onClick={closeAdmin} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm">Close</button>}
          </div>
          <div className="flex w-full gap-1 overflow-x-auto md:hidden">
            {navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setPage(id); setPageNumber(1); setSearch(''); }} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs ${page === id ? 'bg-[#F5B301] font-bold text-black' : 'bg-zinc-100 text-zinc-600'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}
          </div>
          {['products', 'inventory', 'orders', 'customers'].includes(page) && <label className="relative block w-full sm:hidden"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={e => { setSearch(e.target.value); setPageNumber(1); }} placeholder={`Search ${page}…`} className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none focus:border-amber-500" /></label>}
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-7">
          {(error || notice) && <div className={`mb-5 flex items-center gap-2 rounded-xl p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`} role={error ? 'alert' : 'status'}>{error ? <AlertTriangle className="h-4 w-4" /> : <Check className="h-4 w-4" />}{error || notice}<button className="ml-auto" onClick={() => { setError(''); setNotice(''); }}>×</button></div>}
          {busy && <p className="mb-3 text-xs text-zinc-500" role="status">Saving changes…</p>}

          {page === 'overview' && <section className="space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat icon={Package} label="Total products" value={data.summary.productCount} />
              <Stat icon={Boxes} label="Variants in stock" value={data.summary.inStock} note={`${data.summary.outOfStock} out of stock`} />
              <Stat icon={AlertTriangle} label="Low-stock variants" value={data.summary.lowStock} note={`Threshold: ${data.lowStockThreshold}`} />
              <Stat icon={ShoppingBag} label="Total orders" value={data.summary.totalOrders} note={`${data.summary.pendingOrders} open / unpaid`} />
              <Stat icon={CircleDollarSign} label="Verified sales" value={`$${data.summary.salesUSD.toLocaleString()}`} note="Paid orders only" />
              <Stat icon={Activity} label="Pending orders" value={data.summary.pendingOrders} />
              <Stat icon={Users} label="Customers" value={data.summary.customers} note="From recorded orders" />
              <Stat icon={ShieldCheck} label="Payment safety" value="Verified only" note="Fulfilment cannot mark payments paid" />
            </div>
            <div className={card}>
              <SectionHeading title="Recent orders" action={() => setPage('orders')} />
              <OrderTable orders={data.orders.slice(0, 6)} onStatus={async (order, status) => {
                await run(async () => { await adminRequest({ action: 'order.status', id: order.id, status }); await refresh(); }, 'Order status updated.');
              }} />
              {!data.orders.length && <Empty>No orders have been placed yet.</Empty>}
            </div>
            <div className={card}>
              <SectionHeading title="Stock requiring attention" action={() => setPage('inventory')} />
              <InventoryTable rows={variants.filter(({ variant }) => variant.stock <= data.lowStockThreshold).slice(0, 8)} threshold={data.lowStockThreshold} onSet={async (product, variant, quantity) => {
                await run(async () => { await adminRequest({ action: 'inventory.update', productId: product.id, variantId: variant.id, quantity }); await refresh(true); }, 'Inventory updated.');
              }} />
              {!variants.some(({ variant }) => variant.stock <= data.lowStockThreshold) && <Empty>No variants are below the stock threshold.</Empty>}
            </div>
          </section>}

          {page === 'products' && <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-zinc-600">Catalogue changes are saved in Supabase and published to the storefront.</p><button onClick={() => setEditing('new')} className="inline-flex items-center gap-2 rounded-xl bg-[#F5B301] px-4 py-2.5 text-sm font-bold"><Plus className="h-4 w-4" /> Add product</button></div>
            <div className={card}>
              <div className="space-y-2">{productPage.map(product => {
                const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
                const prices = product.variants.map(variant => variant.priceUSD);
                return <div key={product.id} className="flex flex-wrap items-center gap-3 border-b border-zinc-100 py-3 last:border-0">
                  <img src={product.variants[0]?.image} alt="" className="h-14 w-14 rounded-lg bg-zinc-100 object-contain" />
                  <div className="min-w-40 flex-1"><p className="font-semibold">{product.name}</p><p className="text-xs text-zinc-500">{product.brand} · {product.category || 'Uncategorised'} · {product.variants.length} variant(s)</p><p className="text-xs font-medium text-emerald-700">${Math.min(...prices).toLocaleString()} - ${Math.max(...prices).toLocaleString()}</p></div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${stock === 0 ? 'bg-red-50 text-red-700' : stock <= data.lowStockThreshold ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>{stock === 0 ? 'Out of stock' : `${stock} in stock`}</span>
                  <button onClick={() => setEditing(product)} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold">Edit</button>
                  <button onClick={() => {
                    if (!window.confirm(`Delete “${product.name}”? Existing order snapshots will be retained.`)) return;
                    void run(async () => { await adminRequest({ action: 'product.delete', id: product.id }); await refresh(true); }, 'Product deleted.');
                  }} aria-label={`Delete ${product.name}`} className="rounded-lg border border-red-100 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>;
              })}</div>
              {!filteredProducts.length && <Empty>{q ? 'No products match this search.' : 'No products have been imported yet. Run the catalogue seed command after configuring Supabase.'}</Empty>}
              <Pager current={pageNumber} count={Math.ceil(filteredProducts.length / pageSize)} onChange={setPageNumber} />
            </div>
          </section>}

          {page === 'inventory' && <div className={card}>
            <p className="mb-4 text-sm text-zinc-600">Stock changes are serialized in the database. Customers cannot purchase more than the currently available quantity.</p>
            <InventoryTable rows={inventoryPage} threshold={data.lowStockThreshold} onSet={async (product, variant, quantity) => {
              await run(async () => { await adminRequest({ action: 'inventory.update', productId: product.id, variantId: variant.id, quantity }); await refresh(true); }, 'Inventory quantity saved.');
            }} />
            {!filteredVariants.length && <Empty>No inventory records match this search.</Empty>}
            <Pager current={pageNumber} count={Math.ceil(filteredVariants.length / pageSize)} onChange={setPageNumber} />
          </div>}

          {page === 'orders' && <div className={card}>
            <p className="mb-4 text-sm text-zinc-600">Payment status is read-only here. Only verified payment callbacks may mark an order paid; changing fulfilment status does not affect payment. Listing the latest 500 orders.</p>
            <OrderTable orders={orderPage} onStatus={async (order, status) => {
              await run(async () => { await adminRequest({ action: 'order.status', id: order.id, status }); await refresh(); }, 'Order status updated.');
            }} />
            {!filteredOrders.length && <Empty>{q ? 'No orders match this search.' : 'No real orders have been recorded.'}</Empty>}
            <Pager current={pageNumber} count={Math.ceil(filteredOrders.length / pageSize)} onChange={setPageNumber} />
          </div>}

          {page === 'categories' && <section className="space-y-4">
            <button onClick={() => setCategoryDraft({ id: `category-${crypto.randomUUID()}`, name: '', slug: '', active: true, sort_order: data.categories.length })} className="inline-flex items-center gap-2 rounded-xl bg-[#F5B301] px-4 py-2.5 text-sm font-bold"><Plus className="h-4 w-4" /> Add category</button>
            <div className={card}><div className="divide-y divide-zinc-100">{data.categories.map(category => <div key={category.id} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="font-semibold">{category.name}</p><p className="text-xs text-zinc-500">/{category.slug} · position {category.sort_order}</p></div><span className={`rounded-full px-2 py-1 text-xs ${category.active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>{category.active ? 'Active' : 'Hidden'}</span><button onClick={() => setCategoryDraft(category)} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs">Edit</button><button onClick={() => void deleteCategory(category)} aria-label={`Delete ${category.name}`} className="p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div>{!data.categories.length && <Empty>No categories yet.</Empty>}</div>
          </section>}

          {page === 'banners' && <section className="space-y-4">
            <p className="text-sm text-zinc-600">Changes are saved to the shared site settings and loaded by the public homepage.</p>
            {contentDraft.banners.map((banner, index) => <BannerEditor key={banner.id} banner={banner} onUpload={upload} onChange={patch => setContentDraft(current => ({ ...current, banners: current.banners.map((item, i) => i === index ? { ...item, ...patch } : item) }))} onRemove={() => {
              if (window.confirm(`Remove banner “${banner.title}”?`)) setContentDraft(current => ({ ...current, banners: current.banners.filter(item => item.id !== banner.id) }));
            }} onMove={direction => setContentDraft(current => {
              const next = [...current.banners];
              const target = index + direction;
              if (target < 0 || target >= next.length) return current;
              [next[index], next[target]] = [next[target], next[index]];
              return { ...current, banners: next };
            })} />)}
            <div className="flex flex-wrap gap-2"><button onClick={() => setContentDraft(current => ({ ...current, banners: [...current.banners, {
              id: `banner-${crypto.randomUUID()}`, image: '', imageAlt: '', eyebrow: '', title: '', description: '',
              actionLabel: 'Explore', action: 'offers', whatsappMessage: '', slot: 'bottom', active: true,
            }] }))} className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold">Add banner</button><button disabled={busy} onClick={() => void saveContent()} className="rounded-xl bg-[#F5B301] px-4 py-2.5 text-sm font-bold disabled:opacity-50">Save banners</button></div>
          </section>}

          {page === 'customers' && <div className={card}>
            <p className="mb-4 text-sm text-zinc-600">Customer rows are derived only from saved orders; no placeholder profiles or sales are generated.</p>
            <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="text-xs uppercase text-zinc-500"><tr><th className="pb-3">Customer</th><th>Phone</th><th>Email</th><th>Orders</th><th>Paid spend</th></tr></thead><tbody>{filteredCustomers.map(customer => <tr key={customer.phone} className="border-t border-zinc-100"><td className="py-3 font-medium">{customer.name}</td><td>{customer.phone}</td><td>{customer.email || '—'}</td><td>{customer.orders}</td><td>${customer.spend.toLocaleString()}</td></tr>)}</tbody></table></div>
            {!filteredCustomers.length && <Empty>No customers exist until orders are recorded.</Empty>}
          </div>}

          {page === 'settings' && <div className={`${card} max-w-2xl space-y-5`}>
            <div><h2 className="font-bold">Inventory alert threshold</h2><p className="mt-1 text-sm text-zinc-600">Variants at or below this quantity appear in low-stock alerts.</p></div>
            <Field label="Low-stock quantity"><input type="number" min={0} max={1000} className={inputCls} value={thresholdDraft} onChange={event => setThresholdDraft(event.target.value)} /></Field>
            <button disabled={busy} onClick={() => void run(async () => {
              await adminRequest({ action: 'settings.save', lowStockThreshold: Number(thresholdDraft) });
              await refresh();
            }, 'Inventory threshold saved.')} className="rounded-xl bg-[#F5B301] px-4 py-2.5 text-sm font-bold disabled:opacity-50">Save settings</button>
            <div className="rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600"><p className="font-semibold text-zinc-900">Security boundary</p>Admin actions are authorized on the server using Supabase Auth and the admin_users table. Service-role credentials are server-only and never sent to the browser.</div>
          </div>}
        </div>
      </main>

      {editing && <ProductEditor product={editing === 'new' ? undefined : editing} onUpload={upload} onClose={() => setEditing(null)} onSave={saveProduct} />}
      {categoryDraft && <div className="fixed inset-0 z-[120] grid place-items-center bg-black/60 p-4"><div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-xl"><div className="flex justify-between"><h2 className="font-bold">{data.categories.some(item => item.id === categoryDraft.id) ? 'Edit category' : 'New category'}</h2><button onClick={() => setCategoryDraft(null)} aria-label="Close">×</button></div><Field label="Name"><input className={inputCls} value={categoryDraft.name} onChange={e => setCategoryDraft({ ...categoryDraft, name: e.target.value, slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} /></Field><Field label="URL slug"><input className={inputCls} value={categoryDraft.slug} onChange={e => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} /></Field><Field label="Display order"><input type="number" min={0} className={inputCls} value={categoryDraft.sort_order} onChange={e => setCategoryDraft({ ...categoryDraft, sort_order: Number(e.target.value) })} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={categoryDraft.active} onChange={e => setCategoryDraft({ ...categoryDraft, active: e.target.checked })} /> Visible on storefront</label><div className="flex justify-end gap-2"><button onClick={() => setCategoryDraft(null)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button><button onClick={() => void saveCategory()} disabled={busy || !categoryDraft.name.trim()} className="rounded-lg bg-[#F5B301] px-3 py-2 text-sm font-bold disabled:opacity-50">Save category</button></div></div></div>}
    </div>
  );
};

const Stat: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; note?: string }> = ({ icon: Icon, label, value, note }) => <div className={`${card} min-h-28`}><div className="flex items-center justify-between text-xs text-zinc-500"><span>{label}</span><Icon className="h-4 w-4" /></div><div className="mt-3 text-2xl font-black">{value}</div>{note && <div className="mt-1 text-xs text-zinc-500">{note}</div>}</div>;
const SectionHeading: React.FC<{ title: string; action?: () => void }> = ({ title, action }) => <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{title}</h2>{action && <button onClick={action} className="flex items-center text-xs font-semibold text-amber-800">View all <ChevronRight className="h-4 w-4" /></button>}</div>;
const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="py-8 text-center text-sm text-zinc-500">{children}</p>;
const Pager: React.FC<{ current: number; count: number; onChange: (page: number) => void }> = ({ current, count, onChange }) => count > 1 ? <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs"><span>Page {current} of {count}</span><div className="flex gap-2"><button disabled={current <= 1} onClick={() => onChange(current - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><button disabled={current >= count} onClick={() => onChange(current + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></div></div> : null;

const OrderTable: React.FC<{ orders: Order[]; onStatus: (order: Order, status: Order['status']) => void }> = ({ orders, onStatus }) => <div className="space-y-3">{orders.map(order => <div key={order.id} className="rounded-xl border border-zinc-100 p-3 sm:flex sm:items-center sm:gap-4"><div className="min-w-44 flex-1"><div className="font-semibold">{order.orderNumber} <span className="font-normal text-zinc-500">· {order.customerName}</span></div><div className="text-xs text-zinc-500">{order.customerPhone} · {new Date(order.createdAt).toLocaleString()} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</div></div><div className="my-2 flex items-center gap-2 sm:my-0"><span className="font-bold">${order.totalUSD.toLocaleString()}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending-cod' ? 'COD pending' : 'Payment unverified'}</span></div><label className="flex items-center gap-2 text-xs"><span className="text-zinc-500">Fulfilment</span><select value={order.status} onChange={event => onStatus(order, event.target.value as Order['status'])} className="rounded-lg border border-zinc-200 bg-white px-2 py-2 capitalize"><option value="confirmed">Confirmed</option><option value="packing">Packing</option><option value="dispatching">Shipped / dispatching</option><option value="delivered">Completed</option><option value="cancelled">Cancelled (unpaid only)</option></select></label><details className="mt-2 sm:mt-0"><summary className="cursor-pointer text-xs text-amber-800">Details</summary><div className="mt-2 text-xs text-zinc-600">{order.items.map((item, index) => <p key={`${item.productId}-${index}`}>{item.quantity} × {item.productName} ({item.variantLabel}) — ${item.priceUSD.toLocaleString()}</p>)}<p className="mt-1">{order.deliveryAddress} · {order.deliveryCity} · {order.paymentMethod}</p></div></details></div>)}</div>;

const InventoryTable: React.FC<{ rows: { product: Product; variant: ProductVariant }[]; threshold: number; onSet: (product: Product, variant: ProductVariant, quantity: number) => void }> = ({ rows, threshold, onSet }) => <div className="space-y-2">{rows.map(({ product, variant }) => <InventoryRow key={`${product.id}-${variant.id}`} product={product} variant={variant} threshold={threshold} onSet={onSet} />)}</div>;
const InventoryRow: React.FC<{ product: Product; variant: ProductVariant; threshold: number; onSet: (product: Product, variant: ProductVariant, quantity: number) => void }> = ({ product, variant, threshold, onSet }) => {
  const [quantity, setQuantity] = useState(String(variant.stock));
  useEffect(() => setQuantity(String(variant.stock)), [variant.stock]);
  const save = () => { const value = Number(quantity); if (Number.isInteger(value) && value >= 0 && value <= 100000 && value !== variant.stock) onSet(product, variant, value); };
  return <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 py-3 last:border-0"><img src={variant.image} alt="" className="h-11 w-11 rounded-lg bg-zinc-100 object-contain" /><div className="min-w-40 flex-1"><p className="text-sm font-semibold">{product.name}</p><p className="text-xs text-zinc-500">{variant.sku || 'No SKU'} · {variant.storage} · {variant.colorName} · ${variant.priceUSD.toLocaleString()}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${variant.stock === 0 ? 'bg-red-50 text-red-700' : variant.stock <= threshold ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>{variant.stock === 0 ? 'Out of stock' : variant.stock <= threshold ? 'Low stock' : 'In stock'}</span><div className="flex items-center gap-1"><button aria-label={`Decrease ${product.name} stock`} disabled={Number(quantity) <= 0} onClick={() => { const next = Math.max(0, Number(quantity) - 1); setQuantity(String(next)); if (next !== variant.stock) onSet(product, variant, next); }} className="rounded-lg border p-2 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><input aria-label="Available quantity" type="number" min={0} value={quantity} onChange={event => setQuantity(event.target.value)} onBlur={save} onKeyDown={event => { if (event.key === 'Enter') save(); }} className="w-16 rounded-lg border border-zinc-200 px-2 py-2 text-center text-sm" /><button aria-label={`Increase ${product.name} stock`} onClick={() => { const next = Number(quantity) + 1; setQuantity(String(next)); if (next !== variant.stock) onSet(product, variant, next); }} className="rounded-lg border p-2"><ArrowUp className="h-3.5 w-3.5" /></button></div></div>;
};

const BannerEditor: React.FC<{ banner: Banner; onUpload: (file: File) => Promise<string>; onChange: (patch: Partial<Banner>) => void; onRemove: () => void; onMove: (direction: -1 | 1) => void }> = ({ banner, onUpload, onChange, onRemove, onMove }) => <article className={`${card} space-y-4`}>
  <div className="flex items-center justify-between"><h2 className="font-bold">{banner.title || 'New banner'}</h2><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={banner.active} onChange={event => onChange({ active: event.target.checked })} />Active</label><button title="Move up" onClick={() => onMove(-1)} className="rounded-lg border p-2"><ArrowUp className="h-4 w-4" /></button><button title="Move down" onClick={() => onMove(1)} className="rounded-lg border p-2"><ArrowDown className="h-4 w-4" /></button><button title="Delete banner" onClick={onRemove} className="rounded-lg border border-red-100 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>
  <ImagePicker value={banner.image} onChange={image => onChange({ image })} onUpload={onUpload} label="Banner image" size="w-32 h-20" />
  <div className="grid gap-3 sm:grid-cols-2">
    <Field label="Heading"><input className={inputCls} value={banner.eyebrow} onChange={event => onChange({ eyebrow: event.target.value })} /></Field>
    <Field label="Title"><input className={inputCls} value={banner.title} onChange={event => onChange({ title: event.target.value })} /></Field>
    <Field label="Description"><input className={inputCls} value={banner.description} onChange={event => onChange({ description: event.target.value })} /></Field>
    <Field label="Button text"><input className={inputCls} value={banner.actionLabel} onChange={event => onChange({ actionLabel: event.target.value })} /></Field>
    <Field label="Button destination (optional URL/path)"><input className={inputCls} value={banner.href ?? ''} placeholder="/catalog or https://…" onChange={event => onChange({ href: event.target.value || undefined })} /></Field>
    <Field label="Homepage position"><select className={inputCls} value={banner.slot} onChange={event => onChange({ slot: event.target.value as Banner['slot'] })}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></Field>
  </div>
</article>;

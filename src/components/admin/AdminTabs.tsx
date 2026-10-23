import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Star, ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { Product } from '../../types';
import { useContent, Banner, BannerAction, BannerSlot } from '../../context/ContentContext';
import { Field, ImagePicker, ProductEditor, inputCls } from './ProductEditor';

const LOW_STOCK = 3;
const card = 'p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5';

/* ---------------- Products ---------------- */
export const ProductsTab: React.FC = () => {
  const { products, saveProduct, deleteProduct, toggleFeatured } = useContent();
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [q, setQ] = useState('');

  const list = products.filter(p => `${(p as any).name} ${(p as any).brand}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input className={`${inputCls} pl-8`} placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button onClick={() => setEditing('new')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5B301] text-black font-bold">
          <Plus className="w-4 h-4" /> Add product
        </button>
      </div>

      <div className="space-y-2">
        {list.map(p => {
          const a = p as any;
          const prices: number[] = a.variants.map((v: any) => v.priceUSD);
          const stock: number = a.variants.reduce((s: number, v: any) => s + v.stock, 0);
          return (
            <div key={a.id} className={`${card} flex items-center gap-3`}>
              <img src={a.variants[0]?.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-black/20" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white light:text-zinc-900 truncate">{a.name}</div>
                <div className="text-[11px] text-zinc-400">
                  {a.brand} • {a.variants.length} variant{a.variants.length > 1 ? 's' : ''} • ${Math.min(...prices)}
                  {Math.max(...prices) > Math.min(...prices) && `–$${Math.max(...prices)}`}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stock === 0 ? 'bg-red-500/15 text-red-400' : stock <= LOW_STOCK ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                {stock === 0 ? 'Sold out' : `${stock} in stock`}
              </span>
              <button onClick={() => toggleFeatured(String(a.id))} aria-label="Toggle featured" title="Featured on homepage"
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${a.isFeatured ? 'bg-[#F5B301] text-black' : 'bg-white/5 text-zinc-400'}`}>
                <Star className="w-4 h-4" />
              </button>
              <button onClick={() => setEditing(p)} aria-label="Edit" className="w-8 h-8 rounded-xl bg-white/5 text-zinc-300 flex items-center justify-center"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => confirm(`Remove “${a.name}” from the shop?`) && deleteProduct(String(a.id))} aria-label="Delete" className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          );
        })}
        {!list.length && <p className="text-zinc-400 py-8 text-center">No products yet. Use “Add product” to list your first phone.</p>}
      </div>

      {editing && (
        <ProductEditor
          product={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={p => { saveProduct(p); setEditing(null); }}
        />
      )}
    </div>
  );
};

/* ---------------- Homepage ---------------- */
const SLOTS: Record<BannerSlot, string> = { top: 'Below the flash deals', middle: 'Below Featured phones', bottom: 'Below Phones under budget' };
const ACTIONS: Record<BannerAction, string> = { offers: 'Opens offers in the catalogue', apple: 'Opens iPhones in the catalogue', whatsapp: 'Opens a WhatsApp chat' };

export const HomepageTab: React.FC = () => {
  const { content, updateContent, resetContent } = useContent();
  const { banners, video, sections } = content;

  const setBanner = (id: string, patch: Partial<Banner>) =>
    updateContent({ banners: banners.map(b => (b.id === id ? { ...b, ...patch } : b)) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...banners];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    updateContent({ banners: next });
  };
  const addBanner = () => updateContent({
    banners: [...banners, {
      id: `b-${Date.now()}`, image: '', imageAlt: '', eyebrow: '', title: 'New banner', description: '',
      actionLabel: 'Learn more', action: 'whatsapp', whatsappMessage: 'Hello ZimMobile, ', slot: 'bottom', active: true,
    }],
  });

  return (
    <div className="space-y-8 text-xs">
      <section className="space-y-3">
        <h4 className="font-bold text-zinc-300 uppercase tracking-wider">Product sections</h4>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Samsung section: max price (USD)"><input type="number" className={inputCls} value={sections.samsungMax} onChange={e => updateContent({ sections: { ...sections, samsungMax: +e.target.value } })} /></Field>
          <Field label="Budget section: max price (USD)"><input type="number" className={inputCls} value={sections.budgetMax} onChange={e => updateContent({ sections: { ...sections, budgetMax: +e.target.value } })} /></Field>
          <Field label="Featured phones shown"><input type="number" min={2} max={12} className={inputCls} value={sections.featuredCount} onChange={e => updateContent({ sections: { ...sections, featuredCount: +e.target.value } })} /></Field>
        </div>
        <Field label="WhatsApp number (country code, no +)"><input className={inputCls} value={content.whatsappNumber} onChange={e => updateContent({ whatsappNumber: e.target.value.replace(/\D/g, '') })} /></Field>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-zinc-300 uppercase tracking-wider">Campaign video</h4>
          <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" className="accent-[#F5B301]" checked={video.active} onChange={e => updateContent({ video: { ...video, active: e.target.checked } })} /> Show on homepage</label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Video file path or link"><input className={inputCls} value={video.src} onChange={e => updateContent({ video: { ...video, src: e.target.value } })} /></Field>
          <Field label="Title"><input className={inputCls} value={video.title} onChange={e => updateContent({ video: { ...video, title: e.target.value } })} /></Field>
          <Field label="Description" className="sm:col-span-2"><input className={inputCls} value={video.description} onChange={e => updateContent({ video: { ...video, description: e.target.value } })} /></Field>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-zinc-300 uppercase tracking-wider">Promo banners</h4>
          <button onClick={addBanner} className="flex items-center gap-1 text-[#F5B301] font-bold"><Plus className="w-3.5 h-3.5" /> Add banner</button>
        </div>
        {banners.map((b, i) => (
          <div key={b.id} className={`${card} space-y-3 ${b.active ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-white light:text-zinc-900 truncate">{b.title || 'Untitled banner'}</span>
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 text-zinc-300 mr-2"><input type="checkbox" className="accent-[#F5B301]" checked={b.active} onChange={e => setBanner(b.id, { active: e.target.checked })} /> Visible</label>
                <button onClick={() => move(i, -1)} aria-label="Move up" className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, 1)} aria-label="Move down" className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => confirm('Delete this banner?') && updateContent({ banners: banners.filter(x => x.id !== b.id) })} aria-label="Delete banner" className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <ImagePicker label="Banner image" value={b.image} maxW={1400} size="w-28 h-16" onChange={image => setBanner(b.id, { image })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Small heading above title"><input className={inputCls} value={b.eyebrow} onChange={e => setBanner(b.id, { eyebrow: e.target.value })} /></Field>
              <Field label="Title"><input className={inputCls} value={b.title} onChange={e => setBanner(b.id, { title: e.target.value })} /></Field>
              <Field label="Description" className="sm:col-span-2"><input className={inputCls} value={b.description} onChange={e => setBanner(b.id, { description: e.target.value })} /></Field>
              <Field label="Image description (for screen readers)"><input className={inputCls} value={b.imageAlt} onChange={e => setBanner(b.id, { imageAlt: e.target.value })} /></Field>
              <Field label="Button text"><input className={inputCls} value={b.actionLabel} onChange={e => setBanner(b.id, { actionLabel: e.target.value })} /></Field>
              <Field label="Button does">
                <select className={inputCls} value={b.action} onChange={e => setBanner(b.id, { action: e.target.value as BannerAction })}>
                  {Object.entries(ACTIONS).map(([k, v]) => <option key={k} value={k} className="text-black">{v}</option>)}
                </select>
              </Field>
              <Field label="Position on homepage">
                <select className={inputCls} value={b.slot} onChange={e => setBanner(b.id, { slot: e.target.value as BannerSlot })}>
                  {Object.entries(SLOTS).map(([k, v]) => <option key={k} value={k} className="text-black">{v}</option>)}
                </select>
              </Field>
              {b.action === 'whatsapp' && (
                <Field label="Message the customer sends" className="sm:col-span-2"><input className={inputCls} value={b.whatsappMessage} onChange={e => setBanner(b.id, { whatsappMessage: e.target.value })} /></Field>
              )}
            </div>
          </div>
        ))}
      </section>

      <button onClick={() => confirm('Restore the original homepage text, banners and settings? Products are not affected.') && resetContent()} className="text-zinc-400 hover:text-white underline">
        Restore original homepage content
      </button>
    </div>
  );
};
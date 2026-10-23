import React, { useState } from 'react';
import { X, Plus, Trash2, ImagePlus } from 'lucide-react';
import type { Product } from '../../types';

export const inputCls =
  'w-full rounded-xl bg-white/5 light:bg-black/5 border border-white/10 light:border-black/10 px-3 py-2 text-xs text-white light:text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-[#F5B301]';

export const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <label className={`block space-y-1 ${className}`}>
    <span className="text-[11px] text-zinc-400">{label}</span>
    {children}
  </label>
);

/** Resize in the browser so images stay small enough to store. */
export const ImagePicker: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onUpload?: (file: File, onProgress?: (percent: number) => void) => Promise<string>;
  label?: string;
  maxW?: number;
  size?: string;
}> = ({ value, onChange, onUpload, label = 'Image', size = 'w-20 h-20' }) => {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  return <div className="space-y-1">
    <span className="text-[11px] text-zinc-400">{label}</span>
    <div className="flex items-center gap-2">
      <label className={`${size} shrink-0 rounded-xl border border-dashed border-white/20 light:border-black/20 bg-black/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#F5B301]`}>
        {uploading ? <span className="text-[10px] text-zinc-300">Uploading {progress}%</span> : value ? <img src={value} alt="" className="w-full h-full object-contain" /> : <ImagePlus className="w-5 h-5 text-zinc-500" />}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={async e => {
            const f = e.target.files?.[0];
            if (f) {
              setError('');
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 3 * 1024 * 1024) {
                setError('Use a JPEG, PNG, or WebP image up to 3 MB.');
              } else if (onUpload) {
                setUploading(true);
                setProgress(0);
                try { onChange(await onUpload(f, setProgress)); }
                catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.'); }
                finally { setUploading(false); }
              } else {
                setError('Image uploads require the configured admin storage service.');
              }
            }
            e.target.value = '';
          }}
        />
      </label>
      <input
        className={inputCls}
        placeholder="…or paste an image link / /images/file.png"
        value={value.startsWith('data:') ? '' : value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
    {error && <p className="text-[10px] text-red-400" role="alert">{error}</p>}
  </div>;
};

type VariantDraft = { id: string; storage: string; color: string; priceUSD: number; originalPriceUSD?: number; stock: number; sku: string; image: string };
type Draft = {
  id: string; slug: string; name: string; model: string; brand: Product['brand']; category: string; condition: Product['condition']; description: string; tagline: string;
  isFeatured: boolean; isFlashDeal: boolean; variants: VariantDraft[]; images: string[]; specs: Product['specs'];
};

const BRANDS = ['Samsung', 'Apple', 'Tecno', 'Infinix', 'Xiaomi', 'Huawei', 'Nokia'];
const uid = () => Math.random().toString(36).slice(2, 8);
const blankVariant = (): VariantDraft => ({ id: `v-${uid()}`, storage: '128GB', color: '', priceUSD: 0, stock: 1, sku: '', image: '' });

const toDraft = (p?: Product): Draft => {
  const a = p as any;
  return a
    ? {
        id: String(a.id), slug: a.slug ?? '', name: a.name ?? '', model: a.model ?? '', brand: a.brand ?? '', category: a.category ?? '',
        condition: a.condition ?? 'Brand New Sealed', description: a.description ?? '', tagline: a.tagline ?? '', specs: a.specs,
        isFeatured: !!a.isFeatured, isFlashDeal: !!a.isFlashDeal, images: a.galleryImages ?? [],
        variants: (a.variants ?? []).map((v: any) => ({
          ...blankVariant(), ...v, color: v.colorName ?? v.color ?? '', sku: v.sku ?? '',
        })),
      }
    : {
        id: `custom-${Date.now()}`, slug: '', name: '', model: '', brand: 'Samsung', category: 'Samsung',
        condition: 'Brand New Sealed', description: '', tagline: '', isFeatured: false, isFlashDeal: false,
        images: [], variants: [blankVariant()],
        specs: { screen: '', processor: '', ram: '', rearCamera: '', selfieCamera: '', battery: '', charging: '', os: '', network: '', sim: '', waterResistance: '', warranty: '' },
      };
};

export const ProductEditor: React.FC<{
  product?: Product;
  onSave: (p: Product) => void | Promise<void>;
  onUpload?: (file: File, onProgress?: (percent: number) => void) => Promise<string>;
  onClose: () => void;
}> = ({ product, onSave, onUpload, onClose }) => {
  const [d, setD] = useState<Draft>(() => toDraft(product));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setVariant = (i: number, patch: Partial<VariantDraft>) =>
    setD(s => ({ ...s, variants: s.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) }));

  const submit = async () => {
    if (!d.name.trim()) return setError('Add a product name.');
    if (!d.variants.length) return setError('Add at least one variant.');
    if (d.variants.some(v => !(v.priceUSD > 0))) return setError('Every variant needs a price above $0.');
    if (d.variants.some(v => !v.image)) return setError('Every variant needs a photo.');
    if (d.variants.some(v => !v.sku.trim())) return setError('Every variant needs a SKU.');
    const slug = d.slug.trim() || d.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const base: Product = product ?? {
      ...d, id: d.id, slug, name: '', brand: 'Samsung', tagline: '', description: '',
      condition: 'Brand New Sealed', rating: 0, reviewCount: 0, tags: [], variants: [], galleryImages: [], boxContents: [],
    };
    const updated: Product = {
      ...base, ...d, id: d.id, slug, name: d.name.trim(), model: d.model.trim(), category: d.category.trim() || undefined,
      galleryImages: d.images, variants: d.variants.map((variant, index) => {
        const previous = product?.variants.find(old => old.id === variant.id);
        return {
          id: variant.id, storage: variant.storage.trim(), colorName: variant.color.trim(),
          colorHex: previous?.colorHex ?? '#777777', priceUSD: variant.priceUSD,
          ...(variant.originalPriceUSD ? { originalPriceUSD: variant.originalPriceUSD } : {}),
          stock: variant.stock, sku: variant.sku.trim(), image: variant.image,
        };
      }),
    };
    setSaving(true);
    setError('');
    try { await onSave(updated); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Could not save product.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/70">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0B0D12] light:bg-[#F7F6F2] border border-white/10 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#131620] light:bg-white">
          <h3 className="text-sm font-bold text-white light:text-zinc-950">{product ? 'Edit product' : 'Add product'}</h3>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Product name"><input className={inputCls} value={d.name} onChange={e => setD({ ...d, name: e.target.value })} placeholder="Samsung Galaxy S23 Ultra" /></Field>
            <Field label="Model"><input className={inputCls} value={d.model} onChange={e => setD({ ...d, model: e.target.value })} placeholder="Galaxy S23 Ultra" /></Field>
            <Field label="URL slug"><input className={inputCls} value={d.slug} onChange={e => setD({ ...d, slug: e.target.value })} placeholder="generated-from-product-name" /></Field>
            <Field label="Brand">
              <input className={inputCls} list="zm-brands" value={d.brand} onChange={e => setD({ ...d, brand: e.target.value })} />
              <datalist id="zm-brands">{BRANDS.map(b => <option key={b} value={b} />)}</datalist>
            </Field>
            <Field label="Category"><input className={inputCls} value={d.category} onChange={e => setD({ ...d, category: e.target.value })} placeholder="Samsung" /></Field>
            <Field label="Condition">
              <select className={inputCls} value={d.condition} onChange={e => setD({ ...d, condition: e.target.value })}>
                {(['Brand New Sealed', 'Certified Pre-Owned Pristine'] as const).map(c => <option key={c} className="text-black">{c}</option>)}
              </select>
            </Field>
            <label className="flex items-center gap-2 pt-5 text-zinc-300">
              <input type="checkbox" checked={d.isFeatured} onChange={e => setD({ ...d, isFeatured: e.target.checked })} className="accent-[#F5B301]" />
              Show in “Featured phones” on the homepage
            </label>
            <label className="flex items-center gap-2 pt-5 text-zinc-300">
              <input type="checkbox" checked={d.isFlashDeal} onChange={e => setD({ ...d, isFlashDeal: e.target.checked })} className="accent-[#F5B301]" />
              Mark as a flash deal
            </label>
          </div>

          <Field label="Short tagline"><input className={inputCls} value={d.tagline} onChange={e => setD({ ...d, tagline: e.target.value })} /></Field>
          <Field label="Description">
            <textarea className={`${inputCls} min-h-20`} value={d.description} onChange={e => setD({ ...d, description: e.target.value })} placeholder="Key specs, what’s in the box, warranty…" />
          </Field>

          <section className="space-y-2">
            <span className="font-bold text-zinc-300">Specifications</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(d.specs).map(([key, value]) => <Field key={key} label={key.replace(/[A-Z]/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase())}><input className={inputCls} value={value} onChange={e => setD({ ...d, specs: { ...d.specs, [key]: e.target.value } })} /></Field>)}
            </div>
          </section>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300">Variants (storage, colour, price, stock)</span>
              <button onClick={() => setD(s => ({ ...s, variants: [...s.variants, blankVariant()] }))} className="flex items-center gap-1 text-[#F5B301] font-bold">
                <Plus className="w-3.5 h-3.5" /> Add variant
              </button>
            </div>
            {d.variants.map((v, i) => (
              <div key={v.id} className="p-3 rounded-2xl bg-[#131620] light:bg-white border border-white/5 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Field label="Storage"><input className={inputCls} value={v.storage} onChange={e => setVariant(i, { storage: e.target.value })} /></Field>
                  <Field label="Colour"><input className={inputCls} value={v.color} onChange={e => setVariant(i, { color: e.target.value })} /></Field>
                  <Field label="Price (USD)"><input type="number" min={0} className={inputCls} value={v.priceUSD || ''} onChange={e => setVariant(i, { priceUSD: +e.target.value })} /></Field>
                  <Field label="Units in stock"><input type="number" min={0} className={inputCls} value={v.stock} onChange={e => setVariant(i, { stock: +e.target.value })} /></Field>
                  <Field label="SKU"><input className={inputCls} value={v.sku} onChange={e => setVariant(i, { sku: e.target.value })} /></Field>
                  <Field label="Original price (optional)"><input type="number" min={0} className={inputCls} value={v.originalPriceUSD || ''} onChange={e => setVariant(i, { originalPriceUSD: +e.target.value || undefined })} /></Field>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1"><ImagePicker label="Variant photo" value={v.image} onUpload={onUpload} onChange={image => setVariant(i, { image })} /></div>
                  {d.variants.length > 1 && (
                    <button onClick={() => setD(s => ({ ...s, variants: s.variants.filter((_, idx) => idx !== i) }))} aria-label="Remove variant" className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-300">Extra gallery photos</span>
            <div className="flex flex-wrap gap-2">
              {d.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/20">
                  <img src={img} alt="" className="w-full h-full object-contain" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 bg-black/70 py-0.5">
                    <button type="button" aria-label="Move gallery image left" disabled={i === 0} onClick={() => setD(s => {
                      const images = [...s.images]; [images[i - 1], images[i]] = [images[i], images[i - 1]]; return { ...s, images };
                    })} className="text-white disabled:opacity-30">‹</button>
                    <button type="button" aria-label="Move gallery image right" disabled={i === d.images.length - 1} onClick={() => setD(s => {
                      const images = [...s.images]; [images[i], images[i + 1]] = [images[i + 1], images[i]]; return { ...s, images };
                    })} className="text-white disabled:opacity-30">›</button>
                    <button type="button" onClick={() => setD(s => {
                      const oldPrimary = s.variants[0]?.image;
                      const variants = s.variants.map((variant, index) => index === 0 ? { ...variant, image: img } : variant);
                      return { ...s, variants, images: [...s.images.filter((_, idx) => idx !== i), ...(oldPrimary ? [oldPrimary] : [])] };
                    })} className="text-[8px] font-bold text-white">Primary</button>
                  </div>
                  <button onClick={() => setD(s => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))} aria-label="Remove photo" className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#F5B301]">
                <ImagePlus className="w-5 h-5 text-zinc-500" />
                <input type="file" accept="image/*" multiple className="sr-only" onChange={async e => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024)) {
                    setError('Gallery images must be JPEG, PNG, or WebP and no larger than 3 MB each.');
                    e.target.value = '';
                    return;
                  }
                  if (!onUpload) {
                    setError('Image uploads require the configured admin storage service.');
                    e.target.value = '';
                    return;
                  }
                  try {
                    const urls = await Promise.all(files.map(file => onUpload(file)));
                    setD(s => ({ ...s, images: [...s.images, ...urls] }));
                    setError('');
                  } catch (uploadError) {
                    setError(uploadError instanceof Error ? uploadError.message : 'Gallery upload failed.');
                  }
                  e.target.value = '';
                }} />
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#131620] light:bg-white flex items-center justify-between gap-3">
          <span className="text-[11px] text-red-400" role="alert">{error}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-bold">Cancel</button>
            <button onClick={submit} disabled={saving} className="px-4 py-2 rounded-xl bg-[#F5B301] text-black text-xs font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save product'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
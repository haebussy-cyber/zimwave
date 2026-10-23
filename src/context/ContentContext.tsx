import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import type { Product } from '../types';

export type BannerAction = 'offers' | 'apple' | 'whatsapp';
export type BannerSlot = 'top' | 'middle' | 'bottom';

export interface Banner {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  href?: string;
  action: BannerAction;
  whatsappMessage: string;
  slot: BannerSlot;
  active: boolean;
}

export interface SiteContent {
  banners: Banner[];
  video: { src: string; title: string; description: string; active: boolean };
  sections: { samsungMax: number; budgetMax: number; featuredCount: number };
  whatsappNumber: string;
}

export const DEFAULT_CONTENT: SiteContent = {
  whatsappNumber: '263771234567',
  sections: { samsungMax: 1000, budgetMax: 400, featuredCount: 4 },
  video: {
    src: '/images/The new Apple TV 4K_ The ultimate cinematic experience..mp4',
    title: 'Discover the Samsung Galaxy S23 series',
    description: 'Watch the Galaxy S23 Series unveiling.',
    active: true,
  },
  banners: [
    {
      id: 'b-offers', slot: 'top', active: true, action: 'offers', whatsappMessage: '',
      image: '/images/selected-phone-offers.png', imageAlt: 'Phone in hand showing a group video call',
      eyebrow: 'Selected phone offers', title: 'Find the right phone for your next move',
      description: 'Browse current phone offers and compare the listed models and prices.',
      actionLabel: 'Browse current offers',
    },
    {
      id: 'b-iphone', slot: 'middle', active: true, action: 'apple', whatsappMessage: '',
      image: '/images/iphone-feature-advert.png', imageAlt: 'Smartphone with a desert landscape lock screen',
      eyebrow: 'Explore iPhone', title: 'Find an iPhone that fits your needs',
      description: 'Compare available iPhone models and options in the catalogue.',
      actionLabel: 'Browse iPhones',
    },
    {
      id: 'b-budget', slot: 'bottom', active: true, action: 'whatsapp',
      whatsappMessage: 'Hello ZimMobile, I am looking for a smartphone around or under $150. Do you have any options available?',
      image: '/images/budget-tecno-phones.png', imageAlt: 'Tecno smartphones shown from the front and back',
      eyebrow: 'Budget phone enquiry', title: 'Looking for a phone around $150?',
      description: 'Our current catalogue starts at $175. Message us to ask whether a lower-budget option is available.',
      actionLabel: 'Ask about budget options',
    },
    {
      id: 'b-audio', slot: 'bottom', active: true, action: 'whatsapp',
      whatsappMessage: 'Hello ZimMobile, please let me know what headphone and audio accessories are available.',
      image: '/images/headphones-advert.png', imageAlt: 'Black and white over-ear headphones',
      eyebrow: 'Audio and accessories', title: 'Complete your everyday setup',
      description: 'Ask our team about headphones and accessories to pair with your phone.',
      actionLabel: 'Ask about accessories',
    },
  ],
};

interface Persisted {
  adminProducts: Product[];
  hiddenIds: string[];
  content: SiteContent;
}

interface ContentCtx {
  /** Every product the shop shows: owner-added/edited first, then built-in ones that are not hidden. */
  products: Product[];
  adminProductIds: Set<string>;
  content: SiteContent;
  catalogSource: 'database' | 'bundled' | 'error';
  catalogError: string | null;
  refreshCatalog: () => Promise<void>;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
  resetContent: () => void;
}

const Ctx = createContext<ContentCtx | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Persisted>({ adminProducts: [], hiddenIds: [], content: DEFAULT_CONTENT });
  const [catalogSource, setCatalogSource] = useState<ContentCtx['catalogSource']>('bundled');
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const refreshCatalog = useCallback(async () => {
    try {
      const response = await fetch('/api/catalog');
      if (!response.ok) throw new Error(`Catalogue service returned ${response.status}.`);
      const remote = await response.json() as { products: Product[]; content: SiteContent | null };
      if (!Array.isArray(remote.products)) throw new Error('Catalogue response is invalid.');
      setState({
        adminProducts: remote.products,
        hiddenIds: [],
        content: { ...DEFAULT_CONTENT, ...(remote.content ?? {}) },
      });
      setCatalogSource('database');
      setCatalogError(null);
    } catch (error) {
      setCatalogSource('error');
      setCatalogError(error instanceof Error ? error.message : 'Catalogue service is unavailable.');
    }
  }, []);

  useEffect(() => { void refreshCatalog(); }, [refreshCatalog]);

  const adminProductIds = useMemo(() => new Set(state.adminProducts.map(p => String(p.id))), [state.adminProducts]);

  const products = useMemo(() => catalogSource === 'database'
    ? state.adminProducts
    : [...state.adminProducts, ...PRODUCTS.filter(p => !adminProductIds.has(String(p.id)) && !state.hiddenIds.includes(String(p.id)))],
  [state, adminProductIds, catalogSource]);

  const saveProduct = useCallback((p: Product) => setState(s => {
    const id = String(p.id);
    const exists = s.adminProducts.some(x => String(x.id) === id);
    return {
      ...s,
      adminProducts: exists ? s.adminProducts.map(x => (String(x.id) === id ? p : x)) : [p, ...s.adminProducts],
    };
  }), []);

  const deleteProduct = useCallback((id: string) => setState(s => ({
    ...s,
    adminProducts: s.adminProducts.filter(p => String(p.id) !== id),
    hiddenIds: PRODUCTS.some(p => String(p.id) === id) ? [...new Set([...s.hiddenIds, id])] : s.hiddenIds,
  })), []);

  const toggleFeatured = useCallback((id: string) => setState(s => {
    const current = [...s.adminProducts, ...PRODUCTS].find(p => String(p.id) === id);
    if (!current) return s;
    const updated = { ...current, isFeatured: !current.isFeatured } as Product;
    const exists = s.adminProducts.some(x => String(x.id) === id);
    return { ...s, adminProducts: exists ? s.adminProducts.map(x => (String(x.id) === id ? updated : x)) : [updated, ...s.adminProducts] };
  }), []);

  const updateContent = useCallback((patch: Partial<SiteContent>) =>
    setState(s => ({ ...s, content: { ...s.content, ...patch } })), []);

  const resetContent = useCallback(() => setState(s => ({ ...s, content: DEFAULT_CONTENT })), []);

  return (
    <Ctx.Provider value={{ products, adminProductIds, content: state.content, catalogSource, catalogError, refreshCatalog, saveProduct, deleteProduct, toggleFeatured, updateContent, resetContent }}>
      {children}
    </Ctx.Provider>
  );
};

export const useContent = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useContent must be used inside <ContentProvider>');
  return c;
};
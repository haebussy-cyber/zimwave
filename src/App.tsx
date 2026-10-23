import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ContentProvider, useContent, BannerSlot } from './context/ContentContext';
import { Header } from './components/layout/Header';
import { TrustBar } from './components/layout/TrustBar';
import { HeroCarousel } from './components/home/HeroCarousel';
import { FlashDealsStrip } from './components/home/FlashDealsStrip';
import { CampaignBanner } from './components/home/CampaignBanner';
import { CampaignVideo } from './components/home/CampaignVideo';
import { WhatsAppConciergeBanner } from './components/home/WhatsAppConciergeBanner';
import { CatalogSection } from './components/catalog/CatalogSection';
import { OrdersView } from './components/orders/OrdersView';
import { Footer } from './components/layout/Footer';
import { StickyMobileNav } from './components/layout/StickyMobileNav';
import { ProductCard } from './components/product/ProductCard';

// Modals
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CompareModal } from './components/product/CompareModal';
import { PhoneFinderModal } from './components/product/PhoneFinderModal';
import { TradeInModal } from './components/product/TradeInModal';
import { LayawayModal } from './components/product/LayawayModal';
import { DesignSystemAndDocsModal } from './components/docs/DesignSystemAndDocsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContentModal } from './components/content/ContentModal';

import { ArrowRight } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'orders'>('home');
  const { setFilters } = useStore();
  const { products, content } = useContent();
  const { banners, video, sections, whatsappNumber } = content;

  // Everything below comes from the dashboard, not from the static PRODUCTS file.
  const featuredPhones = products.filter(p => (p as any).isFeatured).slice(0, sections.featuredCount);
  const budgetPhones = products.filter(p => (p as any).variants.some((v: any) => v.priceUSD <= sections.budgetMax)).slice(0, 4);
  const samsungUnderMax = products
    .filter(p => (p as any).brand === 'Samsung' && (p as any).variants.some((v: any) => v.priceUSD <= sections.samsungMax))
    .slice(0, 4);

  const openCatalogWithFilters = (filters: Parameters<typeof setFilters>[0]) => {
    setFilters(filters);
    setCurrentView('catalog');
  };
  const reset = { searchQuery: '', priceRange: [0, 2000] as [number, number], storage: [], condition: 'all', onlyInStock: false, only5G: false };
  const openAppleCatalog = () => openCatalogWithFilters(prev => ({ ...prev, ...reset, selectedBrand: 'Apple' }) as any);
  const openOfferCatalog = () => openCatalogWithFilters(prev => ({ ...prev, ...reset, selectedBrand: 'all', sortBy: 'discount' }) as any);

  if (window.location.pathname === '/admin') return <AdminDashboard />;

  const renderBanners = (slot: BannerSlot) =>
    banners.filter(b => b.active && b.slot === slot).map(b => (
      <CampaignBanner
        key={b.id}
        image={b.image}
        imageAlt={b.imageAlt}
        eyebrow={b.eyebrow}
        title={b.title}
        description={b.description}
        actionLabel={b.actionLabel}
        {...(b.href
          ? { href: b.href }
          : b.action === 'whatsapp'
          ? { href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(b.whatsappMessage)}` }
          : { onAction: b.action === 'apple' ? openAppleCatalog : openOfferCatalog })}
      />
    ));

  return (
    <div className="min-h-screen flex flex-col app-container bg-[#F7F6F2] text-zinc-900 transition-colors duration-200">
      <Header onNavigateToCatalog={() => setCurrentView('catalog')} onNavigateToOrders={() => setCurrentView('orders')} />

      <main className="flex-1 pb-20 sm:pb-0">
        {currentView === 'home' && (
          <>
            <HeroCarousel onNavigateToCatalog={() => setCurrentView('catalog')} />
            <TrustBar />

            {samsungUnderMax.length > 0 && (
              <section className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Browse by brand</p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">Samsung Galaxy under ${sections.samsungMax.toLocaleString()}</h2>
                    <p className="mt-1 text-sm text-zinc-600">Available Galaxy variants priced within your budget.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCatalogWithFilters(prev => ({ ...prev, ...reset, selectedBrand: 'Samsung', priceRange: [0, sections.samsungMax] }) as any)}
                    className="min-h-11 shrink-0 text-sm font-semibold text-amber-900 hover:underline"
                  >
                    Shop Samsung <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {samsungUnderMax.map(product => <ProductCard key={product.id} product={product} maxPriceUSD={sections.samsungMax} />)}
                </div>
              </section>
            )}

            {video.active && video.src && <CampaignVideo src={video.src} title={video.title} description={video.description} />}

            <FlashDealsStrip />
            {renderBanners('top')}

            {featuredPhones.length > 0 && (
              <section className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">ZimMobile selection</p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">Featured phones</h2>
                  </div>
                  <button type="button" onClick={() => setCurrentView('catalog')} className="min-h-11 shrink-0 text-sm font-semibold text-amber-900 hover:underline">
                    View all <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {featuredPhones.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              </section>
            )}

            {renderBanners('middle')}

            {budgetPhones.length > 0 && (
              <section className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Price collection</p>
                  <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">Phones under ${sections.budgetMax.toLocaleString()}</h2>
                  <p className="mt-1 text-sm text-zinc-600">Choose a model and compare its available options.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {budgetPhones.map(product => <ProductCard key={product.id} product={product} maxPriceUSD={sections.budgetMax} />)}
                </div>
              </section>
            )}

            {renderBanners('bottom')}
            <WhatsAppConciergeBanner />
          </>
        )}

        {currentView === 'catalog' && <CatalogSection />}
        {currentView === 'orders' && <OrdersView />}
      </main>

      <Footer onNavigateToCatalog={() => setCurrentView('catalog')} />
      <StickyMobileNav currentView={currentView} onSelectView={v => setCurrentView(v)} />

      <ProductDetailModal onNavigateToCatalog={() => setCurrentView('catalog')} />
      <CartDrawer />
      <CheckoutModal />
      <CompareModal />
      <PhoneFinderModal />
      <TradeInModal />
      <LayawayModal />
      <DesignSystemAndDocsModal />
      <AdminDashboard />
      <ContentModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <ContentProvider>
        <MainApp />
      </ContentProvider>
    </StoreProvider>
  );
}
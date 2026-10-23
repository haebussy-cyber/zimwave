import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Scale, 
  MapPin, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Menu, 
  X, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Package,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const Header: React.FC<{
  onNavigateToCatalog?: () => void;
  onNavigateToOrders?: () => void;
  onClose?: () => void;
  extraMenuContent?: React.ReactNode;
}> = ({ onNavigateToCatalog, onNavigateToOrders, onClose, extraMenuContent }) => {
  const { 
    cartTotalCount, 
    cartTotalUSD, 
    wishlist, 
    compareList, 
    currency, 
    setCurrency, 
    activeCity, 
    setActiveCity, 
    theme, 
    toggleTheme,
    openCart, 
    openCompare, 
    openPhoneFinder, 
    openTradeIn,
    openLayaway,
    openDocs,
    openAdmin,
    formatPrice,
    filters,
    setFilters
  } = useStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const cities = ['Harare (Same-day)', 'Chitungwiza (Same-day)', 'Bulawayo (Courier)', 'Mutare', 'Gweru'];

  // Handle outside click for search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !desktopSearchRef.current?.contains(target) &&
        !mobileSearchRef.current?.contains(target)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = filters.searchQuery.trim()
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    if (onNavigateToCatalog) onNavigateToCatalog();
  };

  const navigateWithFilters = (nextFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...nextFilters }));
    setMobileMenuOpen(false);
    onNavigateToCatalog?.();
  };

  const categoryTabClass = (isActive: boolean) =>
    `min-h-11 shrink-0 border-b-2 px-3 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B301] ${
      isActive
        ? 'border-[#F5B301] text-[#F5B301] light:text-[#A85F00]'
        : 'border-transparent text-zinc-200 light:text-zinc-800 hover:border-[#F5B301] hover:text-[#F5B301] light:hover:text-[#A85F00]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D12]/90 light:bg-[#F7F6F2]/90 backdrop-blur-xl border-b border-white/8 light:border-black/8 transition-colors">
      {/* Top Notice Bar */}
      <div className="hidden bg-[#131620] light:bg-[#EFECE6] text-xs py-1.5 px-4 text-zinc-300 light:text-zinc-700 border-b border-white/5 light:border-black/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-[#F5B301] light:text-[#D99B00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B301] animate-ping"></span>
              Harare Express:
            </span>
            <span>Order before 3 PM for guaranteed Same-Day Delivery in Harare & Chitungwiza.</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <button 
              onClick={openDocs} 
              className="hover:text-[#F5B301] light:hover:text-[#D99B00] transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              System Docs & Launch Checklist
            </button>
            <span className="text-zinc-600 light:text-zinc-400">|</span>
            <button 
              onClick={openAdmin} 
              className="hover:text-[#F5B301] light:hover:text-[#D99B00] transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Logo & City Selector */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to shopping"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <ArrowRight className="h-5 w-5 rotate-180" aria-hidden="true" />
            </button>
          )}
          <a
            href="#"
            aria-label="ZimMobile home"
            onClick={event => {
              if (!onClose) return;
              event.preventDefault();
              onClose();
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F5B301] to-[#D99B00] flex items-center justify-center text-black font-black text-xl tracking-tighter shadow-lg shadow-[#F5B301]/20 group-hover:scale-105 transition-transform">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white light:text-zinc-950 font-display">
                  ZimMobile
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F5B301]/20 light:bg-[#D99B00]/20 text-[#F5B301] light:text-[#D99B00] uppercase tracking-wider">
                  ZW
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-zinc-400 light:text-zinc-500 font-medium -mt-1 tracking-wide">
                PREMIER TECH BOUTIQUE
              </span>
            </div>
          </a>

          {/* City Badge / Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 text-xs font-medium text-zinc-300 light:text-zinc-700 border border-white/5 light:border-black/5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F5B301]" />
              <span>{activeCity}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 shadow-2xl p-1.5 z-50">
                <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Select Delivery Zone
                </div>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setActiveCity(city.split(' ')[0]);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      activeCity === city.split(' ')[0]
                        ? 'bg-[#F5B301]/15 text-[#F5B301] font-semibold'
                        : 'text-zinc-300 light:text-zinc-700 hover:bg-white/5 light:hover:bg-black/5'
                    }`}
                  >
                    <span>{city}</span>
                    {activeCity === city.split(' ')[0] && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar with autocomplete (Desktop & Tablet) */}
        <div ref={desktopSearchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              onFocus={() => setSearchFocused(true)}
              aria-label="Search phones"
              placeholder="Search phones, brands and models"
              className="w-full h-11 pl-11 pr-24 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-sm text-white light:text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-[#F5B301] light:focus:border-[#D99B00] focus:ring-2 focus:ring-[#F5B301]/20 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            
            {filters.searchQuery && (
              <button 
                type="button" 
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}

            <button 
              type="submit" 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#F5B301] light:bg-[#D99B00] text-black font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 shadow-2xl p-3 z-50">
              {filters.searchQuery.trim() ? (
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">
                    Matching Phones ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map(prod => (
                        <div 
                          key={prod.id}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, searchQuery: prod.name }));
                            setSearchFocused(false);
                            if (onNavigateToCatalog) onNavigateToCatalog();
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 light:hover:bg-black/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img src={prod.variants[0]?.image} alt={prod.name} className="w-9 h-9 object-cover rounded-lg bg-black/20" />
                            <div>
                              <div className="text-sm font-semibold text-white light:text-zinc-900">{prod.name}</div>
                              <div className="text-xs text-zinc-400">{prod.tagline.slice(0, 45)}...</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#F5B301] light:text-[#D99B00]">
                              ${prod.variants[0]?.priceUSD}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {prod.condition}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-zinc-400">
                      No phones found matching "{filters.searchQuery}". Try searching "iPhone", "Samsung", or "Tecno".
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">
                    Trending in Harare & Bulawayo
                  </div>
                  <div className="flex flex-wrap gap-2 px-2 pb-1">
                    {['iPhone 16 Pro Max', 'Samsung S24 Ultra', 'Tecno Spark 20 Pro+', 'Redmi Note 13 Pro+', 'Under $200'].map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, searchQuery: term }));
                          setSearchFocused(false);
                          if (onNavigateToCatalog) onNavigateToCatalog();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 light:bg-black/5 hover:bg-[#F5B301]/20 hover:text-[#F5B301] text-xs font-medium text-zinc-300 light:text-zinc-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Currency Toggle (USD / ZiG) */}
          <div className="hidden sm:flex items-center p-1 rounded-2xl bg-white/5 light:bg-black/5 border border-white/5 light:border-black/5 text-xs font-semibold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                currency === 'USD'
                  ? 'bg-[#F5B301] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white light:hover:text-black'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('ZWL')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                currency === 'ZWL'
                  ? 'bg-[#F5B301] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white light:hover:text-black'
              }`}
            >
              ZiG / ZWL
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Dark or Light Mode"
            className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 light:hover:bg-black/10 items-center justify-center border border-white/10 light:border-black/10 transition-all cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F5B301]" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-800" />
            )}
          </button>

          {/* Compare Devices Counter Button */}
          <button
            onClick={openCompare}
            className="relative hidden lg:flex items-center gap-1 px-3 h-10 rounded-xl bg-white/5 light:bg-black/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 light:text-zinc-700 border border-white/5 light:border-black/5 transition-all"
            title="Compare phones side-by-side"
          >
            <Scale className="w-4 h-4 text-[#F5B301]" />
            <span className="hidden xl:inline">Compare</span>
            {compareList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F5B301] text-black text-[10px] font-black flex items-center justify-center ml-1">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 h-10 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-[#F5B301] to-[#E5A500] text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#F5B301]/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black text-white text-[9px] font-black flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-extrabold font-display">
              ${cartTotalUSD.toLocaleString()}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-menu"
            className="w-10 h-10 rounded-xl bg-white/5 light:bg-black/5 md:hidden flex items-center justify-center text-zinc-200 light:text-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div ref={mobileSearchRef} className="relative px-3 pb-2.5 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            onFocus={() => setSearchFocused(true)}
            aria-label="Search phones"
            placeholder="Search phones, brands and models"
            className="w-full h-11 pl-10 pr-20 rounded-xl bg-[#131620] light:bg-white border border-white/10 light:border-black/10 text-sm text-white light:text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-[#F5B301]"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {filters.searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-400"
            >
              Clear
            </button>
          )}
          <button 
            type="submit" 
            className="absolute right-1 top-1/2 -translate-y-1/2 min-h-9 px-3 rounded-lg bg-[#F5B301] text-black font-semibold text-xs"
          >
            Search
          </button>
        </form>
        {searchFocused && filters.searchQuery.trim() && (
          <div className="absolute left-3 right-3 top-full z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-xl border border-white/10 light:border-black/10 bg-[#131620] light:bg-white p-2 shadow-2xl">
            {searchResults.length ? searchResults.map(product => (
              <button
                type="button"
                key={product.id}
                onClick={() => {
                  setFilters(prev => ({ ...prev, searchQuery: product.name }));
                  setSearchFocused(false);
                  onNavigateToCatalog?.();
                }}
                className="flex min-h-14 w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5 light:hover:bg-black/5"
              >
                <img src={product.variants[0]?.image} alt="" className="h-10 w-10 rounded-lg bg-white object-contain" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white light:text-zinc-900">{product.name}</span>
                <span className="text-sm font-bold text-[#F5B301] light:text-[#B66B00]">${product.variants[0]?.priceUSD}</span>
              </button>
            )) : (
              <p className="p-3 text-sm text-zinc-400">No matching phones. Try another model or brand.</p>
            )}
          </div>
        )}
      </div>

      {/* Store navigation */}
      <nav aria-label="Shop categories" className="border-t border-white/5 light:border-black/10">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => navigateWithFilters({ selectedBrand: 'all', searchQuery: '', condition: 'all', priceRange: [0, 2000] })}
            aria-pressed={filters.selectedBrand === 'all' && filters.searchQuery === '' && filters.priceRange[1] === 2000 && filters.condition === 'all'}
            className={categoryTabClass(filters.selectedBrand === 'all' && filters.searchQuery === '' && filters.priceRange[1] === 2000 && filters.condition === 'all')}
          >
            All phones
          </button>
          <button
            type="button"
            onClick={() => navigateWithFilters({ selectedBrand: 'Samsung', searchQuery: '' })}
            aria-pressed={filters.selectedBrand === 'Samsung'}
            className={categoryTabClass(filters.selectedBrand === 'Samsung')}
          >
            Samsung Galaxy
          </button>
          <button
            type="button"
            onClick={() => navigateWithFilters({ selectedBrand: 'Apple', searchQuery: '' })}
            aria-pressed={filters.selectedBrand === 'Apple'}
            className={categoryTabClass(filters.selectedBrand === 'Apple')}
          >
            Apple iPhone
          </button>
          <button
            type="button"
            onClick={() => navigateWithFilters({ selectedBrand: 'all', searchQuery: '', priceRange: [0, 1000] })}
            aria-pressed={filters.selectedBrand === 'all' && filters.priceRange[1] <= 1000}
            className={categoryTabClass(filters.selectedBrand === 'all' && filters.priceRange[1] <= 1000)}
          >
            Under $1,000
          </button>
          <button
            type="button"
            onClick={() => { openTradeIn(); setMobileMenuOpen(false); }}
            className="min-h-11 shrink-0 border-b-2 border-transparent px-3 text-xs sm:text-sm font-semibold text-zinc-200 light:text-zinc-800 hover:border-[#F5B301] hover:text-[#F5B301] light:hover:text-[#A85F00]"
          >
            Trade-in
          </button>
          <button
            type="button"
            onClick={() => { onNavigateToOrders?.(); setMobileMenuOpen(false); }}
            className="min-h-11 shrink-0 border-b-2 border-transparent px-3 text-xs sm:text-sm font-semibold text-zinc-200 light:text-zinc-800 hover:border-[#F5B301] hover:text-[#F5B301] light:hover:text-[#A85F00]"
          >
            My orders
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-header-menu" className="md:hidden border-t border-white/10 light:border-black/10 bg-[#0B0D12] light:bg-[#F7F6F2] px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 light:border-black/5 gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-white/5 flex items-center gap-1.5 text-xs font-semibold text-zinc-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#F5B301]" /> : <Moon className="w-3.5 h-3.5 text-zinc-700" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className="flex gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-lg ${currency === 'USD' ? 'bg-[#F5B301] text-black font-bold' : 'bg-white/5'}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('ZWL')}
                className={`px-3 py-1 rounded-lg ${currency === 'ZWL' ? 'bg-[#F5B301] text-black font-bold' : 'bg-white/5'}`}
              >
                ZiG
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              aria-expanded={cityDropdownOpen}
              onClick={() => setCityDropdownOpen(prev => !prev)}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-200 light:border-black/10 light:bg-white light:text-zinc-800"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F5B301]" aria-hidden="true" />
                Delivery area: {activeCity}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {cityDropdownOpen && (
              <div className="mt-1 rounded-xl border border-white/10 bg-[#131620] p-1 light:border-black/10 light:bg-white">
                {cities.map(city => {
                  const cityName = city.split(' ')[0];
                  return (
                    <button
                      type="button"
                      key={city}
                      onClick={() => {
                        setActiveCity(cityName);
                        setCityDropdownOpen(false);
                      }}
                      className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm ${
                        activeCity === cityName
                          ? 'bg-[#F5B301]/15 font-semibold text-[#F5B301] light:text-[#A85F00]'
                          : 'text-zinc-300 hover:bg-white/5 light:text-zinc-700 light:hover:bg-black/5'
                      }`}
                    >
                      {city}
                      {activeCity === cityName && <Check className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {extraMenuContent}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { openPhoneFinder(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#131620] light:bg-white border border-white/5 text-xs font-semibold text-white light:text-zinc-900"
            >
              <Sparkles className="w-4 h-4 text-[#F5B301]" />
              <span>Phone Finder</span>
            </button>
            <button
              onClick={() => { openCompare(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#131620] light:bg-white border border-white/5 text-xs font-semibold text-white light:text-zinc-900"
            >
              <Scale className="w-4 h-4 text-[#F5B301]" />
              <span>Compare ({compareList.length})</span>
            </button>
            <button
              onClick={() => { openTradeIn(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#131620] light:bg-white border border-white/5 text-xs font-semibold text-white light:text-zinc-900"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F5B301]" />
              <span>Trade-In Valuator</span>
            </button>
            <button
              onClick={() => { openLayaway(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#131620] light:bg-white border border-white/5 text-xs font-semibold text-white light:text-zinc-900"
            >
              <Clock className="w-4 h-4 text-[#F5B301]" />
              <span>Layaway Plan</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
            <button onClick={() => { openDocs(); setMobileMenuOpen(false); }} className="hover:text-white">
              Launch Checklist & Docs
            </button>
            <button onClick={() => { openAdmin(); setMobileMenuOpen(false); }} className="hover:text-white">
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

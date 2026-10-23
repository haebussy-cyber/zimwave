import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductVariant, 
  CartItem, 
  Order, 
  FilterState, 
  Brand 
} from '../types';
import { PRODUCTS, ZIM_EXCHANGE_RATE } from '../data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  orders: Order[];
  currency: 'USD' | 'ZWL';
  exchangeRate: number;
  activeCity: string;
  theme: 'dark' | 'light';
  
  // UI states
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isCompareOpen: boolean;
  isPhoneFinderOpen: boolean;
  isTradeInOpen: boolean;
  isLayawayOpen: boolean;
  isDocsOpen: boolean;
  isAdminOpen: boolean;
  activeProductModal: Product | null;
  activeContentModal: 'about' | 'warranty' | 'shipping' | 'privacy' | 'terms' | null;

  // Filter state
  filters: FilterState;
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  placeOrder: (newOrder: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setCurrency: (c: 'USD' | 'ZWL') => void;
  setActiveCity: (city: string) => void;
  toggleTheme: () => void;
  
  // Modal openers
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  openPhoneFinder: () => void;
  closePhoneFinder: () => void;
  openTradeIn: () => void;
  closeTradeIn: () => void;
  openLayaway: () => void;
  closeLayaway: () => void;
  openDocs: () => void;
  closeDocs: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  openContentModal: (slug: 'about' | 'warranty' | 'shipping' | 'privacy' | 'terms') => void;
  closeContentModal: () => void;

  // Helpers
  formatPrice: (usd: number) => { usdFormatted: string; zwlFormatted: string; primary: string; secondary: string };
  cartTotalUSD: number;
  cartTotalCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  selectedBrand: 'all',
  priceRange: [0, 2000],
  storage: [],
  condition: 'all',
  sortBy: 'featured',
  onlyInStock: false,
  only5G: false
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'ZWL'>('USD');
  const [activeCity, setActiveCity] = useState<string>('Harare');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('zimmobile_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'light';
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isPhoneFinderOpen, setIsPhoneFinderOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isLayawayOpen, setIsLayawayOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeContentModal, setActiveContentModal] = useState<'about' | 'warranty' | 'shipping' | 'privacy' | 'terms' | null>(null);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Sync theme with html class & persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      try { localStorage.setItem('zimmobile_theme', 'light'); } catch {}
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      try { localStorage.setItem('zimmobile_theme', 'dark'); } catch {}
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.variant.id === variant.id
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { productId: product.id, product, variant, quantity }];
    });
    // Open drawer on add
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variant.id === variantId)));
  };

  const updateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variant.id === variantId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const placeOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const formatPrice = (usd: number) => {
    const zwl = Math.round(usd * ZIM_EXCHANGE_RATE);
    const usdFormatted = `$${usd.toLocaleString()}`;
    const zwlFormatted = `ZiG ${zwl.toLocaleString()}`;
    return {
      usdFormatted,
      zwlFormatted,
      primary: currency === 'USD' ? usdFormatted : zwlFormatted,
      secondary: currency === 'USD' ? zwlFormatted : usdFormatted
    };
  };

  const cartTotalUSD = cart.reduce((sum, item) => sum + item.variant.priceUSD * item.quantity, 0);
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      wishlist,
      compareList,
      orders,
      currency,
      exchangeRate: ZIM_EXCHANGE_RATE,
      activeCity,
      theme,

      isCartOpen,
      isCheckoutOpen,
      isCompareOpen,
      isPhoneFinderOpen,
      isTradeInOpen,
      isLayawayOpen,
      isDocsOpen,
      isAdminOpen,
      activeProductModal,
      activeContentModal,

      filters,
      setFilters,
      resetFilters,

      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      placeOrder,
      updateOrderStatus,
      setCurrency,
      setActiveCity,
      toggleTheme,

      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      openCheckout: () => { setIsCartOpen(false); setIsCheckoutOpen(true); },
      closeCheckout: () => setIsCheckoutOpen(false),
      openProductModal: (p) => setActiveProductModal(p),
      closeProductModal: () => setActiveProductModal(null),
      openCompare: () => setIsCompareOpen(true),
      closeCompare: () => setIsCompareOpen(false),
      openPhoneFinder: () => setIsPhoneFinderOpen(true),
      closePhoneFinder: () => setIsPhoneFinderOpen(false),
      openTradeIn: () => setIsTradeInOpen(true),
      closeTradeIn: () => setIsTradeInOpen(false),
      openLayaway: () => setIsLayawayOpen(true),
      closeLayaway: () => setIsLayawayOpen(false),
      openDocs: () => setIsDocsOpen(true),
      closeDocs: () => setIsDocsOpen(false),
      openAdmin: () => setIsAdminOpen(true),
      closeAdmin: () => setIsAdminOpen(false),
      openContentModal: (slug) => setActiveContentModal(slug),
      closeContentModal: () => setActiveContentModal(null),

      formatPrice,
      cartTotalUSD,
      cartTotalCount
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

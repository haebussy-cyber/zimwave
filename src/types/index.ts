/**
 * Types & Domain Models for ZimMobile - Zimbabwe's Premier Tech Boutique
 */

export type Brand = 'Apple' | 'Samsung' | 'Xiaomi' | 'Tecno' | 'Google' | (string & {});

export type DeviceCondition = 'Brand New Sealed' | 'Certified Pre-Owned Pristine';

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  storage: string; // e.g. "128GB", "256GB", "512GB", "1TB"
  priceUSD: number;
  originalPriceUSD?: number;
  stock: number;
  sku: string;
  image: string;
}

export interface ProductSpecs {
  screen: string;
  processor: string;
  ram: string;
  rearCamera: string;
  selfieCamera: string;
  battery: string;
  charging: string;
  os: string;
  network: string; // e.g. "5G Dual SIM (Nano + eSIM)"
  sim: string;
  waterResistance: string;
  warranty: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string; // e.g. "Harare (Borrowdale)", "Bulawayo (Suburbs)", "Gweru"
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  phoneBought: string;
}

export interface Product {
  id: string;
  slug: string;
  category?: string;
  model?: string;
  name: string;
  brand: Brand;
  tagline: string;
  description: string;
  condition: DeviceCondition;
  isFlashDeal?: boolean;
  flashDealDiscountPercent?: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  variants: ProductVariant[];
  galleryImages: string[];
  specs: ProductSpecs;
  boxContents: string[];
  highlightBadge?: string; // e.g. "Same-Day Dispatch", "Harare Best Seller"
}

export interface CartItem {
  productId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export type DeliveryMethod = 
  | 'harare-same-day' // $5 (Free > $100)
  | 'chitungwiza-same-day' // $7
  | 'provincial-courier' // $10 (Swift/FedEx to Bulawayo, Mutare, Gweru)
  | 'store-pickup-eastgate' // Free (Eastgate Mall Harare)
  | 'store-pickup-avondale' // Free (Avondale Shopping Centre)
  | 'store-pickup-bulawayo'; // Free (Ascot Centre Bulawayo)

export type PaymentMethodType = 
  | 'ecocash' 
  | 'paynow' 
  | 'onemoney' 
  | 'cod' 
  | 'store-pay';

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel: string;
  priceUSD: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ZM-84920"
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryMethod: DeliveryMethod;
  deliveryFeeUSD: number;
  paymentMethod: PaymentMethodType;
  paymentPhone?: string;
  paymentStatus: 'paid' | 'pending-cod' | 'verifying';
  subtotalUSD: number;
  discountUSD: number;
  totalUSD: number;
  totalZWL: number;
  exchangeRate: number; // e.g. 28.5
  items: OrderItem[];
  status: 'confirmed' | 'packing' | 'dispatching' | 'delivered' | 'cancelled';
  riderName?: string;
  riderPhone?: string;
  trackingUpdates: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface TradeInSubmission {
  currentBrand: string;
  currentModel: string;
  storage: string;
  condition: 'Like New (Flawless)' | 'Good (Minor Scratches)' | 'Fair (Heavy Wear)' | 'Cracked Screen';
  batteryHealth?: string;
  targetDevice: string;
  estimatedValueUSD: number;
  customerName: string;
  customerPhone: string;
}

export interface LayawayPlan {
  productName: string;
  variantLabel: string;
  totalPriceUSD: number;
  depositPercent: number; // 25%, 35%, 50%
  depositAmountUSD: number;
  durationMonths: number; // 1, 2, or 3 months
  monthlyInstallmentUSD: number;
  customerName: string;
  customerPhone: string;
}

export interface FilterState {
  searchQuery: string;
  selectedBrand: string;
  priceRange: [number, number];
  storage: string[];
  condition: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount';
  onlyInStock: boolean;
  only5G: boolean;
}

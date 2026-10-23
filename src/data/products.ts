import { Product, CustomerReview } from '../types';

export const ZIM_EXCHANGE_RATE = 28.5; // 1 USD = 28.5 ZiG / ZWL reference rate

export const STORE_LOCATIONS = [
  {
    id: 'eastgate',
    name: 'Eastgate Mall Flagship',
    city: 'Harare',
    address: 'Shop 14, Ground Floor, Eastgate Mall, Robert Mugabe Rd, Harare',
    phone: '+263 77 123 4567',
    hours: 'Mon - Sat: 8:00 AM - 6:30 PM | Sun: 9:00 AM - 3:00 PM',
    isPrimary: true
  },
  {
    id: 'avondale',
    name: 'Avondale Tech Boutique',
    city: 'Harare',
    address: 'Shop 2B, Avondale Shopping Centre, King George Rd, Harare',
    phone: '+263 78 987 6543',
    hours: 'Mon - Sat: 8:30 AM - 7:00 PM | Sun: 9:00 AM - 4:00 PM',
    isPrimary: false
  },
  {
    id: 'bulawayo',
    name: 'Ascot Centre Hub',
    city: 'Bulawayo',
    address: 'Shop 8, Ascot Shopping Centre, 12th Avenue Ext, Bulawayo',
    phone: '+263 71 555 8899',
    hours: 'Mon - Sat: 8:30 AM - 5:30 PM',
    isPrimary: false
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-16-pro-max',
    slug: 'apple-iphone-16-pro-max',
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    tagline: 'Titanium powerhouse with Camera Control and A18 Pro chip.',
    description: 'Forged in grade 5 titanium with an exquisite micro-blasted finish. Featuring the thinnest borders on any Apple product, the monstrous A18 Pro silicon, and an all-new 48MP Fusion camera with 4K 120 fps Dolby Vision recording.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: true,
    flashDealDiscountPercent: 8,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 38,
    tags: ['Flagship', 'Titanium', 'Camera Control', 'A18 Pro', 'Apple Intelligence'],
    highlightBadge: 'Harare Express Ready',
    variants: [
      {
        id: 'i16pm-nat-256',
        colorName: 'Natural Titanium',
        colorHex: '#9E9992',
        storage: '256GB',
        priceUSD: 1450,
        originalPriceUSD: 1580,
        stock: 4,
        sku: 'ZM-IP16PM-NAT-256',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'i16pm-blk-256',
        colorName: 'Black Titanium',
        colorHex: '#252527',
        storage: '256GB',
        priceUSD: 1450,
        originalPriceUSD: 1580,
        stock: 3,
        sku: 'ZM-IP16PM-BLK-256',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'i16pm-des-512',
        colorName: 'Desert Titanium',
        colorHex: '#C5A992',
        storage: '512GB',
        priceUSD: 1680,
        originalPriceUSD: 1799,
        stock: 2,
        sku: 'ZM-IP16PM-DES-512',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'i16pm-wht-1tb',
        colorName: 'White Titanium',
        colorHex: '#E3E4E5',
        storage: '1TB',
        priceUSD: 1950,
        originalPriceUSD: 2099,
        stock: 1,
        sku: 'ZM-IP16PM-WHT-1TB',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.9" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak',
      processor: 'Apple A18 Pro (3nm), 6-core GPU, 16-core Neural Engine',
      ram: '8GB Unified Memory',
      rearCamera: '48MP Main (f/1.8) + 48MP Ultra-Wide + 12MP 5x Periscope Telephoto',
      selfieCamera: '12MP TrueDepth with Autofocus (f/1.9)',
      battery: '4,685 mAh (Up to 33 hours video playback)',
      charging: '45W Wired Fast Charge, 25W MagSafe Wireless',
      os: 'iOS 18 with Apple Intelligence readiness',
      network: '5G Dual SIM (Physical Nano-SIM + eSIM)',
      sim: 'Nano-SIM + eSIM (Fully unlocked for Econet, NetOne, Telecel)',
      waterResistance: 'IP68 (6m up to 30 mins)',
      warranty: '12 Months Official ZimMobile Replacement Guarantee'
    },
    boxContents: [
      'iPhone 16 Pro Max in Factory Sealed Box',
      'Braided USB-C Charge Cable (1m)',
      'Documentation & SIM Ejector Pin',
      'Official ZimMobile 12-Month Warranty Certificate'
    ]
  },
  {
    id: 'samsung-s24-ultra',
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    tagline: 'Titanium armor, built-in S Pen, and breakthrough Galaxy AI.',
    description: 'The pinnacle of Android engineering. Featuring an ultra-flat 6.8-inch Dynamic AMOLED 2X display with anti-reflective Corning Gorilla Armor, 200MP quadruple camera setup with 100x Space Zoom, and all-day battery.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: true,
    flashDealDiscountPercent: 12,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 45,
    tags: ['Galaxy AI', '200MP Camera', 'S-Pen', 'Snapdragon 8 Gen 3', 'Titanium'],
    highlightBadge: 'Zimbabwe Top Seller',
    variants: [
      {
        id: 's24u-gry-256',
        colorName: 'Titanium Gray',
        colorHex: '#68676C',
        storage: '256GB',
        priceUSD: 1199,
        originalPriceUSD: 1350,
        stock: 5,
        sku: 'ZM-SAM-S24U-GRY-256',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 's24u-blk-512',
        colorName: 'Titanium Black',
        colorHex: '#1B1B1D',
        storage: '512GB',
        priceUSD: 1380,
        originalPriceUSD: 1499,
        stock: 3,
        sku: 'ZM-SAM-S24U-BLK-512',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 's24u-vlt-512',
        colorName: 'Titanium Violet',
        colorHex: '#4C4258',
        storage: '512GB',
        priceUSD: 1380,
        originalPriceUSD: 1499,
        stock: 2,
        sku: 'ZM-SAM-S24U-VLT-512',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.8" Flat QHD+ Dynamic AMOLED 2X, 1-120Hz, 2600 nits, Gorilla Armor',
      processor: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)',
      ram: '12GB LPDDR5X',
      rearCamera: '200MP Main + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra-Wide',
      selfieCamera: '12MP Dual Pixel AF (f/2.2)',
      battery: '5,000 mAh Intelligent All-Day Battery',
      charging: '45W Wired (65% in 30 mins), 15W Wireless, Wireless PowerShare',
      os: 'One UI 6.1 on Android 14 (7 Years OS & Security Updates)',
      network: '5G Dual Physical SIM + eSIM',
      sim: 'Dual Nano-SIM (Econet / NetOne dual active)',
      waterResistance: 'IP68 & Embedded S Pen IP68',
      warranty: '12 Months Official Samsung Regional Warranty'
    },
    boxContents: [
      'Samsung Galaxy S24 Ultra Phone with S Pen',
      'USB-C to USB-C Data Cable',
      'Ejection Pin',
      'Quick Start Guide & Warranty Card'
    ]
  },
  {
    id: 'iphone-15-pro',
    slug: 'apple-iphone-15-pro-preowned',
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    tagline: 'Aerospace-grade titanium design with Action button and A17 Pro.',
    description: 'Certified Pre-Owned in pristine cosmetic condition (100% scratch-free screen, 95%+ battery health). Inspected by certified Harare engineers with full 12-month hardware warranty.',
    condition: 'Certified Pre-Owned Pristine',
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 52,
    tags: ['Pre-Owned Pristine', 'Titanium', 'A17 Pro', 'Action Button', 'USB-C'],
    highlightBadge: 'Pristine 96%+ Battery',
    variants: [
      {
        id: 'i15p-blu-128',
        colorName: 'Blue Titanium',
        colorHex: '#2E3542',
        storage: '128GB',
        priceUSD: 870,
        originalPriceUSD: 999,
        stock: 6,
        sku: 'ZM-IP15P-CPO-BLU-128',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'i15p-nat-256',
        colorName: 'Natural Titanium',
        colorHex: '#9E9992',
        storage: '256GB',
        priceUSD: 960,
        originalPriceUSD: 1099,
        stock: 3,
        sku: 'ZM-IP15P-CPO-NAT-256',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED, 120Hz ProMotion, Always-On',
      processor: 'Apple A17 Pro (3nm)',
      ram: '8GB',
      rearCamera: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
      selfieCamera: '12MP TrueDepth',
      battery: '3,274 mAh (Battery Health verified >94%)',
      charging: '20W USB-C, 15W MagSafe',
      os: 'iOS 18 Supported',
      network: '5G (Physical SIM + eSIM)',
      sim: 'Nano-SIM + eSIM',
      waterResistance: 'IP68',
      warranty: '12 Months ZimMobile Full Hardware Replacement'
    },
    boxContents: [
      'iPhone 15 Pro (Grade A+ Certified Device)',
      'Fast USB-C Charging Cable',
      'Quality Inspection Certificate signed by Harare Lab'
    ]
  },
  {
    id: 'samsung-galaxy-a55',
    slug: 'samsung-galaxy-a55-5g',
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    tagline: 'Premium glass back, metal frame, and flagship-grade 50MP nightography.',
    description: 'Zimbabwe’s absolute favorite mid-ranger. Features a gorgeous metal frame, Gorilla Glass Victus+ front and back, Knox Vault security, and an expansive 6.6-inch 120Hz AMOLED display.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: true,
    flashDealDiscountPercent: 10,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 64,
    tags: ['Mid-Range King', '5G', 'Knox Vault', '5000mAh', 'Metal Frame'],
    highlightBadge: 'Fastest Selling in Zim',
    variants: [
      {
        id: 'a55-ice-128',
        colorName: 'Awesome Ice Blue',
        colorHex: '#D2E3ED',
        storage: '128GB',
        priceUSD: 360,
        originalPriceUSD: 399,
        stock: 9,
        sku: 'ZM-SAM-A55-BLU-128',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'a55-nav-256',
        colorName: 'Awesome Navy',
        colorHex: '#1D2533',
        storage: '256GB',
        priceUSD: 410,
        originalPriceUSD: 450,
        stock: 7,
        sku: 'ZM-SAM-A55-NAV-256',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.6" Super AMOLED, 120Hz, 1000 nits HBM, HDR10+',
      processor: 'Exynos 1480 (4nm) with AMD Xclipse 530 GPU',
      ram: '8GB RAM + RAM Plus',
      rearCamera: '50MP OIS Main + 12MP Ultra-Wide + 5MP Macro',
      selfieCamera: '32MP High-Res Portrait Camera',
      battery: '5,000 mAh (2-day battery life)',
      charging: '25W Super Fast Charging',
      os: 'One UI 6.1 on Android 14 (4 OS updates)',
      network: '5G Dual SIM',
      sim: 'Hybrid Dual SIM (Nano-SIM + MicroSD up to 1TB)',
      waterResistance: 'IP67 Water & Dust Resistance',
      warranty: '12 Months Official Samsung Warranty'
    },
    boxContents: [
      'Samsung Galaxy A55 5G Phone (Sealed)',
      'USB-C to USB-C Cable',
      'SIM Tool & Quick Guides'
    ]
  },
  {
    id: 'xiaomi-14-ultra',
    slug: 'xiaomi-14-ultra-leica',
    name: 'Xiaomi 14 Ultra (Leica Quad-Cam)',
    brand: 'Xiaomi',
    tagline: 'Leica Summilux optical lenses with stepless 1-inch variable aperture.',
    description: 'The photography titan. Co-engineered with Leica, featuring four 50MP cameras, Snapdragon 8 Gen 3, and ultra-durable Guardian Structure ceramic/vegan leather finish.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 22,
    tags: ['Leica Optics', '1-inch Sensor', 'Snapdragon 8 Gen 3', '90W Fast Charge'],
    highlightBadge: 'Pro Photography',
    variants: [
      {
        id: 'x14u-blk-512',
        colorName: 'Obsidian Black Vegan Leather',
        colorHex: '#1E1E1E',
        storage: '512GB',
        priceUSD: 1150,
        originalPriceUSD: 1280,
        stock: 3,
        sku: 'ZM-MI14U-BLK-512',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'x14u-wht-512',
        colorName: 'Pure White Vegan Leather',
        colorHex: '#EAE8E3',
        storage: '512GB',
        priceUSD: 1150,
        originalPriceUSD: 1280,
        stock: 2,
        sku: 'ZM-MI14U-WHT-512',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.73" WQHD+ LTPO AMOLED, 1-120Hz, 3000 nits, Dolby Vision',
      processor: 'Snapdragon 8 Gen 3 (4nm)',
      ram: '16GB LPDDR5X',
      rearCamera: '50MP 1" LYT-900 (f/1.63-f/4.0) + 50MP 3.2x Tele + 50MP 5x Periscope + 50MP Ultra-Wide',
      selfieCamera: '32MP 4K Front Camera',
      battery: '5,000 mAh Silicon-Carbon Battery',
      charging: '90W HyperCharge (100% in 33 mins) + 80W Wireless',
      os: 'Xiaomi HyperOS based on Android 14',
      network: '5G Dual SIM',
      sim: 'Dual Nano-SIM',
      waterResistance: 'IP68 Certified',
      warranty: '12 Months Official ZimMobile Warranty'
    },
    boxContents: [
      'Xiaomi 14 Ultra Device (Factory Sealed)',
      '90W Fast Charger Included in Box',
      'Protective Case & USB-C Cable',
      'SIM Tray Ejector'
    ]
  },
  {
    id: 'redmi-note-13-pro-plus',
    slug: 'redmi-note-13-pro-plus-5g',
    name: 'Redmi Note 13 Pro+ 5G',
    brand: 'Xiaomi',
    tagline: '200MP OIS camera, curved 1.5K 120Hz display, and blistering 120W HyperCharge.',
    description: 'Unrivalled luxury value. Curved AMOLED screen, IP68 water resistance (first time in Redmi Note series), and charges from 0 to 100% in just 19 minutes with the included 120W wall adapter.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: true,
    flashDealDiscountPercent: 14,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 49,
    tags: ['120W HyperCharge', '200MP OIS', 'Curved Display', 'IP68'],
    highlightBadge: 'Harare Value Champion',
    variants: [
      {
        id: 'rn13pp-blk-256',
        colorName: 'Midnight Black',
        colorHex: '#18181A',
        storage: '256GB',
        priceUSD: 365,
        originalPriceUSD: 420,
        stock: 8,
        sku: 'ZM-RN13PP-BLK-256',
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'rn13pp-pur-512',
        colorName: 'Aurora Purple',
        colorHex: '#7C6788',
        storage: '512GB',
        priceUSD: 415,
        originalPriceUSD: 475,
        stock: 5,
        sku: 'ZM-RN13PP-PUR-512',
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.67" Curved 1.5K CrystalRes AMOLED, 120Hz, 1800 nits, Gorilla Glass Victus',
      processor: 'MediaTek Dimensity 7200-Ultra (4nm)',
      ram: '12GB LPDDR5',
      rearCamera: '200MP Main with OIS + 8MP Ultra-Wide + 2MP Macro',
      selfieCamera: '16MP HDR Selfie Camera',
      battery: '5,000 mAh High-Density Cell',
      charging: '120W HyperCharge (0 to 100% in 19 mins - Charger in Box!)',
      os: 'MIUI 14 / HyperOS upgradeable',
      network: '5G Dual SIM',
      sim: 'Dual Nano-SIM',
      waterResistance: 'IP68 Water & Dust Resistance',
      warranty: '12 Months Full ZimMobile Warranty'
    },
    boxContents: [
      'Redmi Note 13 Pro+ 5G Device',
      '120W Ultra-Fast Power Adapter',
      'Protective Case',
      'USB-C Cable & Documentation'
    ]
  },
  {
    id: 'tecno-camon-30-premier',
    slug: 'tecno-camon-30-premier-5g',
    name: 'Tecno Camon 30 Premier 5G',
    brand: 'Tecno',
    tagline: 'Sony PolarAce imaging chip with quadruple 50MP cameras.',
    description: 'Tecno’s most ambitious flagship yet. Suede Tech-Art leather back, aerospace-grade zoom periscope lens, and full dual-chip AI imaging tuned specifically for rich skin tone photography.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 31,
    tags: ['Sony PolarAce', 'Quad 50MP', 'Dimensity 8200', 'Tech-Art Leather'],
    highlightBadge: 'Epic Portrait Camera',
    variants: [
      {
        id: 'tc30p-sil-512',
        colorName: 'Alps Snowy Silver',
        colorHex: '#D5D9DC',
        storage: '512GB',
        priceUSD: 440,
        originalPriceUSD: 490,
        stock: 6,
        sku: 'ZM-TEC-C30P-SIL-512',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.77" 1.5K LTPO AMOLED, 1-120Hz, 1400 nits, Gorilla Glass 5',
      processor: 'MediaTek Dimensity 8200 Ultimate (4nm) + Sony CXD5622GG Imaging ISP',
      ram: '12GB + 12GB Extended RAM (24GB Total)',
      rearCamera: '50MP Sony IMX890 OIS + 50MP 3x Periscope Tele + 50MP Ultra-Wide',
      selfieCamera: '50MP Eye-Tracking Autofocus Selfie Camera',
      battery: '5,000 mAh Long-Life Battery',
      charging: '70W Ultra Charge (0 to 100% in 45 mins)',
      os: 'HiOS 14 based on Android 14',
      network: '5G Dual SIM',
      sim: 'Dual Nano-SIM',
      waterResistance: 'IP54 Splash Resistant',
      warranty: '13 Months Official Carlcare Zimbabwe Warranty'
    },
    boxContents: [
      'Tecno Camon 30 Premier 5G Phone',
      '70W Fast Charger with Heavy Duty Cable',
      'Designer Protective Bumper Case',
      'Carlcare Warranty Certificate'
    ]
  },
  {
    id: 'tecno-spark-20-pro-plus',
    slug: 'tecno-spark-20-pro-plus',
    name: 'Tecno Spark 20 Pro+ (Budget King)',
    brand: 'Tecno',
    tagline: '108MP camera, 120Hz curved AMOLED, and 256GB storage under $190.',
    description: 'The undisputed value champion across Harare, Chitungwiza, and Bulawayo. Stunning curved AMOLED screen usually reserved for $800 phones, coupled with 256GB of onboard storage and 33W fast charging.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: true,
    flashDealDiscountPercent: 15,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 88,
    tags: ['Under $200', '108MP Camera', 'Curved AMOLED', '256GB Storage'],
    highlightBadge: 'Harare Top Budget Choice',
    variants: [
      {
        id: 'tsp20p-grn-256',
        colorName: 'Magic Skin 2.0 Green',
        colorHex: '#2F5233',
        storage: '256GB',
        priceUSD: 175,
        originalPriceUSD: 205,
        stock: 14,
        sku: 'ZM-TEC-SP20P-GRN-256',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'tsp20p-blk-256',
        colorName: 'Temporal Orbits Black',
        colorHex: '#1A1C20',
        storage: '256GB',
        priceUSD: 175,
        originalPriceUSD: 205,
        stock: 11,
        sku: 'ZM-TEC-SP20P-BLK-256',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.78" 120Hz Curved AMOLED, 1000 nits peak, Corning Gorilla Glass 5',
      processor: 'MediaTek Helio G99 Ultimate (6nm)',
      ram: '8GB RAM + 8GB Memory Fusion (16GB)',
      rearCamera: '108MP Ultra Sensing Main with 3x in-sensor zoom + Quad Flash',
      selfieCamera: '32MP Glowing Selfie with Dual Flash',
      battery: '5,000 mAh',
      charging: '33W Super Charge',
      os: 'Android 14 with Dynamic Port notifications',
      network: '4G LTE Dual SIM (Excellent Econet & NetOne network lock-on)',
      sim: 'Dual Nano-SIM + MicroSD Slot',
      waterResistance: 'IP53 Water/Dust resistance',
      warranty: '12 Months Carlcare Zimbabwe Warranty'
    },
    boxContents: [
      'Tecno Spark 20 Pro+ Phone',
      '33W Charger and Type-C Cable',
      'Protective Case and Tempered Glass in Box',
      'SIM Ejector Pin'
    ]
  },
  {
    id: 'apple-iphone-13',
    slug: 'apple-iphone-13-sealed',
    name: 'Apple iPhone 13 (Brand New)',
    brand: 'Apple',
    tagline: 'Reliable A15 Bionic speed, Cinematic video, and all-day battery.',
    description: 'The golden ratio of price to performance for Zimbabwean iOS users. Fully factory sealed brand new stock, capable of receiving iOS updates for years to come with full Econet/NetOne 5G compatibility.',
    condition: 'Brand New Sealed',
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 76,
    tags: ['Best Value iPhone', 'A15 Bionic', 'Cinematic Mode', 'Super Retina XDR'],
    highlightBadge: 'Top iPhone Value',
    variants: [
      {
        id: 'i13-mid-128',
        colorName: 'Midnight',
        colorHex: '#1D2228',
        storage: '128GB',
        priceUSD: 520,
        originalPriceUSD: 590,
        stock: 5,
        sku: 'ZM-IP13-NEW-MID-128',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'i13-starlight-128',
        colorName: 'Starlight',
        colorHex: '#F6F5F0',
        storage: '128GB',
        priceUSD: 520,
        originalPriceUSD: 590,
        stock: 4,
        sku: 'ZM-IP13-NEW-STA-128',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED, 1200 nits peak, Ceramic Shield',
      processor: 'Apple A15 Bionic (5nm)',
      ram: '4GB',
      rearCamera: 'Dual 12MP (Wide + Ultra-Wide) with Sensor-Shift OIS',
      selfieCamera: '12MP TrueDepth Camera with Night Mode',
      battery: '3,227 mAh (Up to 19 hours video playback)',
      charging: '20W Fast Wired, 15W MagSafe',
      os: 'iOS 18 Ready',
      network: '5G Dual SIM (Physical Nano + eSIM)',
      sim: 'Nano-SIM + eSIM',
      waterResistance: 'IP68 (6m for 30 mins)',
      warranty: '12 Months Official ZimMobile Warranty'
    },
    boxContents: [
      'Apple iPhone 13 (Factory Sealed Original Packaging)',
      'USB-C to Lightning Cable',
      'Documentation & Apple Sticker'
    ]
  },
  {
    id: 'samsung-z-fold-5',
    slug: 'samsung-galaxy-z-fold-5-cpo',
    name: 'Samsung Galaxy Z Fold 5',
    brand: 'Samsung',
    tagline: '7.6-inch folding workspace with zero-gap Flex Hinge.',
    description: 'Transform your pocket into a portable boardroom. Run 3 apps simultaneously, sketch contracts with S-Pen Fold Edition, and experience movies on an expansive folding inner display.',
    condition: 'Certified Pre-Owned Pristine',
    isFeatured: false,
    isFlashDeal: false,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 16,
    tags: ['Foldable', 'Multitasking', 'Flex Hinge', 'Snapdragon 8 Gen 2'],
    highlightBadge: 'Executive Choice',
    variants: [
      {
        id: 'zf5-icy-256',
        colorName: 'Icy Blue',
        colorHex: '#7C93A6',
        storage: '256GB',
        priceUSD: 890,
        originalPriceUSD: 1150,
        stock: 2,
        sku: 'ZM-ZF5-CPO-BLU-256',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'zf5-blk-512',
        colorName: 'Phantom Black',
        colorHex: '#18191B',
        storage: '512GB',
        priceUSD: 990,
        originalPriceUSD: 1280,
        stock: 2,
        sku: 'ZM-ZF5-CPO-BLK-512',
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: 'Main: 7.6" QXGA+ Dynamic AMOLED 2X 120Hz; Cover: 6.2" HD+ 120Hz',
      processor: 'Snapdragon 8 Gen 2 Mobile Platform for Galaxy',
      ram: '12GB LPDDR5X',
      rearCamera: '50MP OIS Dual Pixel + 10MP 3x Telephoto + 12MP Ultra-Wide',
      selfieCamera: '10MP Cover Camera + 4MP Under Display Camera',
      battery: '4,400 mAh Dual Battery',
      charging: '25W Fast Charging, Fast Wireless Charging 2.0',
      os: 'One UI 6.1.1 Foldable Edition',
      network: '5G Dual SIM',
      sim: 'Dual Nano-SIM + eSIM',
      waterResistance: 'IPX8 Water Resistant',
      warranty: '12 Months ZimMobile Hardware Warranty'
    },
    boxContents: [
      'Galaxy Z Fold 5 Certified Phone',
      'USB-C Charging & Data Cable',
      'SIM Pin and Diagnostic Certificate'
    ]
  },
  {
    id: 'google-pixel-8-pro',
    slug: 'google-pixel-8-pro-cpo',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    tagline: 'Google Tensor G3, best-in-class computational photo magic, and Gemini AI.',
    description: 'The purest Android experience on earth. Temperature sensor, Best Take, Magic Editor, and unrivaled portrait skin-tone accuracy, fully unlocked for all Zimbabwean telecommunication networks.',
    condition: 'Certified Pre-Owned Pristine',
    isFeatured: false,
    isFlashDeal: true,
    flashDealDiscountPercent: 18,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 29,
    tags: ['Google Tensor G3', 'Best Take', 'Magic Editor', 'Pure Android'],
    highlightBadge: 'AI Photo King',
    variants: [
      {
        id: 'p8p-bay-128',
        colorName: 'Bay Blue',
        colorHex: '#8DAFD5',
        storage: '128GB',
        priceUSD: 620,
        originalPriceUSD: 750,
        stock: 3,
        sku: 'ZM-P8P-CPO-BAY-128',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'p8p-obs-256',
        colorName: 'Obsidian Black',
        colorHex: '#25262B',
        storage: '256GB',
        priceUSD: 690,
        originalPriceUSD: 820,
        stock: 2,
        sku: 'ZM-P8P-CPO-OBS-256',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.7" Super Actua LTPO OLED, 1-120Hz, 2400 nits, Matte glass back',
      processor: 'Google Tensor G3 with Titan M2 security coprocessor',
      ram: '12GB LPDDR5X',
      rearCamera: '50MP Octa PD Main + 48MP Quad PD Ultrawide + 48MP 5x Telephoto',
      selfieCamera: '10.5MP Dual PD Selfie with AF',
      battery: '5,050 mAh (Beyond 24-hour battery)',
      charging: '30W Fast Wired, Fast Qi Wireless',
      os: 'Pure Android 14 (7 Years OS Updates direct from Google)',
      network: '5G (Sub-6 / mmWave)',
      sim: 'Nano-SIM + eSIM',
      waterResistance: 'IP68',
      warranty: '12 Months Hardware Guarantee'
    },
    boxContents: [
      'Google Pixel 8 Pro Phone',
      'USB-C to USB-C Cable (1m)',
      'Quick Switch Adapter & Diagnostic Slip'
    ]
  },
  {
    id: 'samsung-s23-fe',
    slug: 'samsung-galaxy-s23-fe',
    name: 'Samsung Galaxy S23 FE 5G',
    brand: 'Samsung',
    tagline: 'Flagship camera, smooth 120Hz display, and premium metal-glass design.',
    description: 'The Fan Edition that delivers 90% of the flagship experience at half the price. 50MP pro-grade camera, aluminum frame, and IP68 water resistance.',
    condition: 'Brand New Sealed',
    isFeatured: false,
    isFlashDeal: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 34,
    tags: ['Fan Edition', '50MP Camera', 'Snapdragon 8 Gen 1', 'Wireless Charging'],
    highlightBadge: 'Flagship Alternative',
    variants: [
      {
        id: 's23fe-grf-128',
        colorName: 'Graphite',
        colorHex: '#303236',
        storage: '128GB',
        priceUSD: 460,
        originalPriceUSD: 520,
        stock: 5,
        sku: 'ZM-SAM-S23FE-GRF-128',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 's23fe-mnt-256',
        colorName: 'Mint Green',
        colorHex: '#B2CDBC',
        storage: '256GB',
        priceUSD: 515,
        originalPriceUSD: 575,
        stock: 3,
        sku: 'ZM-SAM-S23FE-MNT-256',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      screen: '6.4" Dynamic AMOLED 2X, 120Hz, HDR10+, 1450 nits',
      processor: 'Snapdragon 8 Gen 1 / Exynos 2200',
      ram: '8GB',
      rearCamera: '50MP OIS Main + 8MP 3x Telephoto + 12MP Ultra-Wide',
      selfieCamera: '10MP Front Camera',
      battery: '4,500 mAh',
      charging: '25W Fast Charge, Fast Wireless Charge',
      os: 'One UI 6.1 on Android 14',
      network: '5G Dual SIM',
      sim: 'Dual Nano-SIM',
      waterResistance: 'IP68',
      warranty: '12 Months Official Samsung Warranty'
    },
    boxContents: [
      'Samsung Galaxy S23 FE Sealed Box',
      'USB-C Data Cable',
      'Ejection Pin & Warranty Booklet'
    ]
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Tinashe Mugwagwa',
    city: 'Borrowdale, Harare',
    rating: 5,
    date: '3 days ago',
    title: 'Arrived in 2 hours flat in Harare! Paid with EcoCash',
    comment: 'I was skeptical at first about ordering an iPhone 16 Pro Max online in Zim, but the EcoCash USSD prompt came straight to my phone. 2 hours later, rider Tendai arrived at my office in Borrowdale with the sealed box and the 12-month stamped warranty card. Top tier service!',
    verifiedPurchase: true,
    phoneBought: 'Apple iPhone 16 Pro Max 256GB'
  },
  {
    id: 'rev-2',
    author: 'Chipo R.',
    city: 'Avondale West, Harare',
    rating: 5,
    date: '1 week ago',
    title: 'Trade-in value was surprisingly generous',
    comment: 'Used their trade-in estimator on WhatsApp to swap my old iPhone 12 for the S24 Ultra. The valuation was higher than any phone booth in Roadport or Eastgate. Walked into their Avondale branch to finalize. Outstanding team.',
    verifiedPurchase: true,
    phoneBought: 'Samsung Galaxy S24 Ultra 5G'
  },
  {
    id: 'rev-3',
    author: 'Farai Moyo',
    city: 'Suburbs, Bulawayo',
    rating: 5,
    date: '2 weeks ago',
    title: 'Next-day courier to Bulawayo arrived safely',
    comment: 'Living in Bulawayo makes buying high-end tech tricky, but ZimMobile shipped via Swift overnight. Packaging had tamper-evident security tape. The Redmi Note 13 Pro+ is blistering fast and the 120W charger is included in the box!',
    verifiedPurchase: true,
    phoneBought: 'Redmi Note 13 Pro+ 5G'
  },
  {
    id: 'rev-4',
    author: 'Nyasha Dube',
    city: 'Chitungwiza (Unit L)',
    rating: 5,
    date: '3 weeks ago',
    title: 'Tecno Spark 20 Pro+ is the real budget king',
    comment: 'Paid with Cash on Delivery when the driver arrived at Unit L. Tested everything before handing over the cash. Curved screen feels like a phone that costs $700. Very honest and polite rider.',
    verifiedPurchase: true,
    phoneBought: 'Tecno Spark 20 Pro+ 256GB'
  }
];

export const SOCIAL_PROOF_EVENTS = [
  { name: 'Tendai M.', city: 'Borrowdale, Harare', product: 'Apple iPhone 16 Pro Max', timeAgo: '2m ago' },
  { name: 'Kudzai C.', city: 'Avondale, Harare', product: 'Samsung Galaxy S24 Ultra', timeAgo: '6m ago' },
  { name: 'Sipho N.', city: 'Ascot, Bulawayo', product: 'Redmi Note 13 Pro+ 5G', timeAgo: '14m ago' },
  { name: 'Tafadzwa K.', city: 'Chitungwiza', product: 'Tecno Spark 20 Pro+', timeAgo: '22m ago' },
  { name: 'Ruvimbo Z.', city: 'Mutare Central', product: 'Apple iPhone 13 128GB', timeAgo: '35m ago' }
];

export const PROMO_CODES: Record<string, { discountPercent?: number; discountUSD?: number; minOrderUSD: number; description: string }> = {
  'HARAREFREE': { discountUSD: 5, minOrderUSD: 50, description: 'Free Same-Day Harare Delivery ($5 off)' },
  'ECOCASH5': { discountPercent: 5, minOrderUSD: 100, description: '5% EcoCash Instant Payment Rebate' },
  'ZIMVIP': { discountUSD: 25, minOrderUSD: 500, description: '$25 USD VIP Tech Voucher' }
};

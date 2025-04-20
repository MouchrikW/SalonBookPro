export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountedPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  brand: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  shippingAddress: string;
  paymentMethod: string;
}

// Sample products data
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Moroccan Argan Oil Hair Serum",
    description: "Premium Moroccan Argan Oil Hair Serum that deeply nourishes and repairs damaged hair. Our enriched formula combines pure argan oil with vitamin E and essential nutrients to restore shine, reduce frizz, and protect against heat damage. Regular use strengthens hair follicles and prevents split ends. Suitable for all hair types, this lightweight serum won't weigh hair down and can be used daily on wet or dry hair.",
    shortDescription: "Pure argan oil serum for silky, shiny hair",
    price: 250,
    discountedPrice: 199,
    category: "Hair",
    imageUrl: "https://images.unsplash.com/photo-1597854985042-2ced0580ffd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 124,
    stock: 45,
    featured: true,
    brand: "MoroccanGlow"
  },
  {
    id: 2,
    name: "Rose Water Facial Toner",
    description: "Refreshing rose water toner made from handpicked Moroccan Damask roses. This alcohol-free formula balances skin pH, minimizes pores, and hydrates while removing impurities. Contains natural rose extract, witch hazel, and aloe vera that soothe and revitalize skin. Regular use reduces redness, controls excess oil, and prepares skin for better moisturizer absorption. Safe for sensitive skin and can be used morning and night.",
    shortDescription: "Natural toner with pure Damask rose extracts",
    price: 180,
    category: "Skin",
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 86,
    stock: 32,
    featured: true,
    brand: "RoseBotanicals"
  },
  {
    id: 3,
    name: "Professional Salon Hair Dryer",
    description: "High-performance professional hair dryer with ionic technology for faster drying and reduced frizz. Features 3 heat settings, 2 speed settings, and a cool shot button for style setting. The powerful AC motor provides up to 1800W of power while remaining quiet and lightweight. Includes concentrator and diffuser attachments for versatile styling options. Ergonomic design with 3m salon-length cord for easy maneuverability.",
    shortDescription: "Ionic technology dryer for quick, frizz-free results",
    price: 850,
    discountedPrice: 699,
    category: "Tools",
    imageUrl: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 215,
    stock: 18,
    featured: false,
    brand: "SalonPro"
  },
  {
    id: 4,
    name: "Matte Lipstick Collection",
    description: "Set of 5 highly pigmented matte lipsticks in versatile shades from nude to bold. Long-lasting, non-drying formula enriched with vitamin E and jojoba oil for comfortable wear throughout the day. The smooth application delivers rich color in a single stroke without feathering or bleeding. This paraben-free, cruelty-free collection comes in elegant gold packaging and includes exclusive Moroccan-inspired shades perfect for all skin tones.",
    shortDescription: "Set of 5 long-lasting matte lipsticks",
    price: 350,
    category: "Makeup",
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviewCount: 132,
    stock: 24,
    featured: true,
    brand: "ColorFusion"
  },
  {
    id: 5,
    name: "Rhassoul Clay Face Mask",
    description: "Traditional Moroccan Rhassoul clay mask that deeply cleanses and detoxifies skin. This mineral-rich treatment gently exfoliates to remove dead skin cells, excess oil, and impurities. Enhanced with essential oils and plant extracts that nourish and tighten skin for improved elasticity. Regular use reduces blackheads, minimizes pores, and evens skin tone. Perfect for weekly use as part of your skincare routine.",
    shortDescription: "Deep cleansing Moroccan clay treatment",
    price: 220,
    category: "Skin",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 98,
    stock: 30,
    featured: false,
    brand: "AtlasSkincare"
  },
  {
    id: 6,
    name: "Professional Ceramic Hair Straightener",
    description: "Salon-quality ceramic hair straightener with adjustable temperature settings from 140°C to 230°C. The floating plates with infrared technology ensure even heat distribution for smoother, faster styling with less damage. Features include dual voltage for worldwide use, 30-second heat-up time, and automatic shut-off after 60 minutes. The ergonomic design with 360° swivel cord allows for comfortable styling, while the included heat-resistant mat ensures safe storage.",
    shortDescription: "Ceramic straightener for smooth, frizz-free styling",
    price: 750,
    discountedPrice: 599,
    category: "Tools",
    imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 156,
    stock: 22,
    featured: true,
    brand: "SalonPro"
  },
  {
    id: 7,
    name: "Volumizing Mascara",
    description: "Intense volumizing mascara that builds dramatic lashes without clumping. The unique brush separates and coats each lash from root to tip for maximum volume and length. The smudge-proof, water-resistant formula stays fresh all day without flaking or smearing. Enriched with bamboo extract and peptides that strengthen and condition lashes over time. Ophthalmologist tested and suitable for sensitive eyes and contact lens wearers.",
    shortDescription: "Buildable mascara for dramatic volume",
    price: 190,
    category: "Makeup",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    reviewCount: 112,
    stock: 40,
    featured: false,
    brand: "ColorFusion"
  },
  {
    id: 8,
    name: "Natural Bristle Hairbrush Set",
    description: "Professional set of 3 natural boar bristle hairbrushes in different sizes for all styling needs. The natural bristles distribute hair's natural oils from root to tip for healthier, shinier hair. The ergonomic wooden handles provide comfortable grip and control during styling. Regular use reduces frizz, improves blood circulation to the scalp, and prevents breakage. Suitable for all hair types, especially effective for thick or curly hair.",
    shortDescription: "Set of 3 professional boar bristle brushes",
    price: 420,
    category: "Tools",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 74,
    stock: 15,
    featured: false,
    brand: "SalonEssentials"
  }
];
import type { Image, PortableTextBlock } from 'sanity';

// ===== ANTERBAE TYPES =====

export interface Courier {
  _id: string;
  name: string;
  phone: string;
  pin?: string;
  area?: string;
  vehicleType: 'motor' | 'mobil';
  vehiclePlate?: string;
  photo?: Image;
  isActive: boolean;
  statusMessage?: string;
  status: 'active' | 'inactive';
}

export interface Merchant {
  _id: string;
  name: string;
  slug: string;
  category: 'food' | 'grocery' | 'health' | 'other';
  logo?: Image;
  coverImage?: Image;
  phone?: string;
  address?: string;
  area?: string;
  description?: string;
  isOpen: boolean;
  closingMessage?: string;
  openHours?: string;
  minOrder?: number;
  isVerified: boolean;
}

export type OrderType = 'food' | 'parcel' | 'jastip';
export type OrderStatus = 'pending' | 'accepted' | 'picking_up' | 'picked_up' | 'delivering' | 'delivered' | 'completed' | 'cancelled' | 'problem';
export type PaymentMethod = 'cod' | 'transfer';

export interface DeliveryOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  merchant?: { name: string; logo?: Image; phone?: string };
  merchantName?: string;
  items: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryArea?: string;
  customerNotes?: string;
  totalAmount?: number;
  shippingFee?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  courier?: { name: string; phone: string; vehicleType?: string };
  courierNotes?: string;
  estimatedTime?: string;
  _createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  imageDesktop: Image;
  imageMobile: Image;
  link?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category: 'promo' | 'pengumuman' | 'panduan' | 'area';
  image: Image;
  excerpt?: string;
  content: PortableTextBlock[];
}

export interface AppSettings {
  adminPhone?: string;
  baseDeliveryFee?: number;
  feePerKm?: number;
  operationalHours?: string;
  serviceArea?: string;
  siteName?: string;
  isMaintenance?: boolean;
  maintenanceMessage?: string;
  instagramHandle?: string;
  waGroupLink?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: Image;
  productCount?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: Image;
  description?: string;
  merchant: Merchant;
  categories?: Category[];
  isBestSeller?: boolean;
  isPromo?: boolean;
  promoDiscount?: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
}

import { defineQuery } from 'next-sanity'

// ===== APP SETTINGS =====
export const APP_SETTINGS_QUERY = defineQuery(`
  *[_type == "appSettings"][0] {
    adminPhone,
    baseDeliveryFee,
    feePerKm,
    operationalHours,
    serviceArea,
    siteName,
    isMaintenance,
    maintenanceMessage,
    instagramHandle,
    waGroupLink
  }
`)

// ===== COURIERS =====
export const ACTIVE_COURIERS_QUERY = defineQuery(`
  *[_type == "courier" && status == "active" && isActive == true] | order(name asc) {
    _id,
    name,
    phone,
    area,
    vehicleType,
    photo,
    isActive,
    statusMessage
  }
`)

export const COURIER_BY_PHONE_QUERY = defineQuery(`
  *[_type == "courier" && phone == $phone][0] {
    _id,
    name,
    phone,
    pin,
    area,
    vehicleType,
    vehiclePlate,
    isActive,
    statusMessage,
    status
  }
`)

// ===== MERCHANTS =====
export const MERCHANTS_QUERY = defineQuery(`
  *[_type == "merchant" && isVerified == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    coverImage,
    category,
    area,
    address,
    description,
    isOpen,
    closingMessage,
    openHours,
    minOrder
  }
`)

export const FOOD_MERCHANTS_QUERY = defineQuery(`
  *[_type == "merchant" && isVerified == true && category == "food"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    logo,
    coverImage,
    area,
    address,
    isOpen,
    closingMessage,
    openHours
  }
`)

export const MERCHANT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "merchant" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    logo,
    coverImage,
    category,
    phone,
    area,
    address,
    description,
    isOpen,
    closingMessage,
    openHours,
    minOrder
  }
`)

// ===== PRODUCTS & CATEGORIES =====
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    image,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image
  }
`)

export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    isBestSeller,
    isPromo,
    promoDiscount,
    "merchant": merchant->{
      _id,
      name,
      "slug": slug.current,
      isOpen,
      closingMessage
    }
  }
`)

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    description,
    isBestSeller,
    isPromo,
    promoDiscount,
    "merchant": merchant->{
      _id,
      name,
      "slug": slug.current,
      isOpen,
      closingMessage,
      phone
    },
    "categories": categories[]->{
      _id,
      name,
      "slug": slug.current
    }
  }
`)

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "product" && references($categoryId)] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    isBestSeller,
    isPromo,
    promoDiscount,
    "merchant": merchant->{
      _id,
      name,
      "slug": slug.current,
      isOpen,
      closingMessage
    }
  }
`)

export const PRODUCTS_BY_MERCHANT_QUERY = defineQuery(`
  *[_type == "product" && merchant._ref == $merchantId] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    isBestSeller,
    isPromo,
    promoDiscount
  }
`)

export const PROMO_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && isPromo == true] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    isPromo,
    promoDiscount,
    "merchant": merchant->{
      _id,
      name,
      "slug": slug.current,
      isOpen,
      closingMessage
    }
  }
`)

export const BEST_SELLER_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && isBestSeller == true] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    stock,
    image,
    isBestSeller,
    "merchant": merchant->{
      _id,
      name,
      "slug": slug.current,
      isOpen,
      closingMessage
    }
  }
`)

// ===== DELIVERY ORDERS =====
export const ORDER_BY_NUMBER_QUERY = defineQuery(`
  *[_type == "deliveryOrder" && orderNumber == $orderNumber][0] {
    _id,
    orderNumber,
    customerName,
    customerPhone,
    orderType,
    items,
    pickupAddress,
    deliveryAddress,
    deliveryArea,
    status,
    totalAmount,
    shippingFee,
    paymentMethod,
    estimatedTime,
    _createdAt,
    "merchant": merchant->{
      name,
      logo,
      phone
    },
    "courier": courier->{
      name,
      phone,
      vehicleType
    }
  }
`)

export const ORDERS_BY_COURIER_QUERY = defineQuery(`
  *[_type == "deliveryOrder" && courier._ref == $courierId && status != "completed" && status != "cancelled"] | order(_createdAt desc) {
    _id,
    orderNumber,
    customerName,
    customerPhone,
    orderType,
    items,
    pickupAddress,
    deliveryAddress,
    deliveryArea,
    status,
    totalAmount,
    shippingFee,
    paymentMethod,
    courierNotes,
    estimatedTime,
    _createdAt
  }
`)

// ===== ARTICLES / PROMOS =====
export const LATEST_ARTICLES_QUERY = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    image,
    excerpt
  }
`)

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    image,
    excerpt
  }
`)

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    image,
    excerpt,
    content
  }
`)

// ===== BANNERS =====
export const BANNERS_QUERY = defineQuery(`
  *[_type == "banner" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    imageDesktop,
    imageMobile,
    link
  }
`)

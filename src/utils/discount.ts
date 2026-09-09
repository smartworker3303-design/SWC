import { Product } from "../data";

export function getActiveDiscount(product: Product): { 
  hasDiscount: boolean; 
  discountText?: string; 
  originalPrice?: number; 
  price: number;
  isTimerActive: boolean;
  expiresAt?: string;
} {
  const now = Date.now();
  
  if (product.discountExpiresAt) {
    const expiryTime = new Date(product.discountExpiresAt).getTime();
    if (expiryTime <= now) {
      // Timer expired! Discount is no longer valid.
      // We fall back to the regular price, hiding the original price and discount badge.
      return {
        hasDiscount: false,
        price: product.price,
        isTimerActive: false
      };
    } else {
      // Timer is active and valid.
      const hasConfiguredDiscount = !!product.discount || (!!product.originalPrice && product.originalPrice > product.price);
      return {
        hasDiscount: hasConfiguredDiscount,
        discountText: product.discount,
        originalPrice: product.originalPrice,
        price: product.price,
        isTimerActive: hasConfiguredDiscount,
        expiresAt: product.discountExpiresAt
      };
    }
  }

  // No timer set. Check if it has a static discount.
  const hasConfiguredDiscount = !!product.discount || (!!product.originalPrice && product.originalPrice > product.price);
  
  return {
    hasDiscount: hasConfiguredDiscount,
    discountText: product.discount,
    originalPrice: product.originalPrice,
    price: product.price,
    isTimerActive: false
  };
}

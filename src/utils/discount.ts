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
      // We fall back to the regular price (which was the original price), hiding the strike-through and discount badge.
      return {
        hasDiscount: false,
        price: product.originalPrice && product.originalPrice > product.price ? product.originalPrice : product.price,
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
        isTimerActive: true, // Always show timer if it's set and not expired
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

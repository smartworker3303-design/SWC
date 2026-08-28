import { createClient } from "@supabase/supabase-js";
import { Product } from "./data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to fetch products from Supabase
export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");
      
    if (error) throw error;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((p: any) => {
      const rawSpecs = typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs;
      const cleanSpecs = { ...rawSpecs };
      const subcat = cleanSpecs.__subcategory;
      const brand = cleanSpecs.__brand;
      const galleryImages = cleanSpecs.__images || p.images || (p.image ? [p.image] : []);
      const origPrice = p.original_price ?? p.originalPrice ?? (cleanSpecs.__original_price ? Number(cleanSpecs.__original_price) : undefined);
      const discountText = p.discount ?? cleanSpecs.__discount ?? undefined;

      delete cleanSpecs.__subcategory;
      delete cleanSpecs.__brand;
      delete cleanSpecs.__images;
      delete cleanSpecs.__original_price;
      delete cleanSpecs.__discount;
      
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: subcat || undefined,
        brand: brand || undefined,
        price: Number(p.price),
        originalPrice: origPrice && Number(origPrice) > 0 ? Number(origPrice) : undefined,
        discount: discountText || undefined,
        rating: Number(p.rating),
        reviews: Number(p.reviews),
        image: p.image,
        images: Array.isArray(galleryImages) && galleryImages.length > 0 ? galleryImages : (p.image ? [p.image] : []),
        description: p.description,
        specs: cleanSpecs,
        featured: p.featured,
        tag: p.tag || undefined
      };
    });
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return null;
  }
}

// Helpers for CRUD in Supabase
export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      specs: { 
        ...product.specs, 
        __brand: product.brand, 
        __subcategory: product.subcategory,
        __images: product.images && product.images.length > 0 ? product.images : [product.image],
        __original_price: product.originalPrice ? product.originalPrice : undefined,
        __discount: product.discount ? product.discount : undefined
      },
      featured: product.featured,
      tag: product.tag || null
    };

    const { error } = await supabase
      .from("products")
      .upsert(payload);
      
    if (error) {
      console.error("Supabase upsert error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error upserting to Supabase:", err);
    return false;
  }
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase delete error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error deleting from Supabase:", err);
    return false;
  }
}

// --- Orders & Users Management ---

export interface Profile {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  created_at: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  shipping_address: string;
  phone: string;
  created_at: string;
}

export async function fetchSupabaseProfiles(): Promise<Profile[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("Could not fetch profiles. User may need to run SUPABASE_SETUP SQL.");
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchSupabaseOrders(): Promise<Order[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("Could not fetch orders. User may need to run SUPABASE_SETUP SQL.");
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function insertSupabaseProfile(profile: Profile): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('profiles').upsert(profile);
    if (error) {
      console.warn("Could not insert profile into Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Unexpected error inserting profile into Supabase:", err);
    return false;
  }
}

export async function insertSupabaseOrder(order: Order): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('orders').insert(order);
    if (error) {
      console.warn("Could not insert order into Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Unexpected error inserting order into Supabase:", err);
    return false;
  }
}

export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating order status:", err);
    return false;
  }
}

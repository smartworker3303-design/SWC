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
    
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      rating: Number(p.rating),
      reviews: Number(p.reviews),
      image: p.image,
      description: p.description,
      specs: typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs,
      featured: p.featured,
      tag: p.tag || undefined
    }));
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return null;
  }
}

// Helpers for CRUD in Supabase
export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("products")
      .upsert({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        description: product.description,
        specs: product.specs,
        featured: product.featured,
        tag: product.tag || null
      });
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting to Supabase:", err);
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
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting from Supabase:", err);
    return false;
  }
}

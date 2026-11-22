import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Product } from "../products";

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  subcategory: string | null;
  short_description: string | null;
  description: string | null;
  material: string | null;
  features: string[] | null;
  regular_price: number;
  sale_price: number | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  categories: { slug: string; name: string } | null;
  product_variants: {
    id: string;
    size: string | null;
    color: string | null;
    is_active: boolean;
  }[];
  product_images: {
    storage_path: string;
    public_url: string;
    alt_text: string | null;
    sort_order: number;
  }[];
};

export async function fetchStorefrontCatalog(): Promise<Product[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,name,slug,sku,subcategory,short_description,description,material,features,
      regular_price,sale_price,is_featured,is_new_arrival,is_best_seller,
      categories(slug,name),
      product_variants(id,size,color,is_active),
      product_images(storage_path,public_url,alt_text,sort_order)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data?.length) return [];

  return (data as unknown as DbProduct[]).map((item, index) => {
    const categorySlug = item.categories?.slug || "men";
    const category =
      categorySlug === "women" || categorySlug === "overcoats"
        ? (categorySlug === "overcoats" ? "overcoat" : "women")
        : "men";
    const images = [...item.product_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        src: image.public_url,
        alt: image.alt_text || item.name,
      }));
    const variants = item.product_variants.filter((variant) => variant.is_active);
    const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))] as string[];
    const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))] as string[];
    const variantOptions = variants
      .filter((variant) => variant.size && variant.color)
      .map((variant) => ({
        id: variant.id,
        size: variant.size as string,
        color: variant.color as string,
      }));
    const price = (item.sale_price ?? item.regular_price) / 100;

    return {
      id: 100000 + index,
      supabaseId: item.id,
      variantOptions,
      sku: item.sku || "",
      name: item.name,
      slug: item.slug,
      category,
      subcategory: item.subcategory || item.categories?.name || "",
      gender: category === "overcoat" ? "unisex" : category,
      price,
      compareAtPrice: item.sale_price ? item.regular_price / 100 : undefined,
      shortDescription: item.short_description || "",
      description: item.description || "",
      fabric: item.material || "",
      material: item.material || "",
      materialType: item.material || "",
      fit: "Standard fit",
      care: "Follow the garment care label.",
      styleTips: "",
      features: item.features || [],
      stockStatus: "in-stock",
      images: images.length ? images : [{ src: "/assets/images/placeholder.jpg", alt: item.name }],
      sizes,
      colors,
      isNewArrival: item.is_new_arrival,
      isFeatured: item.is_featured,
      isBestSeller: item.is_best_seller,
      image: images[0]?.src || "/assets/images/placeholder.jpg",
      color: colors[0] || "",
      audience: category === "overcoat" ? "unisex" : category,
      isNew: item.is_new_arrival,
      isPremium: item.is_featured,
      badge: item.is_new_arrival ? "NEW IN" : item.is_best_seller ? "BEST SELLER" : undefined,
    };
  });
}

export type CodOrderInput = {
  idempotencyKey: string;
  customer: { email: string; phone: string; full_name: string };
  address: {
    full_name: string;
    phone: string;
    line1: string;
    city: string;
    region?: string;
    postal_code?: string;
    country: string;
  };
  items: { product_id: string; variant_id: string; quantity: number }[];
  shippingCharges?: number;
};

export async function createCodOrder(input: CodOrderInput) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.rpc("create_cod_order", {
    p_idempotency_key: input.idempotencyKey,
    p_customer: input.customer,
    p_address: input.address,
    p_items: input.items,
    p_shipping_charges: input.shippingCharges ?? 0,
  });

  if (error) throw error;
  return data as {
    reference: string;
    order_id: string;
    subtotal: number;
    shipping_charges: number;
    total: number;
    duplicate: boolean;
  };
}

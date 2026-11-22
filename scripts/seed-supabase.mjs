import { createClient } from "@supabase/supabase-js";
import { products } from "../src/products.ts";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the catalog seed.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const categorySeed = [
  { name: "Men", slug: "men", description: "Men's jackets and outerwear", sort_order: 1, is_visible: true },
  { name: "Women", slug: "women", description: "Women's jackets and outerwear", sort_order: 2, is_visible: true },
  { name: "Overcoats", slug: "overcoats", description: "Coats and longer layers", sort_order: 3, is_visible: true },
];

const { data: categories, error: categoryError } = await supabase
  .from("categories")
  .upsert(categorySeed, { onConflict: "slug" })
  .select("id,slug");
if (categoryError) throw categoryError;

const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category.id]));

for (const product of products) {
  const categoryId = categoryBySlug[product.category === "overcoat" ? "overcoats" : product.category];
  const regularPrice = Math.round(product.price * 100);
  const salePrice = product.compareAtPrice
    ? Math.round(product.price * 100)
    : null;

  const { data: saved, error: productError } = await supabase
    .from("products")
    .upsert({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category_id: categoryId,
      subcategory: product.subcategory,
      short_description: product.shortDescription,
      description: product.description,
      material: product.material,
      features: product.features,
      regular_price: Math.round((product.compareAtPrice || product.price) * 100),
      sale_price: salePrice,
      status: "published",
      is_featured: product.isFeatured,
      is_new_arrival: product.isNewArrival,
      is_best_seller: product.isBestSeller,
    }, { onConflict: "slug" })
    .select("id")
    .single();
  if (productError) throw productError;

  for (const color of product.colors) {
    for (const size of product.sizes) {
      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .upsert({
          product_id: saved.id,
          sku: `${product.sku}-${size}-${color}`.replace(/\s+/g, "-").toUpperCase(),
          size,
          color,
          regular_price: Math.round((product.compareAtPrice || product.price) * 100),
          sale_price: salePrice,
          is_active: true,
        }, { onConflict: "product_id,size,color" })
        .select("id")
        .single();
      if (variantError) throw variantError;

      await supabase
        .from("product_inventory")
        .upsert({ variant_id: variant.id, quantity: 20 }, { onConflict: "variant_id" });
    }
  }

  await supabase.from("product_images").delete().eq("product_id", saved.id);
  for (const [index, image] of product.images.entries()) {
    await supabase.from("product_images").insert({
      product_id: saved.id,
      storage_path: image.src,
      public_url: image.src,
      alt_text: image.alt,
      sort_order: index,
      is_primary: index === 0,
    });
  }

  console.log(`Seeded ${product.name}`);
}

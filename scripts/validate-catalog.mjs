import { existsSync } from "node:fs";
import { products, categoryCounts } from "../src/products.ts";

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const unique = (values) => new Set(values).size === values.length;

assert(categoryCounts.men === 12, `Expected 12 men's products, received ${categoryCounts.men}`);
assert(categoryCounts.women === 12, `Expected 12 women's products, received ${categoryCounts.women}`);
assert(categoryCounts.overcoat === 8, `Expected 8 overcoats, received ${categoryCounts.overcoat}`);
assert(unique(products.map((product) => product.id)), "Product IDs must be unique");
assert(unique(products.map((product) => product.slug)), "Product slugs must be unique");
assert(products.filter((product) => product.isNewArrival).length === 8, "Expected 8 new arrivals");
assert(products.filter((product) => product.category === "men" && product.gender === "men").length === 12, "Men's collection contains a non-men product or is missing products");
assert(products.filter((product) => product.category === "women" && product.gender === "women").length === 12, "Women's collection contains a non-women product or is missing products");
assert(products.filter((product) => product.category === "overcoat").every((product) => product.subcategory !== "Everyday Jacket"), "Coats and layers must have a specific product type");

for (const product of products) {
  assert(product.price >= 50 && product.price <= 100, `${product.name}: price is outside the $50–$100 range`);
  assert(product.images.length >= 1 && product.images.length <= 4, `${product.name}: expected one to four genuine gallery images`);
  assert(unique(product.images.map((image) => image.src)), `${product.name}: duplicate gallery image paths`);
  assert(product.sizes.length > 0 && product.colors.length > 0, `${product.name}: missing a size or color`);
  assert(Boolean(product.sku && product.shortDescription && product.description && product.material && product.care), `${product.name}: missing required product data`);
  for (const image of product.images) {
    const localPath = `public${image.src}`;
    assert(image.src.startsWith("/assets/images/"), `${product.name}: image must use a local product asset`);
    assert(existsSync(localPath), `${product.name}: missing image ${image.src}`);
  }
}

if (failures.length) {
  console.error(`Catalog validation failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Catalog validation passed for ${products.length} products (12 men, 12 women, 8 overcoats, 8 new arrivals).`);
}

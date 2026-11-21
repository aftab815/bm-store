# Storefront implementation notes

## Local-only features

- Product catalog and collection filters are client-side data in `src/products.ts`.
- Cart, wishlist, and newsletter interest are stored in the current browser's local storage.
- Cash on Delivery checkout records a reference and order snapshot in local storage (`bms-demo-orders` and `bms-last-order`). It does not call a server, notify staff, send an email, reserve inventory, or create a fulfilment order.
- Contact enquiries are also held in local storage; the current site has no connected client-service inbox or authentication provider. Account navigation points to browser-saved wishlist, bag, and local order lookup instead of collecting passwords.
- Customer and order information stays in that browser until the shopper clears site storage. Do not use real customer data in this preview.

## Catalog image limitation

The local project has category/editorial photos rather than supplier-approved images for every SKU. Product gallery slots use the same category-matched photo for a given product rather than showing a different garment as an alternate view. Supply three approved views per product and per color before representing the gallery as a verified product-variant gallery.

## Launch

Run `npm run dev` from the project root, or use the Figma Make preview server described in `AGENTS.md`. The production bundle is generated with `npm run build`.

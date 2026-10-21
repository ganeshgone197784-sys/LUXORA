# LUXORA — Phase 8 (Next.js + TypeScript)

Same approved design as the single-file demo, now split into components.
Still demo-only: no backend, no real payments (that comes in Phase 9+).

## Replit par chalane ke steps
1. Replit mein new Repl banao (template: Node.js), phir is zip ki files upload/extract karo.
2. Shell mein: `npm install`
3. Phir: `npm run dev` (ya Run button). Webview mein site khulegi.

## GitHub Pages par hosting
1. Saari files (hidden `.github` folder ke saath) GitHub repo ke `main` branch par daalo.
2. Repo > Settings > Pages > Source = **GitHub Actions**.
3. Actions tab mein "Deploy LUXORA" chalega; 2-3 min baad link milega: `https://USERNAME.github.io/REPO-NAME/`

## Structure
- `app/` — layout, page, globals.css (approved design CSS)
- `components/` — Navbar, BrandIntro, Hero, Collections, ProductGrid, ProductCard, ProductModal, ShoppingCart, Wishlist, Drawers, Newsletter, Footer, Toast, StoreProvider (cart/wishlist state)
- `lib/products.ts` — sample products (demo data)
- `types/product.ts` — TypeScript types
- `public/` — logo, intro video, hero and collection images

Note: Tailwind abhi add nahi kiya, taaki approved design bilkul same rahe.

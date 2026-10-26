# Rawshad — Official Online Store (v2)

Static e-commerce store for **Rawshad** (RAW-স্বাদ), a Bangladeshi brand selling dry fruit powders & healthy snacks. Tagline: **Pure. Natural. Delicious.**

Plain HTML/CSS/JS — no build step, no frameworks. Deployed on GitHub Pages from the repo `nodexStation/rawshadshop`.

## Files
| File | What it is |
|---|---|
| `config.js` | ALL shop settings + the product catalogue — the only file the owner edits day to day |
| `index.html` | Store shell: homepage sections, view containers, cart drawer |
| `styles.css` | Brand design system (tokens in BRAND_IDENTITY.md) |
| `script.js` | Store engine: catalogue, cart, checkout, orders, local owner view |
| `assets/` | Real product photos (beetroot.jpg, herbal.jpg, snacks.jpg) |
| `favicon.svg` | Maroon + gold brand monogram |
| Owner's guide (private copy, NOT published on the site) | Owner's beginner guide: prices, stock, WhatsApp, payments, orders — kept out of the public repo for security; ask TNT for the current copy |
| `BRAND_IDENTITY.md` | Palette, logo lockup, photo and voice rules |

## How the store works
- Shoppers browse the catalogue, filter/search/sort, open product pages, add priced products to a cart, and check out as guests.
- Checkout validates name, Bangladeshi mobile number and address, then prepares an order with a unique reference (e.g. RAW-20261023-AB3K). The customer sends that order to the shop in one tap by email or Instagram DM. **No online payment is taken by this static site**, and the wording says so.
- Orders placed in a browser are also saved in that browser (localStorage) and can be viewed/exported by the owner at `#/admin` on the same device.

## Updating products
Edit `config.js` only — prices, variants, stock flags (`inStock`), photos, categories. Full instructions are in the owner's private guide (not published on the public site).

## Publishing
1. Upload/commit all files (including `assets/`) to the GitHub repo root, `main` branch.
2. Repo **Settings → Pages → Deploy from a branch → main / (root)**.
3. GitHub Pages redeploys automatically on every push.

## Honesty rules baked into this site
- Only confirmed prices are displayed (Beetroot Powder sizes). Other products show "Price on request" and route to Instagram.
- No invented delivery fees, discounts, reviews, certifications or phone numbers. WhatsApp ordering appears only when a real number is set in `config.js`.
- Cash on delivery / bKash / Nagad show as "Not yet available" until the owner enables them — and enabling a flag only changes the label; real online payment needs a backend (see the owner's private guide).

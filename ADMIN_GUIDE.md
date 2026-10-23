# Rawshad Store — Owner's Admin Guide

Everything day-to-day lives in one file: **`config.js`**. Open it in any text editor (or on GitHub with the pencil icon), change the words/numbers, save, and re-upload. The top of that file repeats these instructions.

## 1. Change a price
Find the product in `RAWSHAD_PRODUCTS` and change the `price` numbers inside its `variants`. Example: Beetroot Powder's 100gm variant holds its real price — change the number only, keep the commas and brackets.

## 2. Give a "Price on request" product a real price
Add variants to it, for example a variants list with a label and a price, and set `orderable: true`. The site will immediately show Add to Cart for it. Until then it honestly shows "Price on request".

## 3. Stock — how it works today
- Each product has `inStock: true` and each variant has its own `inStock: true`.
- Set a variant's `inStock: false` when that size runs out: the site shows it out of stock and disables buying it. Set the product's `inStock: false` to mark the whole product "Out of stock".
- `orderable: false` is different — it means "not sold online yet" (used for price-on-request products).

## 4. Set your WhatsApp number
In `RAWSHAD_CONFIG`, set `whatsapp` to your number with country code, digits only. The moment it is set, a "Send Order on WhatsApp" button appears on the order confirmation, with the full order (items, quantities, total, reference) pre-written. Leave it empty if you do not want the button.

## 5. Set a delivery fee
Set `deliveryFee` to a number to charge that flat fee in checkout and include it in totals. Leave it `null` and the site honestly says the delivery fee is confirmed with the order.

## 6. Payment options (COD / bKash / Nagad)
In `RAWSHAD_CONFIG → payments`, setting `cod`, `bkash` or `nagad` to `true` makes that option selectable in checkout. **Warning:** these flags only change what the checkout shows and records on the order. They do NOT process a real online payment — no money moves through this website. Real online payment (a payment gateway, automatic confirmation) needs a backend, below.

## 7. Replace or add product photos
Put the photo in the `assets/` folder (keep it under about 500 KB), then point the product's `img` in `config.js` at it. Update the `alt` text to describe the photo for accessibility and search.

## 8. View orders (on the device they were placed)
Open the site footer link **"Owner: view orders on this device"** (address ending `#/admin`). You can change each order's status (New / Confirmed / Delivered / Cancelled) and export a backup with **Export Orders (CSV)** or **Export (JSON)**. This only shows orders placed in that same browser — read the warning in section 10.

## 9. Weekly management routine
1. **Monday:** open `#/admin` on your shop device, export a CSV backup, file it.
2. Check new orders and messages (email + Instagram DMs), update statuses to Confirmed/Delivered.
3. Review stock: anything running low gets its `inStock` flags updated before it sells out.
4. Skim the shop on your phone like a customer: photos loading, prices right, Quick Add working.
5. Note any "Price on request" questions from customers — repeated requests mean it is time to publish that price in `config.js`.

## 10. What needs a backend (Supabase) later — honestly
This website is static files on GitHub Pages. By design it **cannot** securely:
- give you a private login-protected admin panel,
- store orders in one place visible from all your devices,
- take real online payments (bKash/Nagad gateways, automatic receipts),
- sync stock across devices or stop overselling automatically.

Today an order exists in the customer's browser and reaches you when they tap "Send Order by Email" or "Send Order on Instagram". That is honest and workable for a small shop. When order volume grows, add a backend — Supabase is a good fit (free tier, no server to manage), keeping secret keys on the server side only, never in this public code.

### Supabase-ready data sketch (matches this site exactly)
**products table** — mirrors `config.js`:
`id (text, primary key) · name · bn · category · img · alt · desc · benefits (jsonb array) · uses (jsonb array) · variants (jsonb array of {label, price, inStock}) · price (numeric, nullable) · orderable (bool) · available (bool) · inStock (bool) · badge · featured (bool)`

**orders table** — mirrors the saved order object:
`ref (text, primary key) · created_at (timestamptz) · status (text: New/Confirmed/Delivered/Cancelled) · items (jsonb array of {id, name, variant, price, qty}) · subtotal (numeric) · delivery_fee (numeric, nullable) · total (numeric) · payment (text) · payment_label (text) · customer_name · customer_phone · customer_address · customer_notes`

Moving to Supabase later means: the shop reads products from the table instead of `config.js`, checkout inserts a row into `orders`, and the owner view becomes a login-protected page reading the same table — the data shapes above already match, so nothing needs re-typing.

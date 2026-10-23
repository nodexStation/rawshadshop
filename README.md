# RAW-স্বাদ (RAW-SHAD) — Website

One-page static website for **RAW-SHAD** (@rawshadshop), a Bangladeshi brand selling
dry fruit powders & healthy snacks. Tagline: **Pure. Natural. Delicious.**

Plain HTML/CSS/JS — no build step, no frameworks, no 3D libraries. Just open
`index.html` or deploy the folder as-is.

## Files

| File | What it is |
|---|---|
| `index.html` | All page content and sections |
| `styles.css` | Warm cream / brown / amber / green styling, fully responsive |
| `script.js` | Mobile menu, FAQ accordion, order-form mailto builder, reveal-on-scroll |
| `favicon.svg` | Warm nut-and-leaf brand mark |

## Deploy to GitHub Pages

1. Create a repository (for example `rawshadshop.github.io` on the account that
   will host it) and push these files to the root of the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main` / `(root)` → Save.**
3. Wait for the deployment to finish; the site will be live at
   `https://<username>.github.io/` (or `https://<username>.github.io/<repo>/`
   for a project repo).
4. To update later: edit the files, commit, push — Pages redeploys automatically.

## How to edit prices & products

- **Prices** live in `index.html`, in the Products section (`#products`):
  the Beetroot Powder card (`.price`), the matching `<option>` entries in the
  order form's product dropdown, and the beetroot answer in the FAQ section.
  Search the file for the price text and update every occurrence together.
- **Products** are the three `.product-card` articles in the Products section.
  Copy one card to add a product; keep the "DM to order" button pointing to
  https://www.instagram.com/rawshadshop/
- **Contact email** appears in `index.html` (mailto links) and in `script.js`
  (the order form builds a mailto to the same address). Change both if the
  email ever changes.

## Confirmed facts vs DM-only (do not invent beyond this)

**Confirmed (from the owner's own posts/profile):**
- Brand: RAW-স্বাদ / RAW-SHAD — "Pure. Natural. Delicious."
- Sells dry fruit powders & healthy snacks; 100% natural, zero additives,
  zero added sugar, made with love.
- Premium Beetroot Powder — **100gm ৳369 / 50gm ৳179**; benefits as stated by
  the owner: 100% natural, rich in nutrients, boosts energy, supports heart health.
- Herbal Powder exists (premium quality) — **no confirmed price**.
- Dried Fruit Snacks exist (mango & berry; workout fuel, kids' lunchbox,
  mid-day treat) — **no confirmed price**.
- Contact: rawshadshop@gmail.com · Instagram https://www.instagram.com/rawshadshop/

**DM-only (never state specifics on the site):**
- Prices for Herbal Powder and Dried Fruit Snacks → shown as "DM for price".
- Delivery area, delivery charges, and payment methods → the site only says
  these are **confirmed in DM when you order**. There is no confirmed
  WhatsApp number, phone number, or cash-on-delivery claim — do not add any
  until the owner confirms them.

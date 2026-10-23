# Rawshad — Brand Identity

The identity system for Rawshad (RAW-স্বাদ). The website uses these exact tokens in `styles.css` — Instagram slides, packaging and any future design should reuse the same tokens so the brand looks like one business everywhere.

## Logo — OFFICIAL FILES ONLY (owner's rule, 2026-10-23: never redraw or recreate the logo)
- **Primary lockup:** `assets/logo.png` — Ahmed's real logo (maroon plaque, gold calligraphic mark + RAW-স্বাদ), supplied by the owner. Used in the site header, footer, and About "official mark" card, always shown as the complete image with rounded corners and a thin gold border. Never crop the artwork, never re-type the name as a substitute logo.
- **Round badge:** `assets/logo-badge.png` — the RAW স্বাদ cream-circle badge from the Instagram profile. Used as the website favicon / app icon and as the hero medallion.
- **Source resolution note:** the owner's supplied lockup file is small (99×49 native, upscaled ×6 with sharpening for the web copy). If the owner supplies a higher-resolution original, replace `assets/logo.png` with it (same filename) — no code change needed.
- **Rules:** keep clear space around the logo, never stretch, rotate, re-colour, or place it on a clashing background. On the cream header it sits as a maroon plaque; on the deep-maroon footer it keeps its gold border so the plaque edge stays visible.
- **Signature motif (decoration only, NOT the logo):** a small leaf sprig (the `#sprig` SVG) used as a section divider and a faint footer/CTA pattern — use it sparingly.

## Palette
| Token | Hex | Usage |
|---|---|---|
| `--brand-maroon` | #57181D | Primary anchor: headings, buttons, logo square |
| `--brand-maroon-deep` | #3E0E12 | Header-deep tones, footer, announcement bar |
| `--brand-gold` | #C6A15B | Premium accent: tagline, dividers, badges on dark |
| `--brand-cream` | #FAF4E8 | Page background |
| `--brand-beetroot` | #B3122F | SPARING product accent only: prices, featured markers, small underlines — never large backgrounds |
| `--brand-leaf` | #3A6E36 | Small "100% natural" badges and ticks only |
| Card | #FFFDF8 | Product/content cards |
| Ink | #2B1A12 | Body text |
| Muted | #7A675C | Secondary text |

## Typography
- Display: **Fraunces** (serif, warm and premium) — headlines, product names, prices' brand moments.
- Body: **Inter**, with **Hind Siliguri** for Bangla text (বাংলা subtitles render in it automatically).
- Tagline and eyebrows: uppercase, letter-spacing 0.22–0.28em.

## Photography rules
- Real Rawshad product photos only — never unrelated stock presented as Rawshad products.
- Consistent ratios: product cards and gallery 4:3, product detail about 1:1, hero 4:3. Radius 20px, warm soft shadow. A slight warm overlay appears on hover only.
- New photos go in `assets/` and are referenced from `config.js` / `index.html` — replacing a photo never needs a redesign.
- Keep packaging text readable in frame; shoot on warm, natural backgrounds that sit well on cream.

## Brand voice
- **3 words:** Pure. Honest. Warm.
- Caption formula (Instagram + website): English hook → one honest benefit line → price or "DM for price" → one clear call to action. Bangla warmth is welcome in the middle lines.
- Never: invented claims, fake reviews, pressure tactics, hashtag-only captions.

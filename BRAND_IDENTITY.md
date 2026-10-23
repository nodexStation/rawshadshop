# Rawshad — Brand Identity

The identity system for Rawshad (RAW-স্বাদ). The website uses these exact tokens in `styles.css` — Instagram slides, packaging and any future design should reuse the same tokens so the brand looks like one business everywhere.

## Logo lockup
- **Monogram:** maroon rounded square with a gold leaf/nut mark (`favicon.svg`, and the `#leafmark` symbol in `index.html`).
- **Wordmark:** "Rawshad" in Fraunces (display serif), maroon on cream, gold on deep maroon.
- **Tagline under the wordmark:** PURE. NATURAL. DELICIOUS. — letter-spaced capitals, gold.
- **Rules:** keep clear space around the lockup equal to the height of the monogram on all sides. Never stretch, rotate or re-colour the monogram. Minimum size: monogram 24px, full lockup 120px wide.
- **Signature motif:** a small leaf sprig (the `#sprig` SVG) used as a section divider and a faint footer/CTA pattern. It is the brand's recurring fingerprint — use it sparingly, never as a loud background.

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

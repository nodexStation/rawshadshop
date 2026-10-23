/*
 * ============================================================
 *  RAWSHAD — STORE SETTINGS  (config.js)
 * ============================================================
 *  OWNER: This is the ONLY file you need to edit to run the shop.
 *  Edit prices, stock, WhatsApp number, delivery fee here.
 *
 *  HOW TO EDIT SAFELY:
 *  - Change the words inside "quotes" and the numbers only.
 *  - Do NOT delete commas or brackets — they hold the shop together.
 *  - After editing, save the file and re-upload it to GitHub.
 *
 *  WHAT EACH SETTING MEANS:
 *  - whatsapp: your business WhatsApp number with country code,
 *    numbers only, e.g. "8801XXXXXXXXX". Leave "" (empty) if you
 *    do not want a WhatsApp order button. NO number is set now.
 *  - deliveryFee: a number charges that fee on every order.
 *    null means "delivery fee is confirmed with the order" —
 *    that is the honest setting until you fix a real fee.
 *  - payments: these flags only change what the checkout SHOWS.
 *    cod / bkash / nagad = true makes that option selectable.
 *    Turning a flag on does NOT process real online payments —
 *    real online payment needs a backend (see ADMIN_GUIDE.md).
 *  - A product with price: null is NOT sold online yet. The site
 *    shows "Price on request" and sends people to Instagram.
 *    Give it real variants/prices here when you are ready.
 *  - available: false marks a product "Out of stock" and stops
 *    online ordering for it.
 * ============================================================
 */
var _rawshadRoot = (typeof window !== "undefined") ? window : globalThis;

_rawshadRoot.RAWSHAD_CONFIG = {
  announcement: "Pure. Natural. Delicious. — Dry fruit powders & healthy snacks, made in Bangladesh. Order online or message us on Instagram.",
  email: "rawshadshop@gmail.com",
  instagram: "https://www.instagram.com/rawshadshop/",
  dmLink: "https://ig.me/m/rawshadshop",
  whatsapp: "",
  deliveryFee: null,
  currency: "৳",
  payments: { manual: true, cod: false, bkash: false, nagad: false },
  featuredIds: ["beetroot-powder", "thankuni-powder", "dried-mango"],
  freeDeliveryNote: null,
  categories: [
    { id: "powders", label: "Powders" },
    { id: "dried-fruits", label: "Dried Fruits & Snacks" }
  ]
};

_rawshadRoot.RAWSHAD_PRODUCTS = [
  {
    id: "beetroot-powder",
    name: "Premium Beetroot Powder",
    bn: "প্রিমিয়াম বিটরুট গুঁড়া",
    category: "powders",
    img: "assets/beetroot.jpg",
    alt: "Rawshad Premium Beetroot Powder poster showing jars of beetroot powder",
    desc: "Premium beetroot powder from Rawshad — 100% natural, rich in nutrients. An easy way to add beetroot to smoothies, yogurt and oatmeal, juices and baking.",
    benefits: ["100% natural", "Rich in nutrients", "Boosts energy", "Supports heart health"],
    uses: ["Smoothies", "Yogurt & oatmeal", "Juices", "Baking"],
    variants: [
      { label: "100gm", price: 369, inStock: true },
      { label: "50gm", price: 179, inStock: true }
    ],
    price: null,
    orderable: true,
    available: true,
    inStock: true,
    badge: "100% natural",
    featured: true
  },
  {
    id: "thankuni-powder",
    name: "Thankuni Powder (থানকুনি গুঁড়া)",
    bn: "থানকুনি গুঁড়া",
    category: "powders",
    img: "assets/herbal.jpg",
    alt: "Rawshad Thankuni Powder pouch with dehydrated thankuni leaves",
    desc: "Dehydrated thankuni (centella) powder, 100% natural — as shown on the product packaging. Message us on Instagram for the current price and ordering details.",
    benefits: ["100% natural", "Dehydrated thankuni (centella) powder"],
    uses: [],
    variants: [],
    price: null,
    orderable: false,
    available: true,
    inStock: true,
    badge: "100% natural",
    featured: true
  },
  {
    id: "dried-mango",
    name: "Pure Dried Mango",
    bn: "শুকনো আম",
    category: "dried-fruits",
    img: "assets/snacks.jpg",
    alt: "Rawshad Pure Dried Mango and Mixed Berry Medley pouches with fresh mango",
    desc: "Rawshad Pure Dried Mango — 100% natural, no additives, as shown on the product packaging. Message us on Instagram for the current price and ordering details.",
    benefits: ["100% natural", "No additives"],
    uses: ["Snacking", "Kids' lunchbox", "On the go"],
    variants: [],
    price: null,
    orderable: false,
    available: true,
    inStock: true,
    badge: "100% natural",
    featured: true
  },
  {
    id: "mixed-berry",
    name: "Mixed Berry Medley",
    bn: "মিক্সড বেরি",
    category: "dried-fruits",
    img: "assets/snacks.jpg",
    alt: "Rawshad Mixed Berry Medley pouch with fresh berries and mango",
    desc: "Rawshad Mixed Berry Medley — 100% natural dried fruits, as shown on the product packaging. Message us on Instagram for the current price and ordering details.",
    benefits: ["100% natural", "No additives"],
    uses: ["Snacking", "Yogurt & oatmeal", "On the go"],
    variants: [],
    price: null,
    orderable: false,
    available: true,
    inStock: true,
    badge: "100% natural",
    featured: false
  }
];

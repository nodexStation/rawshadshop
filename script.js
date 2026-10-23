/* ============================================================
   Rawshad — store engine (no framework, no build step)
   Pure helpers first (testable in Node), DOM app after.
   ============================================================ */
'use strict';

/* ---------------- Pure helpers ---------------- */
function rawshadCurrency() {
  var c = (typeof globalThis !== 'undefined' && globalThis.RAWSHAD_CONFIG) || {};
  return c.currency || '৳';
}
function formatPrice(n, currency) {
  if (typeof n !== 'number' || isNaN(n)) return 'Price on request';
  return (currency || rawshadCurrency()) + n;
}
function productList() {
  return (typeof globalThis !== 'undefined' && globalThis.RAWSHAD_PRODUCTS) || [];
}
function getProduct(id) {
  var list = productList();
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}
function productInStock(p) {
  return !!p && p.inStock !== false && p.available !== false;
}
function variantOf(p, label) {
  if (!p || !p.variants) return null;
  for (var i = 0; i < p.variants.length; i++) if (p.variants[i].label === label) return p.variants[i];
  return null;
}
function firstInStockVariant(p) {
  if (!p || !p.variants) return null;
  for (var i = 0; i < p.variants.length; i++) {
    var v = p.variants[i];
    if (v.inStock !== false && typeof v.price === 'number') return v;
  }
  return null;
}
function canAddToCart(p, variantLabel) {
  if (!p || !p.orderable || !productInStock(p)) return false;
  var v = variantLabel ? variantOf(p, variantLabel) : firstInStockVariant(p);
  if (p.variants && p.variants.length) {
    return !!v && v.inStock !== false && typeof v.price === 'number';
  }
  return typeof p.price === 'number';
}
function lowestPrice(p) {
  if (!p) return null;
  var prices = [];
  if (p.variants) p.variants.forEach(function (v) { if (typeof v.price === 'number' && v.inStock !== false) prices.push(v.price); });
  if (typeof p.price === 'number') prices.push(p.price);
  return prices.length ? Math.min.apply(null, prices) : null;
}
function cartSubtotal(items) {
  return (items || []).reduce(function (sum, it) { return sum + (Number(it.price) || 0) * (Number(it.qty) || 0); }, 0);
}
function cartCount(items) {
  return (items || []).reduce(function (sum, it) { return sum + (Number(it.qty) || 0); }, 0);
}
function computeTotals(subtotal, deliveryFee) {
  var hasFee = typeof deliveryFee === 'number' && !isNaN(deliveryFee);
  return {
    subtotal: subtotal,
    deliveryFee: hasFee ? deliveryFee : null,
    deliveryTbc: !hasFee,
    total: subtotal + (hasFee ? deliveryFee : 0)
  };
}
function validatePhone(raw) {
  if (!raw) return false;
  var p = String(raw).replace(/[\s\-()]/g, '');
  if (p.indexOf('+880') === 0) p = '0' + p.slice(4);
  else if (p.indexOf('880') === 0) p = '0' + p.slice(3);
  return /^01[3-9]\d{8}$/.test(p);
}
function normalizePhone(raw) {
  var p = String(raw || '').replace(/[\s\-()]/g, '');
  if (p.indexOf('+880') === 0) p = '0' + p.slice(4);
  else if (p.indexOf('880') === 0) p = '0' + p.slice(3);
  return p;
}
function makeOrderRef(existingRefs) {
  var existing = {};
  (existingRefs || []).forEach(function (r) { existing[r] = true; });
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function attempt() {
    var d = new Date();
    var ymd = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var suffix = '';
    for (var i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    return 'RAW-' + ymd + '-' + suffix;
  }
  var ref = attempt();
  var guard = 0;
  while (existing[ref] && guard < 500) { ref = attempt(); guard++; }
  return ref;
}
function orderItemsText(order) {
  return (order.items || []).map(function (it) {
    return '- ' + it.name + (it.variant ? ' (' + it.variant + ')' : '') + ' x' + it.qty + ' = ' + formatPrice(it.price * it.qty);
  }).join('\n');
}
function buildOrderText(order) {
  var lines = [
    'New order from the Rawshad website',
    'Order reference: ' + order.ref,
    '',
    orderItemsText(order),
    '',
    'Subtotal: ' + formatPrice(order.subtotal)
  ];
  if (typeof order.deliveryFee === 'number') lines.push('Delivery fee: ' + formatPrice(order.deliveryFee));
  else lines.push('Delivery fee: to be confirmed');
  lines.push('Total: ' + formatPrice(order.total));
  lines.push('');
  lines.push('Name: ' + order.customer.name);
  lines.push('Phone: ' + order.customer.phone);
  lines.push('Address: ' + order.customer.address);
  if (order.customer.notes) lines.push('Notes: ' + order.customer.notes);
  lines.push('Payment: ' + order.paymentLabel);
  return lines.join('\n');
}
function csvEscape(v) {
  var s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function ordersToCSV(orders) {
  var head = ['Reference', 'Date', 'Customer', 'Phone', 'Items', 'Subtotal', 'Delivery Fee', 'Total', 'Payment', 'Status', 'Address', 'Notes'];
  var rows = (orders || []).map(function (o) {
    var items = (o.items || []).map(function (it) { return it.name + (it.variant ? ' (' + it.variant + ')' : '') + ' x' + it.qty; }).join('; ');
    return [o.ref, o.createdAt || '', (o.customer || {}).name || '', (o.customer || {}).phone || '', items, o.subtotal, (typeof o.deliveryFee === 'number' ? o.deliveryFee : 'TBC'), o.total, o.paymentLabel || '', o.status || 'New', (o.customer || {}).address || '', (o.customer || {}).notes || ''].map(csvEscape).join(',');
  });
  return head.join(',') + '\n' + rows.join('\n');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatPrice: formatPrice, getProduct: getProduct, productInStock: productInStock,
    variantOf: variantOf, firstInStockVariant: firstInStockVariant, canAddToCart: canAddToCart,
    lowestPrice: lowestPrice, cartSubtotal: cartSubtotal, cartCount: cartCount,
    computeTotals: computeTotals, validatePhone: validatePhone, normalizePhone: normalizePhone,
    makeOrderRef: makeOrderRef, buildOrderText: buildOrderText, ordersToCSV: ordersToCSV
  };
}

/* ---------------- Browser app ---------------- */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    var CONFIG = globalThis.RAWSHAD_CONFIG || {};
    var PRODUCTS = productList();
    var CART_KEY = 'rawshad_cart_v2';
    var ORDERS_KEY = 'rawshad_orders_v2';
    var LAST_ORDER_KEY = 'rawshad_last_order_v2';

    function store(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
    function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function $(id) { return document.getElementById(id); }

    var cart = store(CART_KEY, []);
    var shopState = { q: '', cat: 'all', sort: 'featured' };

    /* ----- announcement / links ----- */
    if (CONFIG.announcement) $('announceText').textContent = CONFIG.announcement;
    var heroDm = $('heroDmBtn'); if (heroDm) heroDm.href = CONFIG.dmLink || CONFIG.instagram || '#';

    /* ----- categories ----- */
    function catLabel(id) { var c = (CONFIG.categories || []).filter(function (x) { return x.id === id; })[0]; return c ? c.label : id; }
    var dropMenu = $('catDropMenu');
    if (dropMenu) {
      dropMenu.innerHTML = (CONFIG.categories || []).map(function (c) {
        return '<a href="#shop" role="menuitem" data-cat-link="' + esc(c.id) + '">' + esc(c.label) + '</a>';
      }).join('');
    }
    var dropBtn = $('catDropBtn');
    if (dropBtn && dropMenu) {
      dropBtn.addEventListener('click', function () {
        var open = dropMenu.classList.toggle('open');
        dropBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) { if (!e.target.closest('.nav-drop')) { dropMenu.classList.remove('open'); dropBtn.setAttribute('aria-expanded', 'false'); } });
    }

    /* ----- product cards ----- */
    function priceHTML(p) {
      var low = lowestPrice(p);
      if (low === null) return '<p class="price-request">Price on request</p>';
      if (p.variants && p.variants.length > 1) return '<p class="card-price">' + formatPrice(low) + ' <small>from</small></p>';
      return '<p class="card-price">' + formatPrice(low) + '</p>';
    }
    function availHTML(p) {
      if (!productInStock(p)) return '<p class="avail out">Out of stock</p>';
      return '<p class="avail">In stock</p>';
    }
    function cardHTML(p) {
      var orderable = canAddToCart(p);
      var controls;
      if (p.orderable && productInStock(p) && lowestPrice(p) !== null) {
        var varOpts = (p.variants || []).map(function (v) {
          return '<option value="' + esc(v.label) + '"' + (v.inStock === false ? ' disabled' : '') + '>' + esc(v.label) + ' — ' + formatPrice(v.price) + (v.inStock === false ? ' (out of stock)' : '') + '</option>';
        }).join('');
        controls =
          (p.variants && p.variants.length ? '<label>Size <select data-variant="' + p.id + '" aria-label="Choose size for ' + esc(p.name) + '">' + varOpts + '</select></label>' : '') +
          '<div class="qty-row"><span class="qty-stepper"><button type="button" data-qty="dec" aria-label="Decrease quantity">−</button><output data-qty-out>1</output><button type="button" data-qty="inc" aria-label="Increase quantity">+</button></span>' +
          '<button class="btn btn-primary" type="button" data-add="' + p.id + '"' + (orderable ? '' : ' disabled') + '>Add to Cart</button></div>';
      } else if (p.orderable && !productInStock(p)) {
        controls = '<button class="btn btn-primary" type="button" disabled>Out of Stock</button>';
      } else {
        controls = '<a class="btn btn-ghost" href="' + esc(CONFIG.dmLink || '#') + '" target="_blank" rel="noopener">Ask Price / Order on Instagram</a>';
      }
      var quick = orderable ? '<button class="btn btn-gold quick-add" type="button" data-quickadd="' + p.id + '" style="position:absolute;top:.8rem;right:.8rem;min-height:40px;padding:.4rem .9rem;font-size:.85rem">+ Quick Add</button>' : '';
      return '<article class="product-card" data-card="' + p.id + '">' +
        '<div class="thumb"><a href="#/product/' + p.id + '"><img src="' + esc(p.img) + '" alt="' + esc(p.alt) + '" loading="lazy" width="900" height="675"></a>' +
        (p.badge ? '<span class="badge' + (p.featured ? ' featured-badge' : '') + '">' + esc(p.badge) + '</span>' : '') + quick + '</div>' +
        '<div class="card-body"><span class="card-cat">' + esc(catLabel(p.category)) + '</span>' +
        '<h3 class="card-name"><a href="#/product/' + p.id + '">' + esc(p.name) + '</a></h3>' +
        (p.bn ? '<p class="card-bn" lang="bn">' + esc(p.bn) + '</p>' : '') +
        priceHTML(p) + availHTML(p) +
        '<div class="card-controls">' + controls + '</div></div></article>';
    }
    function renderGrid(el, list) { if (el) el.innerHTML = list.map(cardHTML).join(''); }

    /* featured */
    var featuredIds = CONFIG.featuredIds || [];
    var featured = PRODUCTS.filter(function (p) { return p.featured || featuredIds.indexOf(p.id) >= 0; });
    renderGrid($('featuredGrid'), featured);

    /* categories */
    var catImgs = { 'powders': 'assets/beetroot.jpg', 'dried-fruits': 'assets/snacks.jpg' };
    var catGrid = $('categoryGrid');
    if (catGrid) {
      catGrid.innerHTML = (CONFIG.categories || []).map(function (c) {
        var img = catImgs[c.id] || 'assets/snacks.jpg';
        var count = PRODUCTS.filter(function (p) { return p.category === c.id; }).length;
        return '<a class="category-card" href="#shop" data-cat-link="' + esc(c.id) + '"><img src="' + img + '" alt="' + esc(c.label) + ' products from Rawshad" loading="lazy" width="900" height="675"><span class="cat-label"><strong>' + esc(c.label) + '</strong><span>' + count + ' products — tap to shop</span></span></a>';
      }).join('');
    }

    /* filter chips */
    var chipsEl = $('filterChips');
    function renderChips() {
      if (!chipsEl) return;
      var cats = [{ id: 'all', label: 'All' }].concat(CONFIG.categories || []);
      chipsEl.innerHTML = cats.map(function (c) {
        return '<button type="button" class="chip' + (shopState.cat === c.id ? ' active' : '') + '" data-chip="' + esc(c.id) + '">' + esc(c.label) + '</button>';
      }).join('');
    }
    function setCategory(id) { shopState.cat = id; renderChips(); renderShop(); }
    function goShopWithCategory(id) { showView('home'); setCategory(id); var t = $('shop'); if (t) t.scrollIntoView({ behavior: 'smooth' }); }

    /* shop */
    function renderShop() {
      var grid = $('shopGrid'); if (!grid) return;
      var list = PRODUCTS.slice();
      if (shopState.cat !== 'all') list = list.filter(function (p) { return p.category === shopState.cat; });
      if (shopState.q) { var q = shopState.q.toLowerCase(); list = list.filter(function (p) { return (p.name + ' ' + (p.bn || '') + ' ' + p.desc).toLowerCase().indexOf(q) >= 0; }); }
      if (shopState.sort === 'price-asc' || shopState.sort === 'price-desc') {
        var dir = shopState.sort === 'price-asc' ? 1 : -1;
        list.sort(function (a, b) { var pa = lowestPrice(a), pb = lowestPrice(b); if (pa === null && pb === null) return 0; if (pa === null) return 1; if (pb === null) return -1; return (pa - pb) * dir; });
      } else if (shopState.sort === 'name') { list.sort(function (a, b) { return a.name.localeCompare(b.name); }); }
      else { list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }); }
      renderGrid(grid, list);
      $('shopEmpty').hidden = list.length > 0;
      grid.hidden = list.length === 0;
    }
    var searchInput = $('searchInput');
    if (searchInput) searchInput.addEventListener('input', function () { shopState.q = searchInput.value.trim(); renderShop(); });
    var sortSelect = $('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', function () { shopState.sort = sortSelect.value; renderShop(); });
    var resetBtn = $('resetFilters');
    if (resetBtn) resetBtn.addEventListener('click', function () { shopState = { q: '', cat: 'all', sort: 'featured' }; if (searchInput) searchInput.value = ''; if (sortSelect) sortSelect.value = 'featured'; renderChips(); renderShop(); });

    /* ----- cart ----- */
    function persistCart() { save(CART_KEY, cart); }
    function cartDetailed() {
      return cart.map(function (it) { var p = getProduct(it.id); return { id: it.id, variant: it.variant, price: it.price, qty: it.qty, name: p ? p.name : it.id, img: p ? p.img : '', alt: p ? p.alt : '' }; });
    }
    function addToCart(id, variantLabel, qty, btn) {
      var p = getProduct(id); if (!p) return false;
      var v = variantLabel ? variantOf(p, variantLabel) : firstInStockVariant(p);
      if (p.variants && p.variants.length && !v) return false;
      if (!canAddToCart(p, v ? v.label : null)) return false;
      var price = v ? v.price : p.price;
      var label = v ? v.label : '';
      var found = null;
      cart.forEach(function (it) { if (it.id === id && it.variant === label) found = it; });
      if (found) found.qty += qty; else cart.push({ id: id, variant: label, price: price, qty: qty });
      persistCart(); updateCartUI(true);
      if (btn) { var old = btn.textContent; btn.classList.add('added'); btn.textContent = '✓ Added'; setTimeout(function () { btn.classList.remove('added'); btn.textContent = old; }, 1200); }
      return true;
    }
    function updateCartUI(pulse) {
      var count = cartCount(cart);
      var badge = $('cartCount');
      if (badge) { badge.textContent = count; badge.hidden = count === 0; if (pulse) { badge.classList.remove('pulse'); void badge.offsetWidth; badge.classList.add('pulse'); } }
      var bar = $('stickyBar');
      var onCheckoutFlow = ['checkout', 'confirmation', 'admin'].indexOf(currentView) >= 0;
      if (bar) {
        bar.hidden = count === 0 || onCheckoutFlow;
        $('stickyCount').textContent = count + (count === 1 ? ' item' : ' items');
        $('stickyTotal').textContent = formatPrice(cartSubtotal(cart));
      }
      renderDrawer();
    }
    function renderDrawer() {
      var body = $('drawerBody'), foot = $('drawerFoot');
      if (!body || !foot) return;
      var items = cartDetailed();
      if (!items.length) {
        body.innerHTML = '<div class="empty-state"><p class="empty-emoji" aria-hidden="true">🧺</p><h3>Your cart is empty</h3><p>Add something pure and natural.</p><a class="btn btn-primary" href="#shop" id="drawerShopLink">Browse the shop</a></div>';
        foot.innerHTML = '';
        var link = $('drawerShopLink'); if (link) link.addEventListener('click', closeDrawer);
        return;
      }
      body.innerHTML = items.map(function (it, idx) {
        return '<div class="cart-line"><img src="' + esc(it.img) + '" alt="' + esc(it.alt) + '"><div class="line-info">' +
          '<span class="line-name">' + esc(it.name) + '</span><span class="line-variant">' + esc(it.variant || '') + ' · ' + formatPrice(it.price) + '</span>' +
          '<div class="line-bottom"><span class="qty-stepper"><button type="button" data-line-dec="' + idx + '" aria-label="Decrease quantity">−</button><output>' + it.qty + '</output><button type="button" data-line-inc="' + idx + '" aria-label="Increase quantity">+</button></span>' +
          '<strong>' + formatPrice(it.price * it.qty) + '</strong></div>' +
          '<button class="remove-btn" type="button" data-line-remove="' + idx + '">Remove</button></div></div>';
      }).join('');
      var subtotal = cartSubtotal(cart);
      foot.innerHTML = '<div class="summary-list"><li><span>Subtotal</span><strong>' + formatPrice(subtotal) + '</strong></li></div>' +
        '<button class="btn btn-primary btn-block" type="button" id="drawerCheckout">Checkout</button>' +
        '<a class="btn btn-ghost btn-block" href="' + esc(CONFIG.dmLink || '#') + '" target="_blank" rel="noopener">Order via Instagram DM</a>' +
        '<p class="hint" style="margin:0;font-size:.85rem;color:var(--muted)">Guest checkout — no account needed. Delivery is confirmed with your order.</p>';
      var co = $('drawerCheckout'); if (co) co.addEventListener('click', function () { closeDrawer(); location.hash = '#/checkout'; });
    }
    var drawer = $('cartDrawer'), overlay = $('drawerOverlay');
    function openDrawer() { renderDrawer(); drawer.hidden = false; overlay.hidden = false; var c = $('drawerClose'); if (c) c.focus(); }
    function closeDrawer() { drawer.hidden = true; overlay.hidden = true; }
    var cartBtn = $('cartBtn'); if (cartBtn) cartBtn.addEventListener('click', openDrawer);
    var drawerClose = $('drawerClose'); if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    var stickyCheckout = $('stickyCheckout'); if (stickyCheckout) stickyCheckout.addEventListener('click', function () { location.hash = '#/checkout'; });

    /* ----- mobile menu / search ----- */
    var menuBtn = $('menuBtn'), mobileMenu = $('mobileMenu');
    function closeMenu() { if (mobileMenu) mobileMenu.hidden = true; if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); }
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function () { var open = mobileMenu.hidden; mobileMenu.hidden = !open; menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
      mobileMenu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    }
    var searchBtn = $('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', function () { showView('home'); var t = $('shop'); if (t) t.scrollIntoView({ behavior: 'smooth' }); setTimeout(function () { if (searchInput) searchInput.focus(); }, 450); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrawer(); closeMenu(); if (dropMenu) dropMenu.classList.remove('open'); }
    });

    /* ----- global click delegation ----- */
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-chip]'); if (chip) { setCategory(chip.getAttribute('data-chip')); return; }
      var catLink = e.target.closest('[data-cat-link]'); if (catLink) { e.preventDefault(); goShopWithCategory(catLink.getAttribute('data-cat-link')); return; }
      var quick = e.target.closest('[data-quickadd]'); if (quick) { addToCart(quick.getAttribute('data-quickadd'), null, 1, quick); return; }
      var add = e.target.closest('[data-add]'); if (add) {
        var card = add.closest('[data-card]');
        var sel = card ? card.querySelector('[data-variant]') : null;
        var out = card ? card.querySelector('[data-qty-out]') : null;
        addToCart(add.getAttribute('data-add'), sel ? sel.value : null, out ? parseInt(out.textContent, 10) || 1 : 1, add);
        return;
      }
      var qtyBtn = e.target.closest('[data-qty]');
      if (qtyBtn) {
        var wrap = qtyBtn.closest('.qty-row') || qtyBtn.closest('.qty-stepper');
        var outEl = qtyBtn.parentElement.parentElement.querySelector('[data-qty-out]') || qtyBtn.closest('[data-card], .detail-info, .qty-row').querySelector('[data-qty-out]');
        if (outEl) { var val = parseInt(outEl.textContent, 10) || 1; val = qtyBtn.getAttribute('data-qty') === 'inc' ? Math.min(val + 1, 99) : Math.max(val - 1, 1); outEl.textContent = val; }
        return;
      }
      var inc = e.target.closest('[data-line-inc]'); if (inc) { cart[+inc.getAttribute('data-line-inc')].qty++; persistCart(); updateCartUI(false); return; }
      var dec = e.target.closest('[data-line-dec]'); if (dec) { var i = +dec.getAttribute('data-line-dec'); cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); persistCart(); updateCartUI(false); return; }
      var rem = e.target.closest('[data-line-remove]'); if (rem) { cart.splice(+rem.getAttribute('data-line-remove'), 1); persistCart(); updateCartUI(false); return; }
      var faqQ = e.target.closest('.faq-q');
      if (faqQ) {
        var item = faqQ.parentElement; var ans = item.querySelector('.faq-a'); var expanded = faqQ.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-q').forEach(function (q) { q.setAttribute('aria-expanded', 'false'); q.parentElement.querySelector('.faq-a').hidden = true; });
        if (!expanded) { faqQ.setAttribute('aria-expanded', 'true'); ans.hidden = false; }
        return;
      }
    });
    document.addEventListener('change', function (e) {
      var sel = e.target.closest ? e.target.closest('[data-variant]') : null;
      if (sel) {
        var card = sel.closest('[data-card]'); if (!card) return;
        var p = getProduct(card.getAttribute('data-card')); var v = variantOf(p, sel.value);
        var btn = card.querySelector('[data-add]');
        if (btn) btn.disabled = !(v && v.inStock !== false);
      }
      var statusSel = e.target.closest ? e.target.closest('[data-order-status]') : null;
      if (statusSel) {
        var orders = store(ORDERS_KEY, []);
        orders.forEach(function (o) { if (o.ref === statusSel.getAttribute('data-order-status')) o.status = statusSel.value; });
        save(ORDERS_KEY, orders); renderAdminSummary(orders);
      }
    });

    /* ----- views / router ----- */
    var currentView = 'home';
    var VIEWS = ['home', 'product', 'checkout', 'confirmation', 'page', 'admin'];
    function showView(name) {
      currentView = name;
      VIEWS.forEach(function (v) { var el = $('view-' + v); if (el) el.hidden = v !== name; });
      window.scrollTo({ top: 0 });
      updateCartUI(false);
    }

    /* product detail */
    function renderProduct(id) {
      var p = getProduct(id); var wrap = $('view-product');
      if (!p) { wrap.innerHTML = '<div class="container view-wrap"><a class="back-link" href="#shop">← Back to shop</a><div class="empty-state"><h3>Product not found</h3><p>This product is not in the catalogue.</p></div></div>'; showView('product'); return; }
      var orderable = canAddToCart(p);
      var controls;
      if (p.orderable && productInStock(p) && lowestPrice(p) !== null) {
        var pills = (p.variants || []).map(function (v, i) {
          return '<button type="button" class="variant-pill' + (i === 0 && v.inStock !== false ? ' active' : '') + '" data-pill="' + esc(v.label) + '"' + (v.inStock === false ? ' disabled' : '') + '>' + esc(v.label) + ' — ' + formatPrice(v.price) + (v.inStock === false ? ' (out of stock)' : '') + '</button>';
        }).join('');
        controls = (p.variants && p.variants.length ? '<p><strong>Size</strong></p><div class="variant-pills" id="detailPills">' + pills + '</div>' : '') +
          '<div class="qty-row" style="margin-top:1rem"><span class="qty-stepper"><button type="button" data-qty="dec" aria-label="Decrease quantity">−</button><output data-qty-out id="detailQty">1</output><button type="button" data-qty="inc" aria-label="Increase quantity">+</button></span>' +
          '<button class="btn btn-primary btn-lg" type="button" id="detailAdd"' + (orderable ? '' : ' disabled') + '>Add to Cart</button></div>' +
          '<p class="hint" style="color:var(--muted);font-size:.9rem">Guest checkout — no account needed.</p>';
      } else if (p.orderable && !productInStock(p)) {
        controls = '<button class="btn btn-primary btn-lg" type="button" disabled>Out of Stock</button>';
      } else {
        controls = '<p class="price-request" style="font-size:1.2rem">Price on request</p><a class="btn btn-primary btn-lg" href="' + esc(CONFIG.dmLink || '#') + '" target="_blank" rel="noopener">Ask Price / Order on Instagram</a>';
      }
      var related = PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; });
      wrap.innerHTML = '<div class="container view-wrap"><a class="back-link" href="#shop">← Back to shop</a>' +
        '<div class="detail-grid"><figure class="detail-media" style="margin:0"><img src="' + esc(p.img) + '" alt="' + esc(p.alt) + '" width="900" height="900"></figure>' +
        '<div class="detail-info"><span class="card-cat">' + esc(catLabel(p.category)) + '</span><h1>' + esc(p.name) + '</h1>' +
        (p.bn ? '<p class="card-bn" lang="bn">' + esc(p.bn) + '</p>' : '') + priceHTML(p) + availHTML(p) +
        '<p>' + esc(p.desc) + '</p>' +
        (p.benefits && p.benefits.length ? '<h3>Good to know</h3><ul class="benefit-list">' + p.benefits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') +
        (p.uses && p.uses.length ? '<p><strong>Enjoy it in:</strong> ' + p.uses.map(esc).join(' · ') + '</p>' : '') +
        controls + '</div></div>' +
        (related.length ? '<h2 class="section-title left related-title">You may also like</h2><div class="product-grid">' + related.map(cardHTML).join('') + '</div>' : '') +
        '</div>';
      showView('product');
      var pillsWrap = $('detailPills');
      if (pillsWrap) pillsWrap.addEventListener('click', function (e) {
        var pill = e.target.closest('[data-pill]'); if (!pill || pill.disabled) return;
        pillsWrap.querySelectorAll('.variant-pill').forEach(function (x) { x.classList.remove('active'); });
        pill.classList.add('active');
      });
      var dAdd = $('detailAdd');
      if (dAdd) dAdd.addEventListener('click', function () {
        var active = pillsWrap ? pillsWrap.querySelector('.variant-pill.active') : null;
        var qtyEl = $('detailQty');
        if (addToCart(p.id, active ? active.getAttribute('data-pill') : null, qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1, dAdd)) openDrawer();
      });
    }

    /* checkout */
    function paymentOptionsHTML() {
      var pay = CONFIG.payments || {};
      var opts = ['<label class="radio-card"><input type="radio" name="payment" value="manual" checked><span><strong>Manual order</strong> — we confirm price, delivery and payment with you personally.<br><span class="tag" style="color:var(--brand-leaf)">Available now</span></span></label>'];
      [['cod', 'Cash on Delivery'], ['bkash', 'bKash'], ['nagad', 'Nagad']].forEach(function (pair) {
        var enabled = !!pay[pair[0]];
        opts.push('<label class="radio-card' + (enabled ? '' : ' disabled') + '"><input type="radio" name="payment" value="' + pair[0] + '"' + (enabled ? '' : ' disabled') + '><span><strong>' + pair[1] + '</strong>' + (enabled ? '' : '<br><span class="tag">Not yet available</span>') + '</span></label>');
      });
      return opts.join('');
    }
    function renderCheckout() {
      var wrap = $('view-checkout');
      var items = cartDetailed();
      if (!items.length) {
        wrap.innerHTML = '<div class="container view-wrap"><div class="empty-state"><p class="empty-emoji" aria-hidden="true">🧺</p><h3>Your cart is empty</h3><p>Add a product first, then come back to checkout.</p><a class="btn btn-primary" href="#shop">Browse the shop</a></div></div>';
        showView('checkout'); return;
      }
      var subtotal = cartSubtotal(cart);
      var totals = computeTotals(subtotal, CONFIG.deliveryFee);
      var summaryRows = items.map(function (it) { return '<li><span>' + esc(it.name) + (it.variant ? ' (' + esc(it.variant) + ')' : '') + ' × ' + it.qty + '</span><strong>' + formatPrice(it.price * it.qty) + '</strong></li>'; }).join('');
      wrap.innerHTML = '<div class="container view-wrap"><a class="back-link" href="#shop">← Continue shopping</a><h1 class="section-title left" style="margin-top:.8rem">Checkout</h1>' +
        '<p class="note-box">Guest checkout — no account needed. Placing an order prepares it with a reference number; you then send it to us in one tap by email or Instagram so we can confirm. Nothing is charged online.</p>' +
        '<div class="checkout-grid" style="margin-top:1.4rem"><form class="form-card" id="checkoutForm" novalidate>' +
        '<div class="form-grid">' +
        '<div class="field"><label for="fName">Your name *</label><input class="field-input" id="fName" name="name" type="text" autocomplete="name" required><p class="field-error" data-err="name" hidden></p></div>' +
        '<div class="field"><label for="fPhone">Mobile number *</label><input class="field-input" id="fPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="01XXXXXXXXX" required><p class="hint">A Bangladeshi mobile number so we can confirm your order.</p><p class="field-error" data-err="phone" hidden></p></div>' +
        '<div class="field"><label for="fAddress">Delivery address *</label><textarea class="field-input" id="fAddress" name="address" rows="3" autocomplete="street-address" required></textarea><p class="field-error" data-err="address" hidden></p></div>' +
        '<div class="field"><label for="fNotes">Order notes <span class="hint">(optional)</span></label><textarea class="field-input" id="fNotes" name="notes" rows="2"></textarea></div>' +
        '<fieldset class="field" style="border:none;padding:0;margin:0"><legend style="font-weight:700;margin-bottom:.5rem">Payment</legend><div class="form-grid">' + paymentOptionsHTML() + '</div></fieldset>' +
        '<div class="form-error-summary" id="formError" hidden></div>' +
        '<button class="btn btn-primary btn-lg btn-block" type="submit" id="placeOrderBtn">Place Order</button>' +
        '</div></form>' +
        '<aside class="form-card" aria-label="Order summary"><h2 style="font-family:var(--font-display);color:var(--brand-maroon);margin-top:0">Order summary</h2>' +
        '<ul class="summary-list">' + summaryRows +
        '<li><span>Subtotal</span><strong>' + formatPrice(totals.subtotal) + '</strong></li>' +
        (totals.deliveryTbc ? '<li><span>Delivery fee</span><strong>Confirmed with your order</strong></li>' : '<li><span>Delivery fee</span><strong>' + formatPrice(totals.deliveryFee) + '</strong></li>') +
        '<li class="summary-total"><span>Total</span><span>' + formatPrice(totals.total) + '</span></li></ul>' +
        (totals.deliveryTbc ? '<p class="note-box" style="margin-top:1rem">Your total above is the product total. Any delivery fee will be confirmed with you before payment — nothing extra is charged silently.</p>' : '') +
        '</aside></div></div>';
      showView('checkout');
      var form = $('checkoutForm');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('fName').value.trim();
        var phoneRaw = $('fPhone').value;
        var address = $('fAddress').value.trim();
        var notes = $('fNotes').value.trim();
        var errors = {};
        if (!name) errors.name = 'Please enter your name.';
        if (!validatePhone(phoneRaw)) errors.phone = 'Please enter a valid Bangladeshi mobile number (11 digits, starting with 01).';
        if (!address) errors.address = 'Please enter your delivery address.';
        ['name', 'phone', 'address'].forEach(function (k) {
          var el = form.querySelector('[data-err="' + k + '"]');
          if (el) { el.textContent = errors[k] || ''; el.hidden = !errors[k]; }
        });
        var summary = $('formError');
        var keys = Object.keys(errors);
        if (keys.length) { summary.hidden = false; summary.textContent = 'Please fix ' + keys.length + (keys.length === 1 ? ' field' : ' fields') + ' above so we can prepare your order.'; summary.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
        summary.hidden = true;
        var btn = $('placeOrderBtn'); btn.disabled = true; btn.textContent = 'Preparing your order…';
        setTimeout(function () {
          var payEl = form.querySelector('input[name="payment"]:checked');
          var payVal = payEl ? payEl.value : 'manual';
          var payLabels = { manual: 'Manual confirmation', cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad' };
          var orders = store(ORDERS_KEY, []);
          var ref = makeOrderRef(orders.map(function (o) { return o.ref; }));
          var order = {
            ref: ref, createdAt: new Date().toISOString(), status: 'New',
            items: cartDetailed().map(function (it) { return { id: it.id, name: it.name, variant: it.variant, price: it.price, qty: it.qty }; }),
            subtotal: totals.subtotal, deliveryFee: totals.deliveryFee, total: totals.total,
            payment: payVal, paymentLabel: payLabels[payVal] || 'Manual confirmation',
            customer: { name: name, phone: normalizePhone(phoneRaw), address: address, notes: notes }
          };
          orders.push(order); save(ORDERS_KEY, orders); save(LAST_ORDER_KEY, order);
          cart = []; persistCart(); updateCartUI(false);
          location.hash = '#/confirmation';
        }, 500);
      });
    }

    /* confirmation */
    function renderConfirmation() {
      var wrap = $('view-confirmation');
      var order = store(LAST_ORDER_KEY, null);
      if (!order) { wrap.innerHTML = '<div class="container view-wrap"><div class="empty-state"><h3>No recent order on this device</h3><p>When you place an order, its reference and send buttons will appear here.</p><a class="btn btn-primary" href="#shop">Browse the shop</a></div></div>'; showView('confirmation'); return; }
      var text = buildOrderText(order);
      var mailto = 'mailto:' + (CONFIG.email || '') + '?subject=' + encodeURIComponent('Rawshad order ' + order.ref) + '&body=' + encodeURIComponent(text);
      var waBtn = '';
      if (CONFIG.whatsapp) waBtn = '<a class="btn btn-gold btn-lg" href="https://wa.me/' + esc(CONFIG.whatsapp) + '?text=' + encodeURIComponent(text) + '" target="_blank" rel="noopener">Send Order on WhatsApp</a>';
      wrap.innerHTML = '<div class="container view-wrap"><div class="form-card confirm-hero">' +
        '<p class="eyebrow center">Order ready — one more tap</p>' +
        '<h1 style="font-family:var(--font-display);color:var(--brand-maroon)">Thank you, ' + esc(order.customer.name.split(' ')[0]) + '!</h1>' +
        '<p>Your order is prepared with this reference:</p>' +
        '<p><button class="confirm-ref" id="copyRef" type="button" title="Tap to copy your order reference">' + esc(order.ref) + '</button></p>' +
        '<p class="hint" id="copyMsg" style="color:var(--muted);font-size:.9rem">Tap the reference to copy it.</p>' +
        '<p style="max-width:560px;margin:1rem auto">Send it to us with one tap below so we can confirm your order, delivery and payment. <strong>No online payment has been taken.</strong></p>' +
        '<ul class="summary-list" style="max-width:480px;margin:1.2rem auto;text-align:left">' +
        order.items.map(function (it) { return '<li><span>' + esc(it.name) + (it.variant ? ' (' + esc(it.variant) + ')' : '') + ' × ' + it.qty + '</span><strong>' + formatPrice(it.price * it.qty) + '</strong></li>'; }).join('') +
        '<li><span>Subtotal</span><strong>' + formatPrice(order.subtotal) + '</strong></li>' +
        (typeof order.deliveryFee === 'number' ? '<li><span>Delivery fee</span><strong>' + formatPrice(order.deliveryFee) + '</strong></li>' : '<li><span>Delivery fee</span><strong>Confirmed with your order</strong></li>') +
        '<li class="summary-total"><span>Total</span><span>' + formatPrice(order.total) + '</span></li></ul>' +
        '<div class="hero-ctas center"><a class="btn btn-primary btn-lg" href="' + mailto + '">Send Order by Email</a>' + waBtn +
        '<a class="btn btn-ghost btn-lg" href="' + esc(CONFIG.dmLink || '#') + '" target="_blank" rel="noopener">Send Order on Instagram</a></div>' +
        '<p style="margin-top:1.4rem"><a class="back-link" href="#shop">Continue shopping →</a></p>' +
        '</div></div>';
      showView('confirmation');
      var copyBtn = $('copyRef');
      if (copyBtn) copyBtn.addEventListener('click', function () {
        var msg = $('copyMsg');
        function done() { if (msg) msg.textContent = 'Copied ✓ — keep it for your records.'; }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(order.ref).then(done, done);
        else done();
      });
    }

    /* info pages */
    // Configurable templates: the owner should replace these texts with their
    // final policies once delivery, payment and return terms are confirmed.
    var PAGES = {
      'privacy': { title: 'Privacy Policy', body: '<p>Rawshad collects only the details you give us when you order — your name, phone number, delivery address and order notes — so we can prepare, confirm and deliver your order.</p><p>On this website, your cart and orders are stored only in your own browser on your own device. When you send an order by email or Instagram, that message is handled by your email provider or Instagram under their own privacy terms.</p><p>We do not sell your personal information. To ask about or delete information you have sent us, email <a href="mailto:rawshadshop@gmail.com">rawshadshop@gmail.com</a>.</p>' },
      'terms': { title: 'Terms & Conditions', body: '<p>By ordering from Rawshad you agree that product details, prices and availability shown on this website are confirmed with you personally before payment. If a listed price ever differs from the confirmed price, the confirmed one — agreed with you in writing — is what applies.</p><p>Orders are complete once both sides confirm the items, total, delivery and payment details. Nothing is charged through this website.</p>' },
      'delivery-returns': { title: 'Delivery & Returns', body: '<p><strong>Delivery:</strong> delivery area, timing and any delivery fee are confirmed with you in DM or email when you order, before you pay anything. No delivery promise is made on this page because the honest terms depend on your location and order.</p><p><strong>Returns:</strong> return and replacement details are confirmed at order time. If an item arrives wrong or damaged, message us on Instagram with your order reference and we will sort it out with you.</p>' }
    };
    function renderPage(slug) {
      var pg = PAGES[slug]; var wrap = $('view-page');
      if (!pg) { wrap.innerHTML = '<div class="container view-wrap"><div class="empty-state"><h3>Page not found</h3><a class="btn btn-primary" href="#/">Back to home</a></div></div>'; showView('page'); return; }
      wrap.innerHTML = '<div class="container view-wrap page-body"><a class="back-link" href="#/">← Back to home</a><h1>' + esc(pg.title) + '</h1>' + pg.body + '<p class="template-note">This is a short, honest template — the owner can update it as business terms are confirmed.</p></div>';
      showView('page');
    }

    /* admin / local orders */
    function renderAdminSummary(orders) {
      var el = $('adminSummary'); if (!el) return;
      var revenue = (orders || []).filter(function (o) { return o.status !== 'Cancelled'; }).reduce(function (s, o) { return s + (Number(o.total) || 0); }, 0);
      el.innerHTML = '<span>Total orders: ' + (orders || []).length + '</span><span>Revenue from listed orders (excl. cancelled): ' + formatPrice(revenue) + '</span>';
    }
    function download(name, content, type) {
      var blob = new Blob([content], { type: type });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 800);
    }
    function renderAdmin() {
      var wrap = $('view-admin');
      var orders = store(ORDERS_KEY, []);
      var statuses = ['New', 'Confirmed', 'Delivered', 'Cancelled'];
      var rows = orders.slice().reverse().map(function (o) {
        var items = (o.items || []).map(function (it) { return esc(it.name) + (it.variant ? ' (' + esc(it.variant) + ')' : '') + ' ×' + it.qty; }).join('<br>');
        var sel = '<select data-order-status="' + esc(o.ref) + '" aria-label="Status for order ' + esc(o.ref) + '">' + statuses.map(function (s) { return '<option' + (o.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>';
        var date = o.createdAt ? new Date(o.createdAt).toLocaleString() : '';
        return '<tr><td><strong>' + esc(o.ref) + '</strong><br>' + esc(date) + '</td><td>' + esc((o.customer || {}).name || '') + '<br>' + esc((o.customer || {}).phone || '') + '</td><td>' + items + '</td><td>' + formatPrice(o.total) + '</td><td>' + sel + '</td></tr>';
      }).join('');
      wrap.innerHTML = '<div class="container view-wrap"><a class="back-link" href="#/">← Back to home</a>' +
        '<h1 class="section-title left" style="margin-top:.8rem">Orders on this device</h1>' +
        '<p class="admin-banner">Demo view: these orders are stored only in this browser on this device. Real multi-device order management, staff logins and online payments need a backend — see ADMIN_GUIDE.md.</p>' +
        '<div class="admin-summary" id="adminSummary"></div>' +
        (orders.length ? '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Reference / Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<div class="empty-state"><h3>No orders yet on this device</h3><p>Orders placed in this browser will appear here.</p></div>') +
        '<div class="admin-actions"><button class="btn btn-primary" type="button" id="exportCsv">Export Orders (CSV)</button><button class="btn btn-ghost" type="button" id="exportJson">Export (JSON)</button></div>' +
        '</div>';
      showView('admin');
      renderAdminSummary(orders);
      var c = $('exportCsv'); if (c) c.addEventListener('click', function () { download('rawshad-orders.csv', ordersToCSV(store(ORDERS_KEY, [])), 'text/csv'); });
      var j = $('exportJson'); if (j) j.addEventListener('click', function () { download('rawshad-orders.json', JSON.stringify(store(ORDERS_KEY, []), null, 2), 'application/json'); });
    }

    /* router */
    function route() {
      var h = location.hash || '#/';
      if (h.indexOf('#/product/') === 0) renderProduct(h.slice('#/product/'.length));
      else if (h === '#/checkout') renderCheckout();
      else if (h === '#/confirmation') renderConfirmation();
      else if (h.indexOf('#/page/') === 0) renderPage(h.slice('#/page/'.length));
      else if (h === '#/admin') renderAdmin();
      else {
        showView('home');
        if (h && h.charAt(1) !== '/' && h.length > 1) {
          var target = document.querySelector(h);
          if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth' }); }, 60);
        }
      }
    }
    window.addEventListener('hashchange', route);

    /* reveal on scroll */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } }); }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else { revealEls.forEach(function (el) { el.classList.add('visible'); }); }

    renderChips(); renderShop(); updateCartUI(false);
    route();
  });
}

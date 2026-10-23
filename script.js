// RAW-SHAD — mobile menu, FAQ accordion, order-form mailto, reveal on scroll.
(function () {
  'use strict';

  // Mobile menu toggle
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // FAQ accordion — one open at a time
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      items.forEach(function (other) {
        other.classList.remove('open');
        var ob = other.querySelector('.faq-q');
        var op = other.querySelector('.faq-a');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (op) op.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Order form — builds a mailto to rawshadshop@gmail.com and opens the email app
  var form = document.getElementById('orderForm');
  var error = document.getElementById('formError');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var product = document.getElementById('fProduct').value;
      var qty = document.getElementById('fQty').value.trim();
      var msg = document.getElementById('fMsg').value.trim();

      if (!name || !qty || parseInt(qty, 10) < 1) {
        if (error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;

      var subject = 'Order — ' + product + ' (x' + qty + ')';
      var lines = [
        'Hello RAW-SHAD,',
        '',
        'I would like to order:',
        '',
        'Name: ' + name,
        'Product: ' + product,
        'Quantity: ' + qty
      ];
      if (msg) lines.push('Message: ' + msg);
      lines.push('', 'Please confirm delivery and payment details with me. Thank you!');

      var href = 'mailto:rawshadshop@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }

  // Reveal on scroll (smooth scroll is handled by CSS scroll-behavior)
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
})();

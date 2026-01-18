﻿// Kasir (transaction) logic - full file with immediate clamp-to-stock while typing
// Perubahan utama: saat mengetik jumlah pada input barang, jika angka melebihi stok,
// input akan otomatis diset ke nilai stok (mis. stok=20 -> ketik 25 -> otomatis jadi 20).
// Masih memperbolehkan input kosong saat mengetik; clamp terjadi segera setelah angka > stok.
document.addEventListener('DOMContentLoaded', () => {
  let cart = [];

  function findMenuItem(id) {
    return getMenu().find(m => m.id === id);
  }

  function renderMenuGrid() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const visibleMenu = getMenu().filter(item => (item.stock || 0) > 0);

    if (visibleMenu.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'card';
      msg.textContent = 'Tidak ada menu tersedia (semua stok habis).';
      grid.appendChild(msg);
      return;
    }

    visibleMenu.forEach(item => {
      const el = document.createElement('div');
      el.className = 'menu-item';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;width:100%">
          <h4>${item.name}</h4>
          <div class="price">${fmt(item.price)}</div>
        </div>
        <div style="display:flex;align-items:center;width:100%;margin-top:6px">
          <div class="add-row" style="display:flex;align-items:center;gap:8px">
            <button class="qty-btn minus" aria-label="kurang">-</button>
            <input class="qty-input" type="number" min="1" value="1" />
            <button class="qty-btn plus">+</button>
          </div>
          <button class="add-to-cart">Tambah</button>
        </div>
      `;

      const minus = el.querySelector('.minus');
      const plus = el.querySelector('.plus');
      const qtyInput = el.querySelector('.qty-input');
      const addBtn = el.querySelector('.add-to-cart');

      // Set max attribute to reflect stock
      const availableStock = item.stock || 0;
      qtyInput.setAttribute('max', availableStock);
      qtyInput.value = 1;

      // Prevent clicks on inner controls from bubbling to card click
      [minus, plus, qtyInput, addBtn].forEach(node => {
        if (!node) return;
        node.addEventListener('click', e => e.stopPropagation());
      });

      // Helper: finalize (normalize) value on Enter / blur / add
      function finalizeQty() {
        const available = item.stock || 0;
        let raw = (qtyInput.value || '').toString().trim();
        if (raw === '') raw = '1';
        let v = parseInt(raw, 10) || 1;
        if (v < 1) v = 1;
        if (v > available) v = available;
        qtyInput.value = v;
        return v;
      }

      // Helper: sanitize while typing and enforce immediate clamp to stock
      function sanitizeAndClampWhileTyping() {
        const raw = qtyInput.value || '';
        // Keep only digits (allow empty)
        const cleaned = raw.replace(/\D/g, '');
        const available = item.stock || 0;
        if (cleaned === '') {
          // leave empty while typing so user can replace whole number
          qtyInput.value = '';
          return;
        }
        const n = parseInt(cleaned, 10) || 0;
        if (n > available) {
          // immediate clamp to stock
          qtyInput.value = available;
        } else {
          qtyInput.value = cleaned; // accept typed digits
        }
      }

      minus.addEventListener('click', (e) => {
        e.stopPropagation();
        let v = parseInt(qtyInput.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v > 1) v--;
        qtyInput.value = v;
      });

      plus.addEventListener('click', (e) => {
        e.stopPropagation();
        const available = item.stock || 0;
        let v = parseInt(qtyInput.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        if (v < available) v++;
        else alert('Tidak bisa menambah — stok tidak cukup.');
        qtyInput.value = v;
      });

      // Input handler: sanitize and clamp immediately if > stock
      qtyInput.addEventListener('input', () => {
        sanitizeAndClampWhileTyping();
      });

      // Finalize on blur
      qtyInput.addEventListener('blur', () => {
        finalizeQty();
      });

      // Enter key: finalize + add
      qtyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          const q = finalizeQty();
          addToCart(item.id, q);
        }
      });

      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const q = finalizeQty();
        addToCart(item.id, q);
      });

      // Clicking the whole card focuses the qty input to ease quick replace
      el.addEventListener('click', () => {
        qtyInput.focus();
        qtyInput.select();
      });

      grid.appendChild(el);
    });
  }

  function addToCart(id, q = 1) {
    const menu = getMenu();
    const item = menu.find(m => m.id === id);
    if (!item) return;
    const existing = cart.find(c => c.id === id);
    const existingQty = existing ? existing.qty : 0;
    const available = (item.stock || 0) - existingQty;
    if (available <= 0) {
      alert('Stok habis.');
      renderMenuGrid();
      return;
    }
    const toAdd = Math.min(q, available);
    if (existing) existing.qty += toAdd; else cart.push({ id: item.id, name: item.name, price: item.price, qty: toAdd });
    if (toAdd < q) alert('Jumlah ditambahkan sebagian karena stok terbatas.');
    renderCart();
  }

  function removeFromCart(idx) {
    if (idx < 0 || idx >= cart.length) return;
    cart.splice(idx, 1);
    renderCart();
  }

  function updateCartQty(idx, newQty) {
    if (idx < 0 || idx >= cart.length) return;
    const c = cart[idx];
    const menuItem = findMenuItem(c.id);
    const available = (menuItem?.stock || 0);
    if (newQty < 1) newQty = 1;
    if (newQty > available) {
      alert('Stok tidak cukup.');
      newQty = available;
    }
    c.qty = newQty;
    renderCart();
  }

  function renderCart() {
    const list = document.getElementById('cartList');
    if (!list) return;
    list.innerHTML = '';

    if (cart.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'muted';
      msg.textContent = 'Keranjang kosong';
      list.appendChild(msg);
    } else {
      cart.forEach((it, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item';

        row.innerHTML = `
          <div class="name">${it.name}</div>
          <div class="controls" style="display:flex;align-items:center;gap:8px">
            <button class="control-btn minus">-</button>
            <input class="cart-qty-input" type="number" min="1" value="${it.qty}" style="width:60px;text-align:center;border-radius:6px;padding:6px;border:1px solid #eee" />
            <button class="control-btn plus">+</button>
            <div style="width:12px"></div>
            <div class="price" style="font-family:'JetBrains Mono', monospace">${fmt(it.price * it.qty)}</div>
            <button class="control-btn remove" title="Hapus" style="margin-left:10px">×</button>
          </div>
        `;

        const minus = row.querySelector('.minus');
        const plus = row.querySelector('.plus');
        const qtyInput = row.querySelector('.cart-qty-input');
        const removeBtn = row.querySelector('.remove');

        minus.addEventListener('click', (e) => {
          e.stopPropagation();
          let v = parseInt(qtyInput.value, 10) || 1;
          if (v > 1) {
            v--;
            updateCartQty(idx, v);
          } else {
            removeFromCart(idx);
          }
        });

        plus.addEventListener('click', (e) => {
          e.stopPropagation();
          const menuItem = findMenuItem(it.id);
          const available = (menuItem?.stock || 0);
          let v = parseInt(qtyInput.value, 10) || 1;
          if (v < available) v++;
          else alert('Stok tidak cukup.');
          updateCartQty(idx, v);
        });

        // Sanitize and immediate clamp while typing in cart qty as well
        qtyInput.addEventListener('input', () => {
          const raw = qtyInput.value || '';
          const cleaned = raw.replace(/\D/g, '');
          const menuItem = findMenuItem(it.id);
          const available = (menuItem?.stock || 0);
          if (cleaned === '') {
            qtyInput.value = '';
            return;
          }
          const n = parseInt(cleaned, 10) || 0;
          if (n > available) qtyInput.value = available;
          else qtyInput.value = cleaned;
        });

        qtyInput.addEventListener('blur', () => {
          let v = parseInt(qtyInput.value, 10);
          if (isNaN(v) || v < 1) v = 1;
          updateCartQty(idx, v);
        });

        qtyInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            let v = parseInt(qtyInput.value, 10);
            if (isNaN(v) || v < 1) v = 1;
            updateCartQty(idx, v);
          }
        });

        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Hapus item dari keranjang?')) removeFromCart(idx);
        });

        list.appendChild(row);
      });
    }

    // Update totals
    const subtotal = cart.reduce((s, it) => s + (it.price * it.qty), 0);
    const totalEl = document.querySelector('.total-amount');
    if (totalEl) totalEl.textContent = fmt(subtotal);
    const subtotalEl = document.getElementById('subtotalAmount');
    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    const totalIdEl = document.getElementById('totalAmount');
    if (totalIdEl) totalIdEl.textContent = fmt(subtotal);
  }

  function completeTransaction() {
    if (cart.length === 0) {
      alert('Keranjang kosong.');
      return;
    }
    const tx = getTx();
    const subtotal = cart.reduce((s, it) => s + (it.price * it.qty), 0);
    const newTx = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
      subtotal,
      total: subtotal
    };
    tx.push(newTx);
    setTx(tx);

    // reduce stock
    const menu = getMenu();
    cart.forEach(c => {
      const idx = menu.findIndex(m => m.id === c.id);
      if (idx >= 0) {
        menu[idx].stock = Math.max(0, (menu[idx].stock || 0) - c.qty);
      }
    });
    setMenu(menu);

    cart = [];
    renderMenuGrid();
    renderCart();
    alert('Transaksi disimpan.');
  }

  const btnCheckout = document.getElementById('btnCheckout');
  if (btnCheckout) btnCheckout.addEventListener('click', () => completeTransaction());

  const btnClearCart = document.getElementById('btnClearCart');
  if (btnClearCart) btnClearCart.addEventListener('click', () => {
    if (confirm('Kosongkan keranjang?')) {
      cart = [];
      renderCart();
    }
  });

  // initial render
  renderMenuGrid();
  renderCart();

  // Debug helper
  window._pos_cart = {
    get: () => cart,
    clear: () => { cart = []; renderCart(); }
  };
});
// Kasir (transaction) logic - uses shared functions from base.js
// Perubahan: sembunyikan item dengan stock <= 0 dan batasi qty sesuai stok
document.addEventListener('DOMContentLoaded', ()=>{
  // Cart state local to kasir page
  let cart = [];

  function renderMenuGrid(){
    const grid = document.getElementById('menuGrid'); grid.innerHTML='';

    // Hanya tampilkan item dengan stok > 0
    const visibleMenu = getMenu().filter(item => (item.stock || 0) > 0);

    if(visibleMenu.length === 0){
      const msg = document.createElement('div');
      msg.className = 'card';
      msg.textContent = 'Tidak ada menu tersedia (semua stok habis).';
      grid.appendChild(msg);
      return;
    }

    visibleMenu.forEach(item=>{
      const el = document.createElement('div'); el.className='menu-item';
      el.innerHTML = `<div style="display:flex;justify-content:space-between;width:100%"><h4>${item.name}</h4><div class="price">${fmt(item.price)}</div></div>
        <div style="display:flex;align-items:center;width:100%"><div class="add-row"><button class="qty-btn" aria-label="kurang">-</button><div style="width:44px;text-align:center;font-weight:700">1</div><button class="qty-btn">+</button></div><button class="add-to-cart">Tambah</button></div>`;
      // qty controls
      const minus = el.querySelector('.qty-btn');
      const plus = el.querySelectorAll('.qty-btn')[1];
      const qtyDisplay = el.querySelector('.add-row div');
      let q=1;
      minus.addEventListener('click', (e)=>{ e.stopPropagation(); if(q>1) q--; qtyDisplay.textContent=q; });
      plus.addEventListener('click',(e)=>{ e.stopPropagation(); 
        // jangan melebihi stok yang tersedia
        const available = item.stock || 0;
        if(q < available) q++; 
        else alert('Tidak bisa menambah — stok tidak cukup.');
        qtyDisplay.textContent=q; 
      });
      el.querySelector('.add-to-cart').addEventListener('click', (e)=>{ e.stopPropagation(); addToCart(item.id,q); });
      el.addEventListener('click', ()=> addToCart(item.id,1));
      grid.appendChild(el);
    });
  }

  function addToCart(id,q=1){
    const menu = getMenu(); const item = menu.find(m=>m.id===id); if(!item) return;
    const existing = cart.find(c=>c.id===id);
    const existingQty = existing ? existing.qty : 0;
    const available = (item.stock || 0) - existingQty;
    if(available <= 0){
      alert('Stok habis.');
      renderMenuGrid(); // pastikan UI terupdate
      return;
    }
    const toAdd = Math.min(q, available);
    if(existing) existing.qty += toAdd; else cart.push({id:item.id,name:item.name,price:item.price,qty:toAdd});
    if(toAdd < q) alert('Jumlah ditambahkan sebagian karena stok terbatas.');
    renderCart();
  }

  function renderCart(){
    const list = document.getElementById('cartList'); list.innerHTML='';
    cart.forEach((it,idx)=>{
      const el = document.createElement('div'); el.className='cart-item';
      el.innerHTML = `<div style="width:34px;text-align:center;font-weight:700">${it.qty}</div><div class="name">${it.name}</div><div style="font-family:JetBrains Mono">${fmt(it.price*it.qty)}</div>`;
      const ctr = document.createElement('div'); ctr.className='controls';
      const btnMinus = document.createElement('button'); btnMinus.className='control-btn'; btnMinus.textContent='-'; btnMinus.addEventListener('click', ()=>{ if(it.qty>1) it.qty--; else cart.splice(idx,1); renderCart(); });
      const btnPlus = document.createElement('button'); btnPlus.className='control-btn'; btnPlus.textContent='+'; btnPlus.addEventListener('click', ()=>{
        // cek stok dari storage sebelum menambah
        const menu = getMenu(); const m = menu.find(x=>x.id===it.id);
        const max = m ? (m.stock || 0) : 0;
        if(it.qty < max){ it.qty++; renderCart(); }
        else alert('Tidak bisa menambah — stok tidak cukup.');
      });
      const btnDel = document.createElement('button'); btnDel.className='control-btn'; btnDel.style.background='var(--danger)'; btnDel.style.color='#fff'; btnDel.textContent='Hapus'; btnDel.addEventListener('click', ()=>{ if(confirm('Hapus item dari keranjang?')){ cart.splice(idx,1); renderCart(); } });
      ctr.appendChild(btnMinus); ctr.appendChild(btnPlus); ctr.appendChild(btnDel);
      el.appendChild(ctr);
      list.appendChild(el);
    });
    updateTotals();
  }

  function updateTotals(){
    const subtotal = cart.reduce((s,i)=>s + i.price*i.qty,0);
    document.getElementById('subtotal').textContent = fmt(subtotal);
    const disc = Number(document.getElementById('discount').value || 0);
    const total = Math.max(0, subtotal - disc);
    document.getElementById('total').textContent = fmt(total);
    const paid = Number(document.getElementById('paid').value || 0);
    const change = Math.max(0, paid - total);
    document.getElementById('change').textContent = fmt(change);
  }

  // Event bindings
  const discountEl = document.getElementById('discount');
  const paidEl = document.getElementById('paid');
  const btnReset = document.getElementById('btnReset');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnQuickNew = document.getElementById('btnQuickNew');

  discountEl.addEventListener('input', updateTotals);
  paidEl.addEventListener('input', updateTotals);
  btnReset.addEventListener('click', ()=>{ if(confirm('Reset keranjang?')){ cart=[]; renderCart(); paidEl.value=0; discountEl.value=0; updateTotals(); }});

  btnSubmit.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Keranjang kosong.'); return; }
    const subtotal = cart.reduce((s,i)=>s + i.price*i.qty,0);
    const disc = Number(discountEl.value || 0);
    const total = Math.max(0, subtotal - disc);
    const paid = Number(paidEl.value || 0);
    if(paid < total){ if(!confirm('Pembayaran kurang. Simpan sebagai piutang?')) return; }
    const tx = { id: Date.now(), date: new Date().toISOString(), items: cart.map(i=>({...i})), subtotal, total };
    const txs = getTx(); txs.unshift(tx); setTx(txs);
    // reduce stock
    const menu = getMenu(); cart.forEach(it=>{ const m = menu.find(x=>x.id===it.id); if(m) m.stock = Math.max(0,(m.stock||0)-it.qty); }); setMenu(menu);
    cart = []; renderCart(); renderMenuGrid(); // dashboard is another page; when navigating it will read storage
    alert('Transaksi tersimpan.');
  });

  btnQuickNew && btnQuickNew.addEventListener('click', ()=>{ // open menu form on menu page
    location.href = 'menu.html';
    // menu page has its own form handling
  });

  // initial render
  renderMenuGrid();
  renderCart();
});
// Menu management logic
document.addEventListener("DOMContentLoaded", ()=>{
  let editingMenuId = null;

  function renderMenuTable(){
    const tbody = document.querySelector("#menuTable tbody"); tbody.innerHTML="";
    getMenu().forEach(m=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${m.name}</td><td>${fmt(m.price)}</td><td>${m.stock}</td><td></td>`;
      const actions = tr.querySelector("td:last-child");
      const btnEdit = document.createElement("button"); btnEdit.className="btn blue"; btnEdit.textContent="Edit"; btnEdit.addEventListener("click", ()=>{ showMenuForm(m); });
      const btnDel = document.createElement("button"); btnDel.className="btn red"; btnDel.textContent="Hapus"; btnDel.addEventListener("click", ()=>{ if(confirm("Hapus menu ini?")){ const list = getMenu().filter(x=>x.id!==m.id); setMenu(list); renderMenuTable(); }} );
      actions.appendChild(btnEdit); actions.appendChild(document.createTextNode(" ")); actions.appendChild(btnDel);
      tbody.appendChild(tr);
    });
  }

  function showMenuForm(m){
    document.getElementById("menuFormWrap").hidden=false;
    document.getElementById("mName").value = m?.name||"";
    document.getElementById("mPrice").value = m?.price||"";
    document.getElementById("mStock").value = m?.stock||"";
    document.getElementById("mCategory").value = m?.category||"Tekwan";
    editingMenuId = m?.id||null;
  }

  document.getElementById("btnAddMenu").addEventListener("click", ()=> showMenuForm(null));
  document.getElementById("cancelMenu").addEventListener("click", ()=>{ document.getElementById("menuFormWrap").hidden=true; editingMenuId=null; });

  document.getElementById("saveMenu").addEventListener("click", ()=>{
    const name = document.getElementById("mName").value.trim(); const price = Number(document.getElementById("mPrice").value||0); const stock = Number(document.getElementById("mStock").value||0); const cat = document.getElementById("mCategory").value;
    if(!name || price<=0){ alert("Nama dan harga harus diisi dengan benar."); return; }
    const menu = getMenu();
    if(editingMenuId){
      const idx = menu.findIndex(x=>x.id===editingMenuId); if(idx>=0){ menu[idx].name=name; menu[idx].price=price; menu[idx].stock=stock; menu[idx].category=cat; }
    } else { const id = Date.now(); menu.push({id,name,price,stock,category:cat}); }
    setMenu(menu); renderMenuTable(); document.getElementById("menuFormWrap").hidden=true;
  });

  document.getElementById("btnReloadMenu").addEventListener("click", ()=>{ if(confirm("Reset menu ke data awal?")){ localStorage.removeItem("pos_menu_v1"); loadOrInit(); renderMenuTable(); }} );

  // initial
  renderMenuTable();
});

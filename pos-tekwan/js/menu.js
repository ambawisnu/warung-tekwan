// Menu management logic
document.addEventListener("DOMContentLoaded", async ()=>{
  let editingMenuId = null;
  let menu = await getMenu();

  async function renderMenuTable(){
    const tbody = document.querySelector("#menuTable tbody"); tbody.innerHTML="";
    menu.forEach(m=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${m.name}</td><td>${fmt(m.price)}</td><td>${m.stock}</td><td></td>`;
      const actions = tr.querySelector("td:last-child");
      const btnEdit = document.createElement("button"); btnEdit.className="btn blue"; btnEdit.textContent="Edit"; btnEdit.addEventListener("click", ()=>{ showMenuForm(m); });
      const btnDel = document.createElement("button"); btnDel.className="btn red"; btnDel.textContent="Hapus"; btnDel.addEventListener("click", async ()=>{ if(confirm("Hapus menu ini?")){ await deleteMenu(m.id); menu = await getMenu(); renderMenuTable(); }} );
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

  document.getElementById("saveMenu").addEventListener("click", async ()=>{
    const name = document.getElementById("mName").value.trim(); const price = Number(document.getElementById("mPrice").value||0); const stock = Number(document.getElementById("mStock").value||0); const cat = document.getElementById("mCategory").value;
    if(!name || price<=0){ alert("Nama dan harga harus diisi dengan benar."); return; }
    if(editingMenuId){
      const item = {id: editingMenuId, name, price, stock, category: cat};
      await updateMenu(item);
    } else {
      await addMenu({name, price, stock, category: cat});
    }
    menu = await getMenu();
    renderMenuTable();
    document.getElementById("menuFormWrap").hidden=true;
  });

  // initial
  renderMenuTable();
});

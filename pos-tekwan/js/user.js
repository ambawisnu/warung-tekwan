// User management logic
document.addEventListener("DOMContentLoaded", ()=>{
  let editingUserId = null;

  function renderUsers(){
    const tbody = document.querySelector("#usersTable tbody"); tbody.innerHTML="";
    getUsers().forEach(u=>{
      const tr = document.createElement("tr"); tr.innerHTML = `<td>${u.username}</td><td>${u.name}</td><td>${u.role}</td><td></td>`;
      const actions = tr.querySelector("td:last-child");
      const btnEdit = document.createElement("button"); btnEdit.className="btn blue"; btnEdit.textContent="Edit"; btnEdit.addEventListener("click", ()=>{ showUserForm(u); });
      const btnDel = document.createElement("button"); btnDel.className="btn red"; btnDel.textContent="Hapus"; btnDel.addEventListener("click", ()=>{ if(confirm("Hapus pengguna ini?")){ setUsers(getUsers().filter(x=>x.id!==u.id)); renderUsers(); }} );
      actions.appendChild(btnEdit); actions.appendChild(document.createTextNode(" ")); actions.appendChild(btnDel);
      tbody.appendChild(tr);
    });
  }

  function showUserForm(u){ document.getElementById("userForm").hidden=false; document.getElementById("uUsername").value=u?.username||""; document.getElementById("uName").value=u?.name||""; document.getElementById("uRole").value=u?.role||"kasir"; editingUserId=u?.id||null; }

  document.getElementById("btnAddUser").addEventListener("click", ()=> showUserForm(null));
  document.getElementById("cancelUser").addEventListener("click", ()=>{ document.getElementById("userForm").hidden=true; editingUserId=null; });

  document.getElementById("saveUser").addEventListener("click", ()=>{
    const username = document.getElementById("uUsername").value.trim(); const name = document.getElementById("uName").value.trim(); const role = document.getElementById("uRole").value;
    if(!username || !name){ alert("Username dan nama harus diisi"); return; }
    const users = getUsers();
    if(editingUserId){ const idx = users.findIndex(x=>x.id===editingUserId); if(idx>=0){ users[idx].username=username; users[idx].name=name; users[idx].role=role; } }
    else { users.push({id:Date.now(),username,name,role}); }
    setUsers(users); renderUsers(); document.getElementById("userForm").hidden=true;
  });

  // initial
  renderUsers();
});

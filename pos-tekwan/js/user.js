// User management logic
document.addEventListener("DOMContentLoaded", async ()=>{
  let editingUserId = null;
  let users = await getUsers();

  async function renderUsers(){
    const tbody = document.querySelector("#usersTable tbody"); tbody.innerHTML="";
    users.forEach(u=>{
      const tr = document.createElement("tr"); tr.innerHTML = `<td>${u.username}</td><td>${u.name}</td><td>${u.role}</td><td></td>`;
      const actions = tr.querySelector("td:last-child");
      const btnEdit = document.createElement("button"); btnEdit.className="btn blue"; btnEdit.textContent="Edit"; btnEdit.addEventListener("click", ()=>{ showUserForm(u); });
      const btnDel = document.createElement("button"); btnDel.className="btn red"; btnDel.textContent="Hapus"; btnDel.addEventListener("click", async ()=>{ if(confirm("Hapus pengguna ini?")){ await deleteUser(u.id); users = await getUsers(); renderUsers(); }} );
      actions.appendChild(btnEdit); actions.appendChild(document.createTextNode(" ")); actions.appendChild(btnDel);
      tbody.appendChild(tr);
    });
  }

  function showUserForm(u){ document.getElementById("userForm").hidden=false; document.getElementById("uUsername").value=u?.username||""; document.getElementById("uName").value=u?.name||""; document.getElementById("uPassword").value=""; document.getElementById("uRole").value=u?.role||"kasir"; editingUserId=u?.id||null; }

  document.getElementById("btnAddUser").addEventListener("click", ()=> showUserForm(null));
  document.getElementById("cancelUser").addEventListener("click", ()=>{ document.getElementById("userForm").hidden=true; editingUserId=null; });

  document.getElementById("saveUser").addEventListener("click", async ()=>{
    const username = document.getElementById("uUsername").value.trim(); const name = document.getElementById("uName").value.trim(); const role = document.getElementById("uRole").value; const password = document.getElementById("uPassword").value.trim();
    console.log('Saving user:', {username, name, role, password: password ? '***' : ''});
    if(!username || !name){ alert("Username dan nama harus diisi"); return; }
    if(!editingUserId && !password){ alert("Password harus diisi untuk pengguna baru"); return; }
    try {
      if(editingUserId){
        const user = {id: editingUserId, username, name, role};
        if(password) user.password = password;
        console.log('Updating user:', user);
        await updateUser(user);
      } else {
        console.log('Adding user:', {username, name, role, password});
        await addUser({username, name, role, password});
      }
      users = await getUsers();
      renderUsers();
      document.getElementById("userForm").hidden=true;
      document.getElementById("uPassword").value = ""; // clear password field
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    }
  });

  // initial
  renderUsers();
});

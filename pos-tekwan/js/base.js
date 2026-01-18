// Shared utilities and storage initialization for all pages

// Helper currency formatter
function fmt(v){ return "Rp "+(v?Number(v).toLocaleString("id-ID"):"0"); }

// API base
const API_BASE = 'api/';

// Data accessors
async function getMenu(){
  const res = await fetch(API_BASE + 'menu.php');
  return res.json();
}

async function addMenu(item){
  const res = await fetch(API_BASE + 'menu.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item)
  });
  return res.json();
}

async function updateMenu(item){
  const res = await fetch(API_BASE + 'menu.php', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item)
  });
  return res.json();
}

async function deleteMenu(id){
  const res = await fetch(API_BASE + 'menu.php?id=' + id, {
    method: 'DELETE'
  });
  return res.json();
}

async function getUsers(){
  const res = await fetch(API_BASE + 'users.php');
  return res.json();
}

async function addUser(user){
  const res = await fetch(API_BASE + 'users.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add user');
  }
  return res.json();
}

async function updateUser(user){
  const res = await fetch(API_BASE + 'users.php', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update user');
  }
  return res.json();
}

async function deleteUser(id){
  const res = await fetch(API_BASE + 'users.php?id=' + id, {
    method: 'DELETE'
  });
  return res.json();
}

async function getTx(){
  const res = await fetch(API_BASE + 'transactions.php');
  return res.json();
}

async function addTx(tx){
  const res = await fetch(API_BASE + 'transactions.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(tx)
  });
  return res.json();
}

// Small helper: mark active sidebar entry based on current path
(function markActiveNav(){
  const path = location.pathname.split("/").pop() || "index.php";
  document.querySelectorAll(".nav a").forEach(a=>{
    const href = (a.getAttribute("href")||"").split("/").pop();
    a.classList.toggle("active", href === path);
  });
})();

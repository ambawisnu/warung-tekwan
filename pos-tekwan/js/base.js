// Shared utilities and storage initialization for all pages

// Helper currency formatter
function fmt(v){ return "Rp "+(v?Number(v).toLocaleString("id-ID"):"0"); }

// Local storage keys
const LS_MENU = "pos_menu_v1";
const LS_USERS = "pos_users_v1";
const LS_TX = "pos_tx_v1";

// Default realistic data (menu tekwan)
const defaultMenu = [
  {id:1,name:"Tekwan Original",price:15000,stock:50,category:"Tekwan"},
  {id:2,name:"Tekwan Spesial (Udang)",price:20000,stock:30,category:"Tekwan"},
  {id:3,name:"Tekwan Bakso",price:18000,stock:40,category:"Tekwan"},
  {id:4,name:"Pangsit Goreng",price:12000,stock:60,category:"Lainnya"},
  {id:5,name:"Nasi Tekwan",price:22000,stock:25,category:"Tekwan"},
  {id:6,name:"Es Teh Manis",price:5000,stock:100,category:"Lainnya"},
  {id:7,name:"Kerupuk",price:3000,stock:200,category:"Lainnya"}
];

const defaultUsers = [
  {id:1,username:"admin",name:"Administrator",role:"admin"},
  {id:2,username:"kasir1",name:"Kasir 01",role:"kasir"}
];

const defaultTx = [
  {id:1, date: new Date().toISOString(), items:[{id:1,name:"Tekwan Original",price:15000,qty:2}], subtotal:30000, total:30000}
];

// Initialize storage if empty
function loadOrInit(){
  if(!localStorage.getItem(LS_MENU)) localStorage.setItem(LS_MENU, JSON.stringify(defaultMenu));
  if(!localStorage.getItem(LS_USERS)) localStorage.setItem(LS_USERS, JSON.stringify(defaultUsers));
  if(!localStorage.getItem(LS_TX)) localStorage.setItem(LS_TX, JSON.stringify(defaultTx));
}
loadOrInit();

// Data accessors
function getMenu(){return JSON.parse(localStorage.getItem(LS_MENU) || "[]");}
function setMenu(m){localStorage.setItem(LS_MENU, JSON.stringify(m));}
function getUsers(){return JSON.parse(localStorage.getItem(LS_USERS) || "[]");}
function setUsers(u){localStorage.setItem(LS_USERS, JSON.stringify(u));}
function getTx(){return JSON.parse(localStorage.getItem(LS_TX) || "[]");}
function setTx(t){localStorage.setItem(LS_TX, JSON.stringify(t));}

// Small helper: mark active sidebar entry based on current path
(function markActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a=>{
    const href = (a.getAttribute("href")||"").split("/").pop();
    a.classList.toggle("active", href === path);
  });
})();

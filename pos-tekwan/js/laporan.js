// Reports page logic
document.addEventListener("DOMContentLoaded", async ()=>{
  async function renderReports(from,to){
    const tbody = document.querySelector("#reportTable tbody"); tbody.innerHTML="";
    const tx = await getTx();
    let list = tx.slice();
    if(from) list = list.filter(t=>t.date >= from+" 00:00:00");
    if(to) list = list.filter(t=>t.date <= to+" 23:59:59");
    let omzet = 0; list.forEach(t=>{ omzet+=t.total||0; const tr = document.createElement("tr"); tr.innerHTML = `<td>${new Date(t.date).toLocaleString()}</td><td>${t.items.map(i=>i.name+" x"+i.qty).join(", ")}</td><td>${fmt(t.total)}</td>`; tbody.appendChild(tr); });
    document.getElementById("reportOmzet").textContent = fmt(omzet);
    document.getElementById("reportTrans").textContent = list.length;
  }

  document.getElementById("btnFilterReport").addEventListener("click", async ()=>{ const f=document.getElementById("reportFrom").value; const t=document.getElementById("reportTo").value; await renderReports(f,t); });

  // initial
  await renderReports();
});

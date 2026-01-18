// Dashboard-specific rendering
document.addEventListener("DOMContentLoaded", ()=>{
  function renderDashboard(){
    const tx = getTx();
    const today = new Date().toISOString().slice(0,10);
    const todayTx = tx.filter(t=>t.date.slice(0,10)===today);
    const omzet = todayTx.reduce((s,t)=>s+(t.total||0),0);
    document.getElementById("todayOmzet").textContent = fmt(omzet);
    document.getElementById("todayCount").textContent = todayTx.length;
    // Best seller
    const counts = {};
    tx.flatMap(t=>t.items).forEach(it=>{counts[it.name]=(counts[it.name]||0)+it.qty});
    const best = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById("bestSeller").textContent = best? best[0]+" ("+best[1]+")":"-";
    // week total
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
    const weekTotal = tx.filter(t=>new Date(t.date) >= weekAgo).reduce((s,t)=>s+(t.total||0),0);
    document.getElementById("weekTotal").textContent = fmt(weekTotal);
  }

  renderDashboard();
});

// Dashboard-specific rendering
document.addEventListener("DOMContentLoaded", async ()=>{
  async function renderDashboard(){
    const tx = await getTx();
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

    // Sales chart for last 7 days
    const salesByDay = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      salesByDay[dateStr] = 0;
    }
    tx.forEach(t => {
      const dateStr = t.date.slice(0, 10);
      if (salesByDay.hasOwnProperty(dateStr)) {
        salesByDay[dateStr] += t.total || 0;
      }
    });
    const labels = Object.keys(salesByDay).sort();
    const data = labels.map(date => salesByDay[date]);

    const canvas = document.getElementById('salesChart');
    if (!canvas) {
      console.error('salesChart canvas not found');
      return;
    }
    // Ensure canvas has visible display size
    canvas.style.width = '100%';
    canvas.style.height = '240px';
    const ctx = canvas.getContext('2d');

    // Debug logs to help diagnose blank chart
    console.log('transactions:', tx);
    console.log('labels:', labels);
    console.log('data:', data);

    // Create chart after a short delay to ensure layout is ready
    canvas.style.border = '1px solid rgba(0,0,0,0.04)';
    setTimeout(() => {
      if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        // draw simple fallback text on canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '14px sans-serif';
        ctx.fillText('Grafik tidak tersedia (Chart.js tidak dimuat)', 10, 30);
        return;
      }
      if (canvas._chartInstance) {
        canvas._chartInstance.destroy();
      }
      canvas._chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Penjualan per Hari',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'Rp ' + value.toLocaleString('id-ID');
              }
            }
          }
        }
      }
      });
    }, 60);
  }

  await renderDashboard();
});

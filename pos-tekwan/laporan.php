<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Warung Tekwan Model — Laporan</title>
  <meta name="description" content="POS Warung Tekwan Model — Laporan" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/laporan.css">
</head>
<body>
  <div class="app" id="app">
    <aside class="sidebar">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div class="brand">Warung Tekwan Model</div>
      </div>
      <nav class="nav" id="nav">
        <a href="index.php" data-route="dashboard"><svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zM13 21h8v-8h-8v8zM13 3v8h8V3h-8zM3 21h8v-6H3v6z" fill="#fff"/></svg> Dashboard</a>
        <a href="kasir.php" data-route="kasir"><svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M7 4h10l1 5H6L7 4zM6 10h12v9H6v-9z" fill="#fff"/></svg> Kasir</a>
        <a href="menu.php" data-route="menu"><svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="#fff"/></svg> Manajemen Menu</a>
        <a href="laporan.php" data-route="reports" class="active"><svg class="icon" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm2 6h14v12H5V9z" fill="#fff"/></svg> Laporan</a>
        <a href="user.php" data-route="users"><svg class="icon" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z" fill="#fff"/></svg> Pengguna</a>
      </nav>
      <div style="margin-top:auto;font-size:13px;color:rgba(255,255,255,0.9)">Kasir: <strong>Kasir 01</strong></div>
    </aside>

    <main class="content">
      <div class="topbar">
        <div class="page-title" id="pageTitle">Laporan</div>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="muted">Warung Tekwan Model</div>
        </div>
      </div>

      <section id="page-reports" class="page">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div class="muted">Laporan Penjualan</div>
          <div style="display:flex;gap:8px;align-items:center">
            <input id="reportFrom" class="input" type="date" />
            <input id="reportTo" class="input" type="date" />
            <button class="btn blue" id="btnFilterReport">Filter</button>
          </div>
        </div>

        <div class="card">
          <div class="muted">Ringkasan</div>
          <div style="display:flex;gap:12px;margin-top:8px">
            <div class="card" style="flex:1"><div class="muted">Omzet</div><div class="big-num" id="reportOmzet">Rp 0</div></div>
            <div class="card" style="flex:1"><div class="muted">Transaksi</div><div class="big-num" id="reportTrans">0</div></div>
          </div>
        </div>

        <div style="margin-top:12px" class="card">
          <table id="reportTable"><thead><tr><th>Tanggal</th><th>Items</th><th>Total</th></tr></thead><tbody></tbody></table>
        </div>
      </section>

    </main>
  </div>

  <script src="js/base.js"></script>
  <script src="js/laporan.js"></script>
</body>
</html>

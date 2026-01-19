<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Warung Tekwan Model — Login</title>
  <meta name="description" content="POS Warung Tekwan Model — Login" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/base.css">
  <style>
    body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
    .login-form { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
    .login-form h2 { text-align: center; margin-bottom: 1rem; display:flex; justify-content:center; align-items:center; }
    .input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; }
    .btn { width: 100%; padding: 0.5rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; display:flex; justify-content:center; }
    .btn:hover { background: #0056b3; }
    .error { color: red; text-align: center; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="login-form">
    <h2>Login</h2>
    <?php if (isset($_GET['error'])) echo '<div class="error">Username atau password salah</div>'; ?>
    <form method="post" action="api/login.php">
      <input type="text" name="username" class="input" placeholder="Username" required>
      <input type="password" name="password" class="input" placeholder="Password" required>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
</body>
</html>
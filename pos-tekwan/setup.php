<?php
// Database configuration
$host = 'localhost';
$dbname = 'pos_tekwan';
$username = 'root';
$password = '';

try {
    // Connect without dbname to create it
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Create database if not exists
try {
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8 COLLATE utf8_general_ci");
    echo "Database created or already exists.<br>";
} catch (PDOException $e) {
    die("Error creating database: " . $e->getMessage());
}

// Reconnect with dbname
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create tables
$tables = [
    "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'kasir') NOT NULL
    )",
    "CREATE TABLE IF NOT EXISTS menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        stock INT NOT NULL,
        category VARCHAR(50) NOT NULL
    )",
    "CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATETIME NOT NULL,
        total INT NOT NULL
    )",
    "CREATE TABLE IF NOT EXISTS transaction_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id INT NOT NULL,
        menu_id INT,
        name VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        qty INT NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
    )"
];

foreach ($tables as $sql) {
    try {
        $pdo->exec($sql);
        echo "Table created.<br>";
    } catch (PDOException $e) {
        echo "Error creating table: " . $e->getMessage() . "<br>";
    }
}

// Insert default data
$defaultUsers = [
    ['username' => 'admin', 'name' => 'Administrator', 'role' => 'admin'],
    ['username' => 'kasir1', 'name' => 'Kasir 01', 'role' => 'kasir']
];

$defaultMenu = [
    ['name' => 'Tekwan Original', 'price' => 15000, 'stock' => 50, 'category' => 'Tekwan'],
    ['name' => 'Tekwan Spesial (Udang)', 'price' => 20000, 'stock' => 30, 'category' => 'Tekwan'],
    ['name' => 'Tekwan Bakso', 'price' => 18000, 'stock' => 40, 'category' => 'Tekwan'],
    ['name' => 'Pangsit Goreng', 'price' => 12000, 'stock' => 60, 'category' => 'Lainnya'],
    ['name' => 'Nasi Tekwan', 'price' => 22000, 'stock' => 25, 'category' => 'Tekwan'],
    ['name' => 'Es Teh Manis', 'price' => 5000, 'stock' => 100, 'category' => 'Lainnya'],
    ['name' => 'Kerupuk', 'price' => 3000, 'stock' => 200, 'category' => 'Lainnya']
];

$defaultTx = [
    ['date' => date('Y-m-d H:i:s'), 'total' => 30000, 'items' => [['menu_id' => 1, 'name' => 'Tekwan Original', 'price' => 15000, 'qty' => 2]]]
];

try {
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (username, name, role) VALUES (?, ?, ?)");
    foreach ($defaultUsers as $user) {
        $stmt->execute([$user['username'], $user['name'], $user['role']]);
    }
    echo "Default users inserted.<br>";
} catch (PDOException $e) {
    echo "Error inserting users: " . $e->getMessage() . "<br>";
}

try {
    $stmt = $pdo->prepare("INSERT IGNORE INTO menu (name, price, stock, category) VALUES (?, ?, ?, ?)");
    foreach ($defaultMenu as $item) {
        $stmt->execute([$item['name'], $item['price'], $item['stock'], $item['category']]);
    }
    echo "Default menu inserted.<br>";
} catch (PDOException $e) {
    echo "Error inserting menu: " . $e->getMessage() . "<br>";
}

try {
    $stmtTx = $pdo->prepare("INSERT IGNORE INTO transactions (date, total) VALUES (?, ?)");
    $stmtItem = $pdo->prepare("INSERT IGNORE INTO transaction_items (transaction_id, menu_id, name, price, qty) VALUES (?, ?, ?, ?, ?)");
    foreach ($defaultTx as $tx) {
        $stmtTx->execute([$tx['date'], $tx['total']]);
        $txId = $pdo->lastInsertId();
        foreach ($tx['items'] as $item) {
            $stmtItem->execute([$txId, $item['menu_id'], $item['name'], $item['price'], $item['qty']]);
        }
    }
    echo "Default transaction inserted.<br>";
} catch (PDOException $e) {
    echo "Error inserting transaction: " . $e->getMessage() . "<br>";
}

echo "Setup complete.";
?>
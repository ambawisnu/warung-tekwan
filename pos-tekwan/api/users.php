<?php
header('Content-Type: application/json');
require '../config.php';

session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden: not admin or not logged in', 'session' => $_SESSION]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, username, name, role FROM users ORDER BY id");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['username'], $data['name'], $data['role'], $data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data: missing fields', 'received' => $data]);
            break;
        }
        try {
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username, name, role, password) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['username'], $data['name'], $data['role'], $hashedPassword]);
            echo json_encode(['id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'], $data['username'], $data['name'], $data['role'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        if (isset($data['password']) && !empty($data['password'])) {
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET username=?, name=?, role=?, password=? WHERE id=?");
            $stmt->execute([$data['username'], $data['name'], $data['role'], $hashedPassword, $data['id']]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET username=?, name=?, role=? WHERE id=?");
            $stmt->execute([$data['username'], $data['name'], $data['role'], $data['id']]);
        }
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
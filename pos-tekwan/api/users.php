<?php
header('Content-Type: application/json');
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM users ORDER BY id");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['username'], $data['name'], $data['role'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO users (username, name, role) VALUES (?, ?, ?)");
        $stmt->execute([$data['username'], $data['name'], $data['role']]);
        echo json_encode(['id' => $pdo->lastInsertId()]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'], $data['username'], $data['name'], $data['role'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        $stmt = $pdo->prepare("UPDATE users SET username=?, name=?, role=? WHERE id=?");
        $stmt->execute([$data['username'], $data['name'], $data['role'], $data['id']]);
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
<?php
header('Content-Type: application/json');
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM menu ORDER BY id");
        $menu = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($menu);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['name'], $data['price'], $data['stock'], $data['category'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO menu (name, price, stock, category) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['price'], $data['stock'], $data['category']]);
        echo json_encode(['id' => $pdo->lastInsertId()]);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'], $data['name'], $data['price'], $data['stock'], $data['category'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        $stmt = $pdo->prepare("UPDATE menu SET name=?, price=?, stock=?, category=? WHERE id=?");
        $stmt->execute([$data['name'], $data['price'], $data['stock'], $data['category'], $data['id']]);
        echo json_encode(['success' => true]);
        break;
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM menu WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
<?php
header('Content-Type: application/json');
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM transactions ORDER BY date DESC");
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($transactions as &$tx) {
            $stmtItems = $pdo->prepare("SELECT * FROM transaction_items WHERE transaction_id = ?");
            $stmtItems->execute([$tx['id']]);
            $tx['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($transactions);
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['items'], $data['total'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            break;
        }
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO transactions (date, total) VALUES (NOW(), ?)");
            $stmt->execute([$data['total']]);
            $txId = $pdo->lastInsertId();
            $stmtItem = $pdo->prepare("INSERT INTO transaction_items (transaction_id, menu_id, name, price, qty) VALUES (?, ?, ?, ?, ?)");
            foreach ($data['items'] as $item) {
                $stmtItem->execute([$txId, $item['id'] ?? null, $item['name'], $item['price'], $item['qty']]);
            }
            $pdo->commit();
            echo json_encode(['id' => $txId]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Transaction failed']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
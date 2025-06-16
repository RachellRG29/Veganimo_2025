<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once __DIR__ . '/../../misc/db_config.php';

try {
    $query = new MongoDB\Driver\Query([], ['sort' => ['fecha' => 1]]);
    $cursor = $cliente->executeQuery('Veganimo.ChatComunidad', $query);

    $mensajes = [];
    foreach ($cursor as $doc) {
        $mensajes[] = [
            'mensaje' => $doc->mensaje,
            'autor' => $doc->autor,
            'fecha' => [
                '$date' => $doc->fecha->toDateTime()->format('c') // ISO 8601 (ej: 2025-06-16T13:00:00Z)
            ]
        ];
    }

    echo json_encode($mensajes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>


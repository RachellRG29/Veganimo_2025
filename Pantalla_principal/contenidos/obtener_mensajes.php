<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Devolver JSON

require_once __DIR__ . '/../../misc/db_config.php';

try {
    // Consulta para obtener todos los mensajes ordenados por fecha (más recientes al final)
    $query = new MongoDB\Driver\Query([], [
        'sort' => ['fecha' => 1] // 1 = ascendente
    ]);

    $cursor = $cliente->executeQuery('Veganimo.ChatComunidad', $query);

    $mensajes = [];

    foreach ($cursor as $doc) {
        $mensajes[] = [
            'mensaje' => $doc->mensaje ?? '',
            'autor' => $doc->autor ?? 'Invitado',
            'fecha' => $doc->fecha ?? new MongoDB\BSON\UTCDateTime()
        ];
    }

    echo json_encode($mensajes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

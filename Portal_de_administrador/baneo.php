<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/auth_functions.php';
header('Content-Type: application/json');

// Solo admins pueden banear
checkAdminAccess();

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['_id']) || !isset($data['banned'])) {
        throw new Exception("Datos inválidos");
    }

    // Buscar el usuario primero
    $query = new MongoDB\Driver\Query(
        ['_id' => new MongoDB\BSON\ObjectId($data['_id'])],
        ['limit' => 1]
    );
    $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
    $usuario = current($cursor->toArray());

    if (!$usuario) {
        throw new Exception("Usuario no encontrado");
    }

    // 🚨 Evitar banear administradores
    if (isset($usuario->role) && $usuario->role === 'admin') {
        echo json_encode([
            "success" => false,
            "error"   => "No puedes banear a un administrador"
        ]);
        exit;
    }

    // Actualizar estado de baneo
    $bulk = new MongoDB\Driver\BulkWrite;
    $filter = ['_id' => new MongoDB\BSON\ObjectId($data['_id'])];
    $update = ['$set' => ['banned' => (bool)$data['banned']]];

    $bulk->update($filter, $update);
    $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);

    echo json_encode([
        "success"  => true,
        "modified" => $result->getModifiedCount(),
        "banned"   => (bool)$data['banned']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}

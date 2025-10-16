<?php
require_once __DIR__ . '/../misc/db_config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
    exit;
}

try {
    $query = new MongoDB\Driver\Query(['_id' => new MongoDB\BSON\ObjectId($_SESSION['user_id'])]);
    $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
    $usuario = current($cursor->toArray());

    if (!$usuario) {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "usuario" => [
            "nombre_completo" => $usuario->fullname ?? '',
            "fecha_nacimiento" => $usuario->birthdate ?? '',
            "genero" => $usuario->gender ?? ''
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>
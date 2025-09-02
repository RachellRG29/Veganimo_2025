<?php
session_start();
require_once __DIR__ . '/../misc/db_config.php'; // Configuración de MongoDB
require_once __DIR__ . '/../misc/auth_functions.php';
iniciarSesionSiNoEstaIniciada();

header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "No tienes permiso para actualizar el avatar"
    ]);
    exit;
}

// Validar avatar recibido
$avatar = $_POST['avatar'] ?? '';
if (empty($avatar)) {
    echo json_encode([
        "success" => false,
        "message" => "No se recibió ningún avatar"
    ]);
    exit;
}

// Actualizar avatar en la base de datos
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->update(
    ['_id' => new MongoDB\BSON\ObjectId($_SESSION['user_id'])],
    ['$set' => ['avatar' => $avatar]],
    ['multi' => false, 'upsert' => false]
);

try {
    $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);

    if ($result->getModifiedCount() === 1) {
        echo json_encode([
            "success" => true,
            "message" => "Avatar actualizado correctamente"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se actualizó el avatar"
        ]);
    }
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar el avatar: " . $e->getMessage()
    ]);
}
?>

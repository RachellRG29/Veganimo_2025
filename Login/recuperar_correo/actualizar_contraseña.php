<?php
session_start();
require_once __DIR__ . '/../../misc/db_config.php';

header('Content-Type: application/json');

// Validar sesión y verificación previa
if (!isset($_SESSION['user_data']['email']) || !$_SESSION['recovery_verified']) {
    echo json_encode([
        "success" => false,
        "message" => "No tienes permiso para cambiar la contraseña"
    ]);
    exit;
}

// Validar contraseña nueva
$password = $_POST['password'] ?? '';
if (strlen($password) < 6) {
    echo json_encode([
        "success" => false,
        "message" => "La contraseña debe tener al menos 6 caracteres"
    ]);
    exit;
}

$email = $_SESSION['user_data']['email'];
$hash = password_hash($password, PASSWORD_DEFAULT);

$bulk = new MongoDB\Driver\BulkWrite;
$bulk->update(
    ['email' => $email],
    ['$set' => ['password' => $hash]],
    ['multi' => false, 'upsert' => false]
);

try {
    $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
    session_destroy();
    echo json_encode([
        "success" => true,
        "message" => "Contraseña actualizada correctamente",
        "redirect" => "/Login/login.html"
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al actualizar la contraseña: " . $e->getMessage()
    ]);
}
?>

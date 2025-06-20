<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once __DIR__ . '/../../misc/db_config.php';

header('Content-Type: application/json');

$codigoIngresado = $_POST['verification_code'] ?? '';

// Validar sesión y código
if (!isset($_SESSION['verification_code'], $_SESSION['user_data'])) {
    echo json_encode([
        "success" => false,
        "message" => "No hay sesión de verificación activa",
        "icon" => "error"
    ]);
    exit;
}

if ($codigoIngresado == $_SESSION['verification_code']) {
    // Guardar bandera para permitir el cambio de contraseña
    $_SESSION['recovery_verified'] = true;

    echo json_encode([
        "success" => true,
        "message" => "Código correcto. Puedes cambiar tu contraseña ahora.",
        "icon" => "success",
        "redirect" => "/Login/recuperar_correo/nueva_contraseña.html"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Código de verificación incorrecto",
        "icon" => "error"
    ]);
}
?>


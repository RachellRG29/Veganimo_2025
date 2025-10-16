<?php
session_start();
require_once __DIR__ . '/../../misc/phpmailer_config.php';
require_once __DIR__ . '/../../misc/db_config.php';

header('Content-Type: application/json');

// Obtener email desde la sesión
$email = $_SESSION['user_data']['email'] ?? '';
if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "No se encontró el correo electrónico en la sesión"
    ]);
    exit;
}

// Buscar el usuario por email
$query = new MongoDB\Driver\Query(['email' => $email], ['limit' => 1]);
$cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
$usuario = current($cursor->toArray());

if (!$usuario) {
    echo json_encode([
        "success" => false,
        "message" => "El correo no está registrado"
    ]);
    exit;
}

// Generar código de verificación
$codigo = rand(1000, 9999);
$_SESSION['verification_code'] = $codigo;
$_SESSION['user_data'] = (array)$usuario;
$_SESSION['recovery'] = true;

// Enviar código como tipo 'recuperacion'
$resultado = enviarCodigoVerificacion($email, $codigo, 'recuperacion');

if ($resultado === true) {
    echo json_encode([
        "success" => true,
        "message" => "Hemos enviado un nuevo código a tu correo. Revisa tu bandeja de entrada."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No se pudo enviar el correo: " . $resultado
    ]);
}
?>

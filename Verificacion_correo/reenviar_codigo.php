<?php
session_start();
require_once __DIR__ . '/../misc/phpmailer_config.php';

header('Content-Type: application/json');

// 1. Verificar que el correo esté en la sesión
$email = $_SESSION['user_data']['email'] ?? '';
if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "No hay sesión activa con correo."
    ]);
    exit;
}

// 2. Generar un nuevo código
$codigo = rand(1000, 9999);

// 3. Guardar en la sesión
$_SESSION['verification_code'] = $codigo;

// 4. Enviar el código como tipo 'verificacion'
$resultado = enviarCodigoVerificacion($email, $codigo, 'verificacion');

// 5. Devolver respuesta JSON
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

<?php
session_start();
require_once __DIR__ . '/../../misc/phpmailer_config.php';
require_once __DIR__ . '/../../misc/db_config.php';

header('Content-Type: application/json');

// Validar email
$email = $_POST['email'] ?? '';
if (!$email) {
    echo json_encode([
        "success" => false,
        "message" => "Por favor ingresa tu correo electrónico"
    ]);
    exit;
}

// Buscar usuario por email
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

// Generar código y guardar en sesión
$codigo = rand(1000, 9999);
$_SESSION['verification_code'] = $codigo;
$_SESSION['user_data'] = (array)$usuario;

// Enviar código como tipo 'recuperacion'
$resultado = enviarCodigoVerificacion($email, $codigo, 'recuperacion');

if ($resultado === true) {
    echo json_encode([
        "success" => true,
        "message" => "Hemos enviado un código a tu correo para recuperar tu contraseña."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "No se pudo enviar el correo: " . $resultado
    ]);
}
?>

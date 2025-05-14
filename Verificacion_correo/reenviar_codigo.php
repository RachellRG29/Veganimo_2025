<?php
session_start();
require_once __DIR__ . '/../misc/phpmailer_config.php';

if (!isset($_SESSION['user_data']) || !isset($_SESSION['user_data']['email'])) {
    die("❌ No hay sesión de usuario activa.");
}

$email = $_SESSION['user_data']['email'];

// Generar nuevo código
$nuevoCodigo = rand(1000, 9999);
$_SESSION['verification_code'] = $nuevoCodigo;

// Enviar el nuevo código por correo
$resultado = enviarCodigoVerificacion($email, $nuevoCodigo);

if ($resultado === true) {
    echo "1"; // Éxito
} else {
    echo $resultado; // Mensaje de error
}
?>
<?php
session_start();
require_once __DIR__ . '/../misc/phpmailer_config.php';

$fullname = $_POST['fullname'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';
$gender = $_POST['gender'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($fullname) || empty($birthdate) || empty($gender) || empty($email) || empty($password)) {
    die("❌ Faltan datos del formulario.");
}

$verificationCode = rand(1000, 9999);

// Guardar en la sesión
$_SESSION['verification_code'] = $verificationCode;
$_SESSION['user_data'] = [
    'fullname' => $fullname,
    'birthdate' => $birthdate,
    'gender' => $gender,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'verified' => false,
];

// Enviar el código por correo
$resultadoCorreo = enviarCodigoVerificacion($email, $verificationCode);

if ($resultadoCorreo === true) {
    header("Location: ../Verificacion_correo/verificacion.html");
    exit;
} else {
    echo $resultadoCorreo;
}

?>

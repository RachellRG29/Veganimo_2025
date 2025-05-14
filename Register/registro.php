<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/phpmailer_config.php';
session_start();

// Verificar si es una solicitud de verificación
if (isset($_POST['verification_code'])) {
    $codigoIngresado = $_POST['verification_code'];
    
    if (!isset($_SESSION['verification_code'], $_SESSION['user_data'])) {
        echo json_encode([
            "success" => false,
            "message" => "❌ No hay sesión de verificación activa"
        ]);
        exit;
    }

    if ($codigoIngresado == $_SESSION['verification_code']) {
        // Guardar en la base de datos
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($_SESSION['user_data']);

        try {
            $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
            session_destroy();
            echo json_encode([
                "success" => true,
                "message" => "✅ Cuenta verificada y creada correctamente"
            ]);
        } catch (MongoDB\Driver\Exception\Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "❌ Error al guardar en la base de datos"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "❌ Código de verificación incorrecto"
        ]);
    }
    exit;
}

// Proceso normal de registro (envío de código)
$fullname = $_POST['fullname'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';
$gender = $_POST['gender'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($fullname) || empty($birthdate) || empty($gender) || empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Faltan datos del formulario"
    ]);
    exit;
}

// Verificar si el correo ya existe
$filtro = ['email' => $email];
$query = new MongoDB\Driver\Query($filtro, ['limit' => 1]);
$cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

if (count($cursor->toArray()) > 0) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Este correo ya está registrado"
    ]);
    exit;
}

// Preparar datos del usuario
$userData = [
    'fullname' => $fullname,
    'birthdate' => $birthdate,
    'gender' => $gender,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'verified' => false
];

// Generar código de verificación
$verificationCode = rand(1000, 9999);

// Guardar en sesión
$_SESSION['user_data'] = $userData;
$_SESSION['verification_code'] = $verificationCode;
$_SESSION['verification_email'] = $email;

// Enviar correo
$resultado = enviarCodigoVerificacion($email, $verificationCode);

if ($resultado === true) {
    echo json_encode([
        "success" => true,
        "message" => "📧 Código de verificación enviado a tu correo",
        "redirect" => "/Verificacion_correo/verificacion.html"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al enviar el código de verificación"
    ]);
}
?>
<?php
require_once __DIR__ . '/../misc/db_config.php'; // Configuración de la base de datos
require_once __DIR__ . '/../misc/phpmailer_config.php'; // Configuración de PHPMailer
session_start();

if (strpos($_SERVER['REQUEST_URI'], 'usuarios.php') !== false) {
    require_once __DIR__ . '/../misc/auth_functions.php';
    checkAdminAccess();
}

// Verificar si es una solicitud de verificación
if (isset($_POST['verification_code'])) {
    $codigoIngresado = $_POST['verification_code'];
    
    if (!isset($_SESSION['verification_code'], $_SESSION['user_data'])) {
        echo json_encode([
            "success" => false,
            "message" => "No hay sesión de verificación activa",
            "icon" => "error"
        ]);
        exit;
    }

    if ($codigoIngresado == $_SESSION['verification_code']) {
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($_SESSION['user_data']);

        try {
            $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
            session_destroy();
            echo json_encode([
                "success" => true,
                "message" => "Cuenta verificada y creada correctamente",
                "icon" => "success",
                "redirect" => "/Login/login.html"
            ]);
        } catch (MongoDB\Driver\Exception\Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => "Error al guardar en la base de datos",
                "icon" => "error"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Código de verificación incorrecto",
            "icon" => "error"
        ]);
    }
    exit;
}

// Validación de campos
$requiredFields = ['fullname', 'birthdate', 'gender', 'email', 'password', 'confirm-password'];
foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode([
            "success" => false,
            "message" => "Faltan datos del formulario",
            "icon" => "warning"
        ]);
        exit;
    }
}

// Validar que las contraseñas coincidan
if ($_POST['password'] !== $_POST['confirm-password']) {
    echo json_encode([
        "success" => false,
        "message" => "Las contraseñas no coinciden",
        "icon" => "error"
    ]);
    exit;
}

// Validación de email existente
$email = $_POST['email'];
$filtro = ['email' => $email];
$query = new MongoDB\Driver\Query($filtro, ['limit' => 1]);
$cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

if (count($cursor->toArray()) > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Este correo ya está registrado",
        "icon" => "error"
    ]);
    exit;
}

// Generar código y guardar en sesión
$verificationCode = rand(1000, 9999);
$_SESSION['user_data'] = [
    'fullname' => $_POST['fullname'],
    'birthdate' => $_POST['birthdate'],
    'gender' => $_POST['gender'],
    'email' => $email,
    'password' => password_hash($_POST['password'], PASSWORD_DEFAULT),
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'verified' => false,
    'role' => 'user'
];
$_SESSION['verification_code'] = $verificationCode;

// Enviar correo
try {
    $mailResult = enviarCodigoVerificacion($email, $verificationCode);
    
    if ($mailResult === true) {
        echo json_encode([
            "success" => true,
            "message" => "Código de verificación enviado a tu correo. Serás redirigido para validarlo",
            "icon" => "success",
            "redirect" => "/Verificacion_correo/verificacion.html"
        ]);
    } else {
        throw new Exception("Error al enviar el correo: " . $mailResult);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error al enviar el código de verificación: " . $e->getMessage(),
        "icon" => "error"
    ]);
}
?>
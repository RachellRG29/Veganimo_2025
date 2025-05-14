<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');

// Obtener datos del POST
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validación básica
if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Debes ingresar el correo y la contraseña"
    ]);
    exit;
}

$baseDatos = 'Veganimo';
$coleccion = 'Usuarios';

try {
    // Buscar usuario por email
    $filtro = ['email' => $email];
    $query = new MongoDB\Driver\Query($filtro, ['limit' => 1]);
    $cursor = $cliente->executeQuery("$baseDatos.$coleccion", $query);
    $usuario = current($cursor->toArray());

    if (!$usuario) {
        echo json_encode([
            "success" => false,
            "message" => "❌ Correo no registrado"
        ]);
        exit;
    }

    // Verificar contraseña
    if (!password_verify($password, $usuario->password)) {
        echo json_encode([
            "success" => false,
            "message" => "❌ Contraseña incorrecta"
        ]);
        exit;
    }

    // Iniciar sesión (aquí puedes agregar más lógica de sesión)
    session_start();
    $_SESSION['user_id'] = (string)$usuario->_id;
    $_SESSION['email'] = $usuario->email;
    $_SESSION['fullname'] = $usuario->fullname;

    echo json_encode([
        "success" => true,
        "message" => "✅ Sesión iniciada correctamente. Redirigiendo..."
    ]);
    
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error en el servidor: " . $e->getMessage()
    ]);
}
?>
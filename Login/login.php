<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');
session_start();

// Validación básica
if (empty($_POST['email']) || empty($_POST['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Debes ingresar el correo y la contraseña",
        "icon" => "warning"
    ]);
    exit;
}

try {
    // Buscar usuario
    $query = new MongoDB\Driver\Query(['email' => $_POST['email']], ['limit' => 1]);
    $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
    $usuario = current($cursor->toArray());

    if (!$usuario) {
        echo json_encode([
            "success" => false,
            "message" => "Correo no registrado",
            "icon" => "error"
        ]);
        exit;
    }

    // Verificar contraseña
    if (!password_verify($_POST['password'], $usuario->password)) {
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta",
            "icon" => "error"
        ]);
        exit;
    }

    // Configurar sesión
    $nombreParts = preg_split('/\s+/', trim($usuario->fullname));
    $nombreMostrar = $nombreParts[0] . (isset($nombreParts[1]) ? ' ' . $nombreParts[1] : '');
    
    $_SESSION['user_id'] = (string)$usuario->_id;
    $_SESSION['email'] = $usuario->email;
    $_SESSION['display_name'] = $nombreMostrar;
    $_SESSION['user_role'] = $usuario->role ?? 'user';

    echo json_encode([
        "success" => true,
        "message" => "Sesión iniciada correctamente",
        "icon" => "success",
        "redirect" => "/Pantalla_principal/index_pantalla_principal.html",
        "display_name" => $nombreMostrar
    ]);
    
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor",
        "icon" => "error"
    ]);
}
?>
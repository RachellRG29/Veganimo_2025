<?php
session_start();
require_once __DIR__ . '/../misc/db_config.php';

$codigoIngresado = $_POST['verification_code'] ?? '';

if (!isset($_SESSION['verification_code'], $_SESSION['user_data'])) {
    echo json_encode([
        "success" => false,
        "message" => "No hay sesión de verificación activa",
        "icon" => "error"
    ]);
    exit;
}

if ($codigoIngresado == $_SESSION['verification_code']) {
    // Modificar los datos del usuario para incluir verified=true
    $userData = $_SESSION['user_data'];
    $userData['verified'] = true; // Añadir esta línea para marcar como verificado
    
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert($userData); // Insertar los datos modificados

    try {
        $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
        session_destroy();
        echo json_encode([
            "success" => true,
            "message" => "Cuenta verificada exitosamente",
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
?>
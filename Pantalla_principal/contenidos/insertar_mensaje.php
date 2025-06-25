<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once __DIR__ . '/../../misc/db_config.php';

session_start();

// Obtener datos
$mensaje = isset($_POST['mensaje']) ? htmlspecialchars(trim($_POST['mensaje']), ENT_QUOTES, 'UTF-8') : '';
$autor = isset($_SESSION['display_name']) ? $_SESSION['display_name'] : 'Usuario Invitado';
$fecha = new MongoDB\BSON\UTCDateTime();

$imagen_url = null;

// Procesar imagen si viene adjunta
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $nombreOriginal = basename($_FILES['imagen']['name']);
    $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));

    $extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($extension, $extensionesPermitidas)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de imagen no permitido']);
        exit;
    }

    // Crear carpeta si no existe
    $carpetaDestino = __DIR__ . '/uploads/';
    if (!file_exists($carpetaDestino)) {
        mkdir($carpetaDestino, 0755, true);
    }

    // Guardar imagen
    $nombreFinal = uniqid('img_') . '.' . $extension;
    $rutaCompleta = $carpetaDestino . $nombreFinal;
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaCompleta)) {
        $imagen_url = '/Pantalla_principal/contenidos/uploads/' . $nombreFinal;
    }
}

// Crear documento
$documento = [
    'mensaje' => $mensaje,
    'autor'   => $autor,
    'fecha'   => $fecha
];

if ($imagen_url) {
    $documento['imagen_url'] = $imagen_url;
}

try {
    $bulk = new MongoDB\Driver\BulkWrite();
    $bulk->insert($documento);
    $cliente->executeBulkWrite('Veganimo.ChatComunidad', $bulk);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

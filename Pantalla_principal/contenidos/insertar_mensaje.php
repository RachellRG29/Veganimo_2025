<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once __DIR__ . '/../../misc/db_config.php';

session_start();
$mensaje = htmlspecialchars(trim($_POST['mensaje']), ENT_QUOTES, 'UTF-8');
$autor = isset($_SESSION['display_name']) ? $_SESSION['display_name'] : 'Usuario Invitado';
$fecha = new MongoDB\BSON\UTCDateTime();

$documento = [
    'mensaje' => $mensaje,
    'autor' => $autor,
    'fecha' => $fecha
];

try {
    $bulk = new MongoDB\Driver\BulkWrite();
    $bulk->insert($documento);
    $cliente->executeBulkWrite('Veganimo.ChatComunidad', $bulk);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

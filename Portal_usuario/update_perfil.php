<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../misc/db_config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "❌ No hay sesión de usuario activa",
        "icon" => "error"
    ]);
    exit;
}

// Obtener tipo de edición
$tipo = $_POST['tipo'] ?? '';
if (!$tipo) {
    echo json_encode([
        "success" => false,
        "message" => "❌ No se especificó el tipo de edición",
        "icon" => "error"
    ]);
    exit;
}

// Construir el array de actualización según el tipo
$updateFields = [];

switch ($tipo) {
    case 'clinica':
        $updateFields['patologicos'] = $_POST['patologicos'] ?? [];
        $updateFields['familiares'] = $_POST['familiares'] ?? [];
        $updateFields['quirurgicos'] = $_POST['quirurgicos'] ?? [];
        break;

    case 'afecciones':
        $updateFields['intolerancias'] = $_POST['intolerancias'] ?? [];
        $updateFields['alergias'] = $_POST['alergias'] ?? [];
        break;

    case 'sintomas':
        $updateFields['sintomas'] = $_POST['sintomas'] ?? [];
        break;

    default:
        echo json_encode([
            "success" => false,
            "message" => "❌ Tipo de edición no reconocido",
            "icon" => "error"
        ]);
        exit;
}

// Agregar fecha de actualización
$updateFields['fecha_actualizacion'] = new MongoDB\BSON\UTCDateTime();

try {
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->update(
        ['user_id' => $_SESSION['user_id']],  // filtro por usuario
        ['$set' => $updateFields],            // solo actualizar estos campos
        ['multi' => false, 'upsert' => false] // no crear nuevo documento
    );

    $result = $cliente->executeBulkWrite('Veganimo.Perfil_nutricional', $bulk);

    // Retornar los campos actualizados para actualizar JS sin perder los demás
    echo json_encode([
        "success" => true,
        "message" => "✅ Se actualizó correctamente",
        "icon" => "success",
        "actualizado" => $updateFields
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al actualizar en la base de datos: " . $e->getMessage(),
        "icon" => "error"
    ]);
}
?>

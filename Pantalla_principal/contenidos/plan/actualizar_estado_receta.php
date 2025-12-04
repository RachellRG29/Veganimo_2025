<?php
require_once __DIR__ . '/../../misc/db_config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "⚠️ No hay sesión activa"]);
    exit;
}

// Recibir datos
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['plan_id']) || !isset($input['tipo_comida'])) {
    echo json_encode(["success" => false, "message" => "❌ Datos incompletos"]);
    exit;
}

$planId = $input['plan_id'];
$tipoComida = $input['tipo_comida'];
$completada = $input['completada'] ?? true;

try {
    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión MongoDB no inicializada");
    }

    // Actualizar el estado de la receta
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->update(
        ['_id' => new MongoDB\BSON\ObjectId($planId)],
        ['$set' => [
            "completadas.$tipoComida" => $completada,
            "metadatos.ultima_actualizacion" => new MongoDB\BSON\UTCDateTime(time() * 1000)
        ]]
    );
    
    $result = $cliente->executeBulkWrite('Veganimo.Planes_Dieta', $bulk);

    echo json_encode([
        "success" => true,
        "message" => "✅ Estado actualizado correctamente"
    ]);

} catch (Throwable $e) {
    error_log("Error actualizando estado: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Error al actualizar el estado: " . $e->getMessage()
    ]);
}
?>
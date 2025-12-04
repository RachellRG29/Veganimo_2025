<?php
// guardar_plan_mongo.php
require_once __DIR__ . '/../../../../misc/db_config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "⚠️ No hay sesión activa"]);
    exit;
}

// Recibir datos
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['recetas'])) {
    echo json_encode(["success" => false, "message" => "❌ Datos incompletos"]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión MongoDB no inicializada");
    }

    // Preparar documento para MongoDB
    $documento = [
        'user_id' => $userId,
        'fecha_generacion' => new MongoDB\BSON\UTCDateTime(time() * 1000),
        'fecha_inicio' => new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000),
        'analisis' => $input['analisis'] ?? '',
        'recetas' => [
            'desayuno' => $input['recetas']['desayuno'] ?? [],
            'almuerzo' => $input['recetas']['almuerzo'] ?? [],
            'cena' => $input['recetas']['cena'] ?? []
        ],
        'completadas' => [
            'desayuno' => false,
            'almuerzo' => false,
            'cena' => false
        ],
        'estado' => 'activo',
        'metadatos' => [
            'fuente' => $input['metadatos']['fuente'] ?? 'deepseek_ia',
            'version' => $input['metadatos']['version'] ?? '1.0',
            'ultima_actualizacion' => new MongoDB\BSON\UTCDateTime(time() * 1000)
        ]
    ];

    // Insertar en MongoDB
    $bulk = new MongoDB\Driver\BulkWrite;
    $insertedId = $bulk->insert($documento);
    
    $result = $cliente->executeBulkWrite('Veganimo.Planes_Dieta', $bulk);

    echo json_encode([
        "success" => true,
        "plan_id" => (string)$insertedId,
        "message" => "✅ Plan guardado en MongoDB correctamente"
    ]);

} catch (Throwable $e) {
    error_log("Error guardando plan MongoDB: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Error al guardar el plan: " . $e->getMessage()
    ]);
}
?>
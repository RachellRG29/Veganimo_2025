<?php
// /Pantalla_principal/contenidos/dieta_vegana/IA/guardar_plan_mongo.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../../../../misc/db_config.php';

session_start();
header('Content-Type: application/json');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
    exit;
}

// Recibir datos
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['plan'])) {
    echo json_encode([
        "success" => false, 
        "message" => "Datos incompletos. Recibido: " . json_encode($input)
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Verificar conexión MongoDB
    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión MongoDB no disponible. Cliente: " . gettype($cliente));
    }

    // Preparar el documento
    $documento = [
        'user_id' => $userId,
        'fecha_generacion' => new MongoDB\BSON\UTCDateTime(),
        'fecha_inicio' => new MongoDB\BSON\UTCDateTime(strtotime('today') * 1000),
        'analisis' => $input['analisis'] ?? '',
        'recetas' => [
            'desayuno' => (array)($input['plan']['desayuno'] ?? []),
            'almuerzo' => (array)($input['plan']['almuerzo'] ?? []),
            'cena' => (array)($input['plan']['cena'] ?? [])
        ],
        'completadas' => [
            'desayuno' => false,
            'almuerzo' => false,
            'cena' => false
        ],
        'estado' => 'activo',
        'tipo' => 'ia_personalizado',
        'metadatos' => [
            'fuente' => 'deepseek_ia',
            'version' => '1.0',
            'ultima_actualizacion' => new MongoDB\BSON\UTCDateTime()
        ]
    ];

    // Insertar
    $bulk = new MongoDB\Driver\BulkWrite;
    $id = $bulk->insert($documento);
    
    $result = $cliente->executeBulkWrite('Veganimo.Planes_Dieta', $bulk);

    echo json_encode([
        "success" => true,
        "plan_id" => (string)$id,
        "message" => "Plan guardado en MongoDB"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}
?>
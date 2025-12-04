<?php
require_once __DIR__ . '/../../misc/db_config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "⚠️ No hay sesión activa"]);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión MongoDB no inicializada");
    }

    // Buscar el plan activo más reciente del usuario
    $filter = [
        'user_id' => $userId,
        'estado' => 'activo'
    ];
    
    $options = [
        'sort' => ['fecha_generacion' => -1],
        'limit' => 1
    ];

    $query = new MongoDB\Driver\Query($filter, $options);
    $cursor = $cliente->executeQuery('Veganimo.Planes_Dieta', $query);
    $plan = current($cursor->toArray());

    if (!$plan) {
        echo json_encode([
            "success" => true,
            "tiene_plan" => false,
            "message" => "No hay plan activo"
        ]);
        exit;
    }

    // Convertir a array
    $planArray = json_decode(json_encode($plan), true);
    
    // Formatear fechas
    if (isset($planArray['fecha_generacion']['$date'])) {
        $planArray['fecha_generacion'] = date('Y-m-d H:i:s', strtotime($planArray['fecha_generacion']['$date']));
    }
    
    if (isset($planArray['fecha_inicio']['$date'])) {
        $planArray['fecha_inicio'] = date('Y-m-d', strtotime($planArray['fecha_inicio']['$date']));
    }

    echo json_encode([
        "success" => true,
        "tiene_plan" => true,
        "plan" => $planArray,
        "recetas" => [
            'desayuno' => $planArray['recetas']['desayuno'] ?? null,
            'almuerzo' => $planArray['recetas']['almuerzo'] ?? null,
            'cena' => $planArray['recetas']['cena'] ?? null
        ]
    ]);

} catch (Throwable $e) {
    error_log("Error obteniendo plan: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Error al obtener el plan: " . $e->getMessage(),
        "tiene_plan" => false
    ]);
}
?>
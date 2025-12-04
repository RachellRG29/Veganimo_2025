<?php
header('Content-Type: application/json');

// Cargar config DB
require_once __DIR__ . '/../../../../misc/db_config.php';



$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['plan']) || !isset($input['analisis'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos para guardar el plan'
    ]);
    exit;
}

$plan = $input['plan'];
$analisis = $input['analisis'];

// ID del usuario desde sesión
session_start();
$usuario_id = $_SESSION['id_usuario'] ?? null;

if (!$usuario_id) {
    echo json_encode([
        'success' => false,
        'message' => 'No hay usuario en sesión.'
    ]);
    exit;
}

try {
    // GUARDAR EL PLAN PRINCIPAL
    $stmt = $conn->prepare("
        INSERT INTO planes_ia (usuario_id, analisis)
        VALUES (?, ?)
    ");
    $stmt->bind_param("is", $usuario_id, $analisis);
    $stmt->execute();

    $plan_id = $stmt->insert_id;
    $stmt->close();

    // GUARDAR LAS 3 RECETAS (desayuno, almuerzo, cena)
    $sqlReceta = $conn->prepare("
        INSERT INTO recetas_ia_plan (plan_id, tipo, nombre, calorias, hora, explicacion, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    foreach (['desayuno', 'almuerzo', 'cena'] as $tipo) {
        if (!isset($plan[$tipo])) continue;

        $r = $plan[$tipo];

        $nombre = $r['nombre'] ?? '';
        $cal = $r['calorias'] ?? '';
        $hora = $r['hora'] ?? '';
        $exp = $r['explicacion'] ?? '';
        $img = $r['imagen'] ?? '';

        $sqlReceta->bind_param(
            "issssss",
            $plan_id,
            $tipo,
            $nombre,
            $cal,
            $hora,
            $exp,
            $img
        );

        $sqlReceta->execute();
    }

    $sqlReceta->close();

    echo json_encode([
        'success' => true,
        'plan_id' => $plan_id
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Error al guardar el plan: " . $e->getMessage()
    ]);
}

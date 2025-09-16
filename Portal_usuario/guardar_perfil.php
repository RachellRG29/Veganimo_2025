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

// Validar datos del formulario
$nombre_completo = $_POST['nombre_completo'] ?? '';
$fecha_nacimiento = $_POST['fecha_nacimiento'] ?? '';
$genero = $_POST['genero'] ?? '';
$dieta_actual = $_POST['dieta_actual'] ?? '';
$peso = $_POST['peso'] ?? '';
$altura = $_POST['altura'] ?? '';
$objetivo = $_POST['objetivo'] ?? '';
$nivel_meta = $_POST['nivel_meta'] ?? '';
$descripcion_dieta = $_POST['descripcion_dieta'] ?? '';

// Arrays de checkbox
$patologicos = $_POST['patologicos'] ?? [];
$familiares = $_POST['familiares'] ?? [];
$quirurgicos = $_POST['quirurgicos'] ?? [];
$intolerancias = $_POST['intolerancias'] ?? [];
$alergias = $_POST['alergias'] ?? [];
$sintomas = $_POST['sintomas'] ?? [];

// Validaciones omitidas por brevedad (igual que las tuyas)

// *** Aquí la validación para perfil existente ***

try {
    // Buscar si ya existe un perfil para este usuario
    $query = new MongoDB\Driver\Query(['user_id' => $_SESSION['user_id']]);
    $cursor = $cliente->executeQuery('Veganimo.Perfil_nutricional', $query);
    $perfilExistente = current($cursor->toArray());

    if ($perfilExistente) {
        // Ya existe perfil: enviamos error con clave "existe"
        echo json_encode([
            "success" => false,
            "existe" => true,
            "message" => "❌ Error, perfil de usuario existente",
            "icon" => "error"
        ]);
        exit;
    }
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al consultar la base de datos: " . $e->getMessage(),
        "icon" => "error"
    ]);
    exit;
}

// Si no existe perfil, insertamos el nuevo
$documento = [
    'user_id' => $_SESSION['user_id'], // Relacionar con el usuario
    'nombre_completo' => $nombre_completo,
    'fecha_nacimiento' => $fecha_nacimiento,
    'genero' => $genero,
    'dieta_actual' => $dieta_actual,
    'peso' => (float)$peso,
    'altura' => (float)$altura,
    'objetivo' => $objetivo,
    'nivel_meta' => $nivel_meta,
    'descripcion_dieta' => $descripcion_dieta,
    'patologicos' => $patologicos,
    'familiares' => $familiares,
    'quirurgicos' => $quirurgicos,
    'intolerancias' => $intolerancias,
    'alergias' => $alergias,
    'sintomas' => $sintomas,
    'fecha_creacion' => new MongoDB\BSON\UTCDateTime()
];

try {
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert($documento);

    $cliente->executeBulkWrite("Veganimo.Perfil_nutricional", $bulk);

    echo json_encode([
        "success" => true,
        "message" => "✅ Perfil nutricional guardado exitosamente.",
        "icon" => "success"
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al guardar en la base de datos: " . $e->getMessage(),
        "icon" => "error"
    ]);
}
?>

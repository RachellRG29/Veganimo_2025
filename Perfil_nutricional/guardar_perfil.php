<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../misc/db_config.php';

// Iniciar sesión para obtener el ID del usuario
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

// Validar sección nutricional obligatoria
$camposNutricionales = ['dieta_actual', 'peso', 'altura', 'objetivo', 'nivel_meta'];
foreach ($camposNutricionales as $campo) {
    if (empty($_POST[$campo])) {
        echo json_encode([
            "success" => false,
            "message" => "⚠️ Debes completar todos los campos obligatorios de la sección nutricional",
            "icon" => "warning"
        ]);
        exit;
    }
}

// Validar campos obligatorios
if (
    empty($dieta_actual) ||
    empty($peso) ||
    empty($altura) ||
    empty($objetivo) ||
    empty($nivel_meta)
) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Faltan datos esenciales del formulario.",
        "icon" => "warning"
    ]);
    exit;
}

// Validar que peso y altura sean numéricos
// Validación numérica mejorada
if (!is_numeric($peso) || $peso <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ El peso debe ser un número válido mayor a 0",
        "icon" => "warning",
        "error_field" => "peso"
    ]);
    exit;
}

if (!is_numeric($altura) || $altura <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ La altura debe ser un número válido mayor a 0",
        "icon" => "warning",
        "error_field" => "altura"
    ]);
    exit;
}

// Crear documento para MongoDB
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
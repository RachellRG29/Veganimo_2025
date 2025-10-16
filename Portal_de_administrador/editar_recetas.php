<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');

// Leer JSON enviado desde JS
$input = json_decode(file_get_contents('php://input'), true);

$idReceta = $input['_id'] ?? '';
if (empty($idReceta)) {
    echo json_encode([
        "success" => false,
        "message" => "❌ No se proporcionó el ID de la receta.",
        "icon" => "error"
    ]);
    exit;
}

// Leer campos enviados desde SweetAlert
$nombreReceta = $input['nombre_receta'] ?? '';
$descripcion = $input['descripcion'] ?? '';
$tiempo = $input['tiempo_preparacion'] ?? '';
$dificultad = $input['dificultad'] ?? '';
$ingredientes = $input['ingredientes'] ?? [];
$categoria = $input['categoria'] ?? '';
$calificacion = intval($input['calificacion'] ?? 0);

// Validar campos esenciales
if (
    empty($nombreReceta) ||
    empty($descripcion) ||
    empty($tiempo) ||
    empty($dificultad) ||
    empty($categoria) ||
    empty($ingredientes)
) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Faltan datos esenciales del formulario.",
        "icon" => "warning"
    ]);
    exit;
}

try {
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->update(
        ['_id' => new MongoDB\BSON\ObjectId($idReceta)],
        ['$set' => [
            'nombre_receta' => $nombreReceta,
            'descripcion' => $descripcion,
            'tiempo_preparacion' => $tiempo,
            'dificultad' => $dificultad,
            'ingredientes' => $ingredientes, // guardamos array
            'categoria' => $categoria,
            'calificaciones' => [$calificacion] // guardamos array
        ]]
    );

    $cliente->executeBulkWrite("Veganimo.Recetas", $bulk);

    echo json_encode([
        "success" => true,
        "message" => "✅ Receta actualizada exitosamente.",
        "icon" => "success"
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al actualizar la base de datos: " . $e->getMessage(),
        "icon" => "error"
    ]);
}
?>

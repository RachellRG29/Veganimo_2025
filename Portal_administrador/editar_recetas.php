<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');

// Verificar que se envíe el ID de la receta
$idReceta = $_POST['_id'] ?? '';
if (empty($idReceta)) {
    echo json_encode([
        "success" => false,
        "message" => "❌ No se proporcionó el ID de la receta.",
        "icon" => "error"
    ]);
    exit;
}

// Validar datos esenciales
$nombreReceta = $_POST['name-receta'] ?? '';
$descripcion = $_POST['description-receta'] ?? '';
$tiempo = $_POST['time-receta'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$ingredientes = $_POST['ingredientes'] ?? [];
$pasos = $_POST['pasos'] ?? [];
$categoria = $_POST['categoria-receta'] ?? '';
$calificacion = $_POST['star-radio'] ?? [];

// Filtrar calificaciones válidas
$calificacionFiltrada = array_filter($calificacion, fn($v) => in_array($v, ['1','2','3','4','5']));

// Procesar imagen principal (opcional)
$directorioDestino = __DIR__ . '/../uploads/';
$imagenReceta = $_POST['imagen_actual'] ?? ''; // Mantener imagen anterior si no se sube nueva
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombreArchivo = uniqid('receta_') . '.' . $extension;
    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        $imagenReceta = '/uploads/' . $nombreArchivo;
    }
}

// Procesar imágenes de pasos
$pasosCompletos = [];
$imagenesPasos = $_FILES['imagen-paso'] ?? [];
foreach ($pasos as $index => $textoPaso) {
    $pasoData = ['texto' => $textoPaso, 'imagen' => $_POST['pasos_imagenes'][$index] ?? ''];
    if (isset($imagenesPasos['tmp_name'][$index]) && $imagenesPasos['error'][$index] === UPLOAD_ERR_OK) {
        $extension = pathinfo($imagenesPasos['name'][$index], PATHINFO_EXTENSION);
        $nombreArchivoPaso = uniqid('paso_' . $index . '_') . '.' . $extension;
        $rutaDestinoPaso = $directorioDestino . $nombreArchivoPaso;
        if (move_uploaded_file($imagenesPasos['tmp_name'][$index], $rutaDestinoPaso)) {
            $pasoData['imagen'] = '/uploads/' . $nombreArchivoPaso;
        }
    }
    $pasosCompletos[] = $pasoData;
}

// Validar campos obligatorios mínimos
if (
    empty($nombreReceta) ||
    empty($descripcion) ||
    empty($tiempo) ||
    empty($dificultad) ||
    empty($categoria) ||
    empty($ingredientes) ||
    empty($pasosCompletos)
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
            'ingredientes' => $ingredientes,
            'pasos' => $pasosCompletos,
            'imagen' => $imagenReceta,
            'categoria' => $categoria,
            'calificaciones' => array_map('intval', $calificacionFiltrada)
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

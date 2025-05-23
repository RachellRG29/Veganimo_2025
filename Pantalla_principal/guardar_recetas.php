<?php
require_once __DIR__ . '/../misc/db_config.php';

$nombreReceta = $_POST['name-receta'] ?? '';
$descripcion = $_POST['description-receta'] ?? '';
$tiempo = $_POST['time-receta'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$ingredientes = $_POST['ingredientes'] ?? [];
$pasos = $_POST['pasos'] ?? [];

if (empty($nombreReceta) || empty($descripcion) || empty($tiempo) || empty($dificultad)) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos esenciales del formulario.",
        "icon" => "warning"
    ]);
    exit;
}

// Imagen principal
$imagenReceta = '';
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $directorioDestino = __DIR__ . '/../uploads/';
    $nombreArchivo = basename($_FILES['imagen']['name']);
    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        $imagenReceta = '/uploads/' . $nombreArchivo;
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error al subir la imagen.",
            "icon" => "error"
        ]);
        exit;
    }
}

// Imágenes de pasos
$imagenesPasos = [];
if (isset($_FILES['imagen-paso']) && is_array($_FILES['imagen-paso']['tmp_name'])) {
    foreach ($_FILES['imagen-paso']['tmp_name'] as $key => $tmp_name) {
        if ($_FILES['imagen-paso']['error'][$key] === UPLOAD_ERR_OK) {
            $nombreArchivoPaso = uniqid('paso_') . '_' . basename($_FILES['imagen-paso']['name'][$key]);
            $rutaDestinoPaso = $directorioDestino . $nombreArchivoPaso;

            if (move_uploaded_file($tmp_name, $rutaDestinoPaso)) {
                $imagenesPasos[] = '/uploads/' . $nombreArchivoPaso;
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Error al subir una imagen de paso.",
                    "icon" => "error"
                ]);
                exit;
            }
        }
    }
}

$documento = [
    'nombre_receta' => $nombreReceta,
    'descripcion' => $descripcion,
    'tiempo_preparacion' => $tiempo,
    'dificultad' => $dificultad,
    'ingredientes' => $ingredientes,
    'pasos' => $pasos,
    'imagen' => $imagenReceta,
    'imagenes_pasos' => $imagenesPasos,
    'fecha_creacion' => new MongoDB\BSON\UTCDateTime()
];

$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert($documento);

try {
    $cliente->executeBulkWrite("Veganimo.Recetas", $bulk);
    echo json_encode([
        "success" => true,
        "message" => "✅ Receta guardada exitosamente.",
        "icon" => "success"
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al guardar en la base de datos.",
        "icon" => "error"
    ]);
}
?>

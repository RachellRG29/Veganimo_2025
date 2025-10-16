<?php
require_once __DIR__ . '/../misc/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
    exit;
}

$id = $_GET['id'];
$nombreReceta = $_POST['name-receta'] ?? '';
$descripcion = $_POST['description-receta'] ?? '';
$tiempo = $_POST['time-receta'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$ingredientes = $_POST['ingredientes'] ?? [];
$pasos = $_POST['pasos'] ?? [];

// Validar campos obligatorios
if (empty($nombreReceta) || empty($descripcion) || empty($tiempo) || empty($dificultad)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Faltan datos esenciales del formulario']);
    exit;
}

// Procesar la imagen principal si se subió una nueva
$imagenReceta = null;
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $directorioDestino = __DIR__ . '/../uploads/';
    $nombreArchivo = basename($_FILES['imagen']['name']);
    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        $imagenReceta = '/uploads/' . $nombreArchivo;
    }
}

// Procesar imágenes de pasos
$imagenesPasos = [];
if (isset($_FILES['imagen-paso']) && is_array($_FILES['imagen-paso']['tmp_name'])) {
    $directorioDestino = __DIR__ . '/../uploads/';
    $contador = 0;

    foreach ($_FILES['imagen-paso']['tmp_name'] as $key => $tmp_name) {
        if ($_FILES['imagen-paso']['error'][$key] === UPLOAD_ERR_OK) {
            $nombreArchivoPaso = uniqid('paso_') . '_' . $contador . '_' . basename($_FILES['imagen-paso']['name'][$key]);
            $rutaDestinoPaso = $directorioDestino . $nombreArchivoPaso;

            if (move_uploaded_file($tmp_name, $rutaDestinoPaso)) {
                $imagenesPasos[] = '/uploads/' . $nombreArchivoPaso;
            }
            $contador++;
        }
    }
}

// Preparar el documento de actualización
$documento = [
    'nombre_receta' => $nombreReceta,
    'descripcion' => $descripcion,
    'tiempo_preparacion' => $tiempo,
    'dificultad' => $dificultad,
    'ingredientes' => $ingredientes,
    'pasos' => $pasos,
    'fecha_actualizacion' => new MongoDB\BSON\UTCDateTime()
];

// Si hay nueva imagen principal, agregarla al documento
if ($imagenReceta) {
    $documento['imagen'] = $imagenReceta;
}

// Si hay nuevas imágenes de pasos, agregarlas al documento
if (!empty($imagenesPasos)) {
    $documento['imagenes_pasos'] = $imagenesPasos;
}

try {
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->update(
        ['_id' => new MongoDB\BSON\ObjectId($id)],
        ['$set' => $documento]
    );

    $cliente->executeBulkWrite('Veganimo.Recetas', $bulk);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
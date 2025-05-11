<?php
require_once __DIR__ . '/../misc/db_config.php';

// Capturar datos del formulario
$nombreReceta = $_POST['name-receta'] ?? '';
$descripcion = $_POST['description-receta'] ?? '';
$tiempo = $_POST['time-receta'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$ingredientes = $_POST['ingredientes'] ?? [];
$pasos = $_POST['pasos'] ?? [];

// Procesar la imagen
$imagenReceta = '';
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $directorioDestino = __DIR__ . '/../uploads/';  // Asegúrate de que esta carpeta exista en tu proyecto
    $nombreArchivo = basename($_FILES['imagen']['name']);
    $rutaDestino = $directorioDestino . $nombreArchivo;

    // Mover la imagen a la carpeta de destino
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        // Obtener la URL pública de la imagen (en tu caso local)
        $imagenReceta = '/uploads/' . $nombreArchivo;  // Esto es relativo al servidor local
    } else {
        die("❌ Error al subir la imagen.");
    }
}

// Procesar las imágenes del paso
$imagenesPasos = [];  // Para almacenar las imágenes de los pasos
if (isset($_FILES['imagen-paso']) && is_array($_FILES['imagen-paso']['tmp_name'])) {
    $directorioDestino = __DIR__ . '/../uploads/';
    $contador = 0;

    // Recorrer todos los archivos en el array de imágenes de los pasos
    foreach ($_FILES['imagen-paso']['tmp_name'] as $key => $tmp_name) {
        if ($_FILES['imagen-paso']['error'][$key] === UPLOAD_ERR_OK) {
            $nombreArchivoPaso = uniqid('paso_') . '_' . $contador . '_' . basename($_FILES['imagen-paso']['name'][$key]);
            $rutaDestinoPaso = $directorioDestino . $nombreArchivoPaso;

            if (move_uploaded_file($tmp_name, $rutaDestinoPaso)) {
                // Guardar el path de la imagen en el array
                $imagenesPasos[] = '/uploads/' . $nombreArchivoPaso;
            } else {
                die("❌ Error al subir una de las imágenes del paso.");
            }
            $contador++;
        }
    }
}

// Validar campos obligatorios
if (empty($nombreReceta) || empty($descripcion) || empty($tiempo) || empty($dificultad)) {
    die("❌ Faltan datos esenciales del formulario.");
}

// Armar documento para guardar
$documento = [
    'nombre_receta' => $nombreReceta,
    'descripcion' => $descripcion,
    'tiempo_preparacion' => $tiempo,
    'dificultad' => $dificultad,
    'ingredientes' => $ingredientes,
    'pasos' => $pasos,
    'imagen' => $imagenReceta,
    'imagenes_pasos' => $imagenesPasos,  // Aquí guardamos todas las imágenes de los pasos
    'fecha_creacion' => new MongoDB\BSON\UTCDateTime()
];

// Preparar inserción
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert($documento);

// Base de datos y colección
$baseDatos = 'Veganimo';
$coleccion = 'Recetas';

try {
    $cliente->executeBulkWrite("$baseDatos.$coleccion", $bulk);
    echo "✅ Receta guardada exitosamente.";
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "❌ Error al guardar: " . $e->getMessage();
}
?>
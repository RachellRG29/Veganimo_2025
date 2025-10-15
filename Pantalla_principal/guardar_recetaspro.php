<?php
session_start(); // ✅ Necesario para obtener datos del usuario logueado
require_once __DIR__ . '/../misc/db_config.php';

// Verificar si el directorio de uploads existe, si no, crearlo
$directorioDestino = __DIR__ . '/../uploads/';
if (!file_exists($directorioDestino)) {
    mkdir($directorioDestino, 0777, true);
}

// ✅ Obtener nombre y correo del usuario desde la sesión
$nombre_usuario = $_SESSION['display_name'] ?? 'Desconocido';
  // o $_SESSION['nombre'] según tu sistema
$email_usuario  = $_SESSION['email'] ?? null;

// Validar datos esenciales del formulario
$nombreReceta = $_POST['name-receta'] ?? '';
$tipo_receta = $_POST['tipo_receta'] ?? '';
$descripcion = $_POST['description-receta'] ?? '';
$tiempo = $_POST['time-receta'] ?? '';
$valor_nutricional = $_POST['valor_nutricional'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$ingredientes = $_POST['ingredientes'] ?? [];
$pasos = $_POST['pasos'] ?? [];
$categoria = $_POST['categoria-receta'] ?? '';
$calificacion = $_POST['star-radio'] ?? []; // Array de estrellas seleccionadas

// Filtrar las calificaciones válidas (1 a 5)
$calificacionFiltrada = array_filter($calificacion, fn($valor) => in_array($valor, ['1', '2', '3', '4', '5']));

// Procesar imagen principal
$imagenReceta = '';
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $nombreArchivo = uniqid('receta_') . '.' . $extension;
    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        $imagenReceta = '/uploads/' . $nombreArchivo;
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error al subir la imagen principal.",
            "icon" => "error"
        ]);
        exit;
    }
}

// Procesar imágenes de pasos
$pasosCompletos = [];
$imagenesPasos = $_FILES['imagen-paso'] ?? [];

foreach ($pasos as $index => $textoPaso) {
    $pasoData = ['texto' => $textoPaso, 'imagen' => ''];

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

// Validar campos obligatorios
$ingredientes = (array)$ingredientes;
$pasos = (array)$pasos;
$calificacionFiltrada = (array)$calificacionFiltrada;

if (
    trim($nombreReceta) === '' ||
    trim($descripcion) === '' ||
    trim($tiempo) === '' ||
    trim($dificultad) === '' ||
    trim($imagenReceta) === '' ||
    trim($categoria) === '' ||
    count(array_filter($ingredientes, 'strlen')) === 0 ||
    count(array_filter($pasos, 'strlen')) === 0 ||
    count($calificacionFiltrada) === 0
) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Faltan datos esenciales del formulario. Verifica que todos los campos estén completos.",
        "icon" => "warning"
    ]);
    exit;
}

// Crear documento MongoDB con datos del usuario
$documento = [
    'nombre_receta' => $nombreReceta,
    'tipo_receta' => $tipo_receta,
    'descripcion' => $descripcion,
    'tiempo_preparacion' => $tiempo,
    'valor_nutricional' => (float)$valor_nutricional,
    'dificultad' => $dificultad,
    'ingredientes' => $ingredientes,
    'pasos' => $pasosCompletos,
    'imagen' => $imagenReceta,
    'categoria' => $categoria,
    'calificaciones' => array_map('intval', $calificacionFiltrada),
    'fecha_creacion' => new MongoDB\BSON\UTCDateTime(),
    'estado' => 'Pendiente',
    
    // ✅ Datos del usuario que envía la solicitud
    'nombre_usuario' => $nombre_usuario,
    'email_usuario' => $email_usuario
];

try {
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert($documento);
    
    $cliente->executeBulkWrite("Veganimo.SolicitudReceta", $bulk);
    
    echo json_encode([
        "success" => true,
        "message" => "Solicitud de receta enviada correctamente.",
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

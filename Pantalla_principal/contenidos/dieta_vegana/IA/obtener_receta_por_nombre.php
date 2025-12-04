<?php
require_once __DIR__ . '/../../misc/db_config.php';


header('Content-Type: application/json');

try {
    // Leer el cuerpo del POST (nombre de receta)
    $input = json_decode(file_get_contents("php://input"), true);
    $nombre = $input['nombre'] ?? '';

    if (empty($nombre)) {
        echo json_encode(["success" => false, "message" => "No se proporcionó el nombre de la receta."]);
        exit;
    }

    // Buscar por nombre de receta
    $filtro = ['nombre_receta' => $nombre];
    $query = new MongoDB\Driver\Query($filtro);
    $cursor = $cliente->executeQuery("Veganimo.Recetas", $query);
    $doc = current($cursor->toArray());

    if (!$doc) {
        echo json_encode(["success" => false, "message" => "No se encontró la receta especificada."]);
        exit;
    }

    // Procesar pasos
    $pasos = [];
    if (isset($doc->pasos) && is_iterable($doc->pasos)) {
        foreach ($doc->pasos as $paso) {
            $pasos[] = [
                'texto' => $paso->texto ?? '',
                'imagen' => $paso->imagen ?? ''
            ];
        }
    }

    // Calcular calificación promedio
    $calificacion = 0;
    if (isset($doc->calificaciones) && is_array($doc->calificaciones) && count($doc->calificaciones) > 0) {
        $calificacion = array_sum($doc->calificaciones) / count($doc->calificaciones);
    }

    $receta = [
        '_id' => (string)$doc->_id,
        'nombre_receta' => $doc->nombre_receta ?? '',
        'descripcion' => $doc->descripcion ?? 'Sin descripción.',
        'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png',
        'tiempo_preparacion' => $doc->tiempo_preparacion ?? '',
        'dificultad' => $doc->dificultad ?? '',
        'categoria' => $doc->categoria ?? '',
        'tipo_receta' => $doc->tipo_receta ?? '',
        'ingredientes' => isset($doc->ingredientes) && is_iterable($doc->ingredientes)
            ? iterator_to_array($doc->ingredientes)
            : [],
        'pasos' => $pasos,
        'calificacion' => round($calificacion, 1)
    ];

    echo json_encode(["success" => true, "receta" => $receta], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>

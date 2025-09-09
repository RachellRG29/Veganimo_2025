<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Ordenar por fecha de creación descendente
    $query = new MongoDB\Driver\Query([], ['sort' => ['fecha_creacion' => -1]]);
    $cursor = $cliente->executeQuery('Veganimo.Recetas', $query);

    $recetas = [];

    foreach ($cursor as $doc) {
        // Formatear pasos
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

        // Formatear fecha de creación
        $fecha_creacion = isset($doc->fecha_creacion) && $doc->fecha_creacion instanceof MongoDB\BSON\UTCDateTime
            ? $doc->fecha_creacion->toDateTime()->format('Y-m-d H:i:s')
            : date('Y-m-d H:i:s');

        // Armar receta completa
        $recetas[] = [
            '_id' => (string)$doc->_id,
            'nombre_receta' => $doc->nombre_receta ?? 'Sin nombre',
            'descripcion' => $doc->descripcion ?? 'Sin descripción',
            'tiempo_preparacion' => $doc->tiempo_preparacion ?? 'No especificado',
            'dificultad' => $doc->dificultad ?? 'No especificada',
            'categoria' => $doc->categoria ?? '',
            'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png',
            'ingredientes' => isset($doc->ingredientes) && is_iterable($doc->ingredientes)
                ? iterator_to_array($doc->ingredientes)
                : [],
            'pasos' => $pasos,
            'calificacion' => $calificacion,
            'fecha_creacion' => $fecha_creacion,
            'autor' => $doc->autor ?? 'Anónimo'
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $recetas,
        'count' => count($recetas)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

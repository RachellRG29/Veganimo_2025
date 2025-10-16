<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Obtener todas las solicitudes ordenadas por fecha de creación descendente
    $query = new MongoDB\Driver\Query([], ['sort' => ['fecha_creacion' => -1]]);
    $cursor = $cliente->executeQuery('Veganimo.SolicitudReceta', $query);

    $solicitudes = [];

    foreach ($cursor as $doc) {
        // ---------------------------
        // PASOS
        // ---------------------------
        $pasos = [];
        if (!empty($doc->pasos) && is_iterable($doc->pasos)) {
            foreach ($doc->pasos as $paso) {
                $pasos[] = [
                    'texto' => $paso->texto ?? '',
                    'imagen' => $paso->imagen ?? ''
                ];
            }
        }

        // ---------------------------
        // CALIFICACIONES
        // ---------------------------
        $calificacionesArray = [];
        $promedio = 0;
        if (!empty($doc->calificaciones) && is_iterable($doc->calificaciones)) {
            foreach ($doc->calificaciones as $cal) {
                $calificacionesArray[] = floatval($cal);
            }

            // Calculamos el promedio
            if (count($calificacionesArray) > 0) {
                $promedio = round(array_sum($calificacionesArray) / count($calificacionesArray), 1);
            }
        }

        // ---------------------------
        // INGREDIENTES
        // ---------------------------
        $ingredientesArray = [];
        if (!empty($doc->ingredientes) && is_iterable($doc->ingredientes)) {
            foreach ($doc->ingredientes as $ing) {
                $ingredientesArray[] = (string)$ing;
            }
        }
        $ingredientesTexto = !empty($ingredientesArray) ? implode(', ', $ingredientesArray) : 'No especificados';

        // ---------------------------
        // FECHA DE CREACIÓN
        // ---------------------------
        $fecha_creacion = isset($doc->fecha_creacion) && $doc->fecha_creacion instanceof MongoDB\BSON\UTCDateTime
            ? $doc->fecha_creacion->toDateTime()->format('Y-m-d H:i:s')
            : date('Y-m-d H:i:s');

        // ---------------------------
        // ESTADO
        // ---------------------------
        $estado = $doc->estado ?? 'Pendiente';

        // ---------------------------
        // ARMAR OBJETO FINAL
        // ---------------------------
                $solicitudes[] = [
                '_id' => (string)$doc->_id,
                'nombre_receta' => $doc->nombre_receta ?? 'Sin nombre',
                'descripcion' => $doc->descripcion ?? 'Sin descripción',
                'tiempo_preparacion' => $doc->tiempo_preparacion ?? 'No especificado',
                'valor_nutricional' => $doc->valor_nutricional ?? '',
                'dificultad' => $doc->dificultad ?? 'No especificada',
                'categoria' => $doc->categoria ?? '',
                'tipo_receta' => $doc->tipo_receta ?? '',
                'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png',
                'ingredientes' => $ingredientesTexto,
                'ingredientes_array' => $ingredientesArray,
                'pasos' => $pasos,
                'fecha_creacion' => $fecha_creacion,
                'calificaciones' => $calificacionesArray,
                'calificacion_promedio' => $promedio,
                'nombre_usuario' => $doc->nombre_usuario ?? 'Desconocido',
                'email_usuario'  => $doc->email_usuario ?? 'No registrado',

                // ACCIONES CRUD
                'acciones' => [
                    'ver' => '<button class="btn-ver" data-id="' . (string)$doc->_id . '">Ver</button>',
                    'aprobar' => '<button class="btn-aprobar" data-id="' . (string)$doc->_id . '">Aprobar</button>',
                    'rechazar' => '<button class="btn-rechazar" data-id="' . (string)$doc->_id . '">Rechazar</button>'
                ]
            ];

    }

    // ---------------------------
    // RESPUESTA FINAL
    // ---------------------------
    echo json_encode([
        'success' => true,
        'data' => $solicitudes,
        'count' => count($solicitudes)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

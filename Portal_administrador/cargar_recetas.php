<?php
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Obtener todas las recetas ordenadas por fecha de creación descendente
    $query = new MongoDB\Driver\Query([], ['sort' => ['fecha_creacion' => -1]]);
    $cursor = $cliente->executeQuery('Veganimo.Recetas', $query);

    $recetas = [];

    foreach ($cursor as $doc) {
        // Pasos
        $pasos = [];
        if (!empty($doc->pasos) && is_iterable($doc->pasos)) {
            foreach ($doc->pasos as $paso) {
                $pasos[] = [
                    'texto' => $paso->texto ?? '',
                    'imagen' => $paso->imagen ?? ''
                ];
            }
        }

        // Ingredientes
        $ingredientesArray = [];
        if (!empty($doc->ingredientes) && is_iterable($doc->ingredientes)) {
            foreach ($doc->ingredientes as $ing) {
                $ingredientesArray[] = (string)$ing;
            }
        }
        $ingredientesTexto = !empty($ingredientesArray) ? implode(', ', $ingredientesArray) : 'No especificados';

        // Calificación promedio
        $calificacion = 0;
        if (!empty($doc->calificaciones) && is_iterable($doc->calificaciones)) {
            $suma = 0;
            $count = 0;
            foreach ($doc->calificaciones as $c) {
                $suma += intval($c);
                $count++;
            }
            if ($count > 0) $calificacion = round($suma / $count);
        }

        // Fecha de creación
        $fecha_creacion = isset($doc->fecha_creacion) && $doc->fecha_creacion instanceof MongoDB\BSON\UTCDateTime
            ? $doc->fecha_creacion->toDateTime()->format('Y-m-d H:i:s')
            : date('Y-m-d H:i:s');

        // Armar objeto de receta
        $recetas[] = [
            '_id' => (string)$doc->_id,
            'nombre_receta' => $doc->nombre_receta ?? 'Sin nombre',
            'descripcion' => $doc->descripcion ?? 'Sin descripción',
            'tiempo_preparacion' => $doc->tiempo_preparacion ?? 'No especificado',
            'dificultad' => $doc->dificultad ?? 'No especificada',
            'categoria' => $doc->categoria ?? '',
            'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png',
            'ingredientes' => $ingredientesTexto,      // Para mostrar en la tabla
            'ingredientes_array' => $ingredientesArray, // Para edición
            'pasos' => $pasos,
            'calificacion' => $calificacion,
            'fecha_creacion' => $fecha_creacion
           
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

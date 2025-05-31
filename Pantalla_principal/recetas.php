<?php
require_once __DIR__ . '/../misc/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Ordenar por fecha de creación descendente
    $query = new MongoDB\Driver\Query([], [
        'sort' => ['fecha_creacion' => -1]
    ]);
    
    $cursor = $cliente->executeQuery('Veganimo.Recetas', $query);

    $recetas = [];
    foreach ($cursor as $documento) {
        $receta = (array)$documento;
        
        // Formatear los datos para la respuesta
        $recetaFormateada = [
            '_id' => (string)$receta['_id'],
            'nombre_receta' => $receta['nombre_receta'] ?? 'Sin nombre',
            'descripcion' => $receta['descripcion'] ?? 'Sin descripción',
            'tiempo_preparacion' => $receta['tiempo_preparacion'] ?? 'No especificado',
            'dificultad' => $receta['dificultad'] ?? 'No especificada',
            'imagen' => $receta['imagen'] ?? '',
            'fecha_creacion' => isset($receta['fecha_creacion']) 
                ? $receta['fecha_creacion']->toDateTime()->format('Y-m-d H:i:s') 
                : date('Y-m-d H:i:s')
        ];
        
        $recetas[] = $recetaFormateada;
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
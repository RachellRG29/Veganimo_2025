<?php
require_once __DIR__ . '/../misc/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $query = new MongoDB\Driver\Query([]);
    $cursor = $cliente->executeQuery('Veganimo.Recetas', $query);

    $recetas = [];
    foreach ($cursor as $documento) {
        $receta = (array)$documento;
        
        // Asegurarse de que todos los campos necesarios existan
        $receta['_id'] = (string)$receta['_id'];
        $receta['nombre_receta'] = $receta['nombre_receta'] ?? 'Sin nombre';
        $receta['descripcion'] = $receta['descripcion'] ?? 'Sin descripción';
        $receta['ingredientes'] = $receta['ingredientes'] ?? [];
        $receta['pasos'] = $receta['pasos'] ?? [];
        $receta['tiempo_preparacion'] = $receta['tiempo_preparacion'] ?? 'No especificado';
        $receta['dificultad'] = $receta['dificultad'] ?? 'No especificada';
        $receta['fecha_creacion'] = isset($receta['fecha_creacion']) 
            ? $receta['fecha_creacion']->toDateTime()->format('c') 
            : (new DateTime())->format('c');
        
        $recetas[] = $receta;
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
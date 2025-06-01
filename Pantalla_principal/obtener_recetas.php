<?php
require_once __DIR__ . '/../misc/db_config.php';

header('Content-Type: application/json');

try {
    $manager = $cliente;
    $query = new MongoDB\Driver\Query([]);
    $cursor = $manager->executeQuery("Veganimo.Recetas", $query);

    $recetas = [];

    foreach ($cursor as $doc) {
        // 📝 Preparar pasos
        $pasos = [];
        if (isset($doc->pasos) && is_iterable($doc->pasos)) {
            foreach ($doc->pasos as $paso) {
                $pasos[] = [
                    'texto' => $paso->texto ?? '',
                    'imagen' => $paso->imagen ?? ''
                ];
            }
        }

        // 📊 Calcular calificación
        $calificacion = 0;
        if (isset($doc->calificaciones) && is_array($doc->calificaciones) && count($doc->calificaciones) > 0) {
            $calificacion = array_sum($doc->calificaciones) / count($doc->calificaciones);
        }

        $recetas[] = [
            'nombre_receta' => $doc->nombre_receta ?? '',
            'descripcion' => $doc->descripcion ?? '',
            'tiempo_preparacion' => $doc->tiempo_preparacion ?? '',
            'dificultad' => $doc->dificultad ?? '',
            'categoria' => $doc->categoria ?? '',
            'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png',
            'ingredientes' => isset($doc->ingredientes) && is_iterable($doc->ingredientes)
                ? iterator_to_array($doc->ingredientes)
                : [],
            'pasos' => $pasos,
            'calificacion' => $calificacion
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $recetas
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>

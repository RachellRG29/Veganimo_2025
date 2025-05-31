<?php
require_once __DIR__ . '/../misc/db_config.php'; // Asegúrate de tener conexión $cliente a MongoDB

header('Content-Type: application/json');

try {
    $manager = $cliente;
    $query = new MongoDB\Driver\Query([]);
    $cursor = $manager->executeQuery("Veganimo.Recetas", $query);

    $recetas = [];

    foreach ($cursor as $doc) {
        $recetas[] = [
            'nombre_receta' => $doc->nombre_receta ?? '',
            'descripcion' => $doc->descripcion ?? '',
            'tiempo_preparacion' => $doc->tiempo_preparacion ?? '',
            'dificultad' => $doc->dificultad ?? '',
            'imagen' => $doc->imagen ?? '/Images/img_sinperfilusuario.png'
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

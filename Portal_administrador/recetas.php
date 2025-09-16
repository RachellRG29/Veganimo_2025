<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/auth_functions.php';
header('Content-Type: application/json');

checkAdminAccess();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) throw new Exception("ID de receta no proporcionado");

        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete(['_id' => new MongoDB\BSON\ObjectId($id)], ['limit' => 1]);
        $result = $cliente->executeBulkWrite('Veganimo.Recetas', $bulk);

        echo json_encode([
            'success' => true,
            'deleted' => $result->getDeletedCount()
        ]);

    } elseif ($method === 'PATCH') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['_id'])) throw new Exception("ID de receta no proporcionado");

        $updateFields = [];

        if (isset($data['nombre_receta'])) $updateFields['nombre_receta'] = $data['nombre_receta'];
        if (isset($data['descripcion'])) $updateFields['descripcion'] = $data['descripcion'];
        if (isset($data['tiempo_preparacion'])) $updateFields['tiempo_preparacion'] = $data['tiempo_preparacion'];
        if (isset($data['dificultad'])) $updateFields['dificultad'] = $data['dificultad'];
        if (isset($data['categoria'])) $updateFields['categoria'] = $data['categoria'];
        if (isset($data['ingredientes']) && is_array($data['ingredientes'])) $updateFields['ingredientes'] = $data['ingredientes'];
        if (isset($data['calificacion'])) {
            // Guardamos calificación como array para mantener consistencia
            $cal = intval($data['calificacion']);
            $updateFields['calificaciones'] = [$cal];
        }

        if (empty($updateFields)) throw new Exception("No hay campos válidos para actualizar");

        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->update(
            ['_id' => new MongoDB\BSON\ObjectId($data['_id'])],
            ['$set' => $updateFields]
        );
        $result = $cliente->executeBulkWrite('Veganimo.Recetas', $bulk);

        echo json_encode([
            'success' => true,
            'modified' => $result->getModifiedCount()
        ]);

    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

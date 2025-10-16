<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/auth_functions.php';
header('Content-Type: application/json');

checkAdminAccess();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'DELETE') {
        // 🗑️ Eliminar directamente (rechazo manual)
        $id = $_GET['id'] ?? null;
        if (!$id) throw new Exception("ID de solicitud no proporcionado");

        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete(['_id' => new MongoDB\BSON\ObjectId($id)], ['limit' => 1]);
        $result = $cliente->executeBulkWrite('Veganimo.SolicitudReceta', $bulk);

        echo json_encode([
            'success' => true,
            'deleted' => $result->getDeletedCount()
        ]);

    } elseif ($method === 'PATCH') {
        // ✏️ Aprobar o Rechazar
        $data = json_decode(file_get_contents("php://input"), true);
        if (empty($data['_id'])) throw new Exception("ID de solicitud no proporcionado");

        $idObj = new MongoDB\BSON\ObjectId($data['_id']);

        // Si es rechazar, borrar de solicitudes
        if (isset($data['estado']) && $data['estado'] === 'Rechazada') {
            $bulk = new MongoDB\Driver\BulkWrite;
            $bulk->delete(['_id' => $idObj], ['limit' => 1]);
            $result = $cliente->executeBulkWrite('Veganimo.SolicitudReceta', $bulk);

            echo json_encode([
                'success' => true,
                'deleted' => $result->getDeletedCount()
            ]);
            exit;
        }

        // Si es aprobar
        if (isset($data['estado']) && $data['estado'] === 'Aprobada') {
            // Buscar solicitud
            $query = new MongoDB\Driver\Query(['_id' => $idObj]);
            $cursor = $cliente->executeQuery('Veganimo.SolicitudReceta', $query);
            $solicitudArray = $cursor->toArray();
            $solicitud = !empty($solicitudArray) ? $solicitudArray[0] : null;

            if ($solicitud) {
                // Insertar en Recetas
                $bulkInsert = new MongoDB\Driver\BulkWrite;
                $bulkInsert->insert([
                    'nombre_receta' => $solicitud->nombre_receta ?? '',
                    'descripcion' => $solicitud->descripcion ?? '',
                    'tiempo_preparacion' => $solicitud->tiempo_preparacion ?? '',
                    'dificultad' => $solicitud->dificultad ?? '',
                    'categoria' => $solicitud->categoria ?? '',
                    'tipo_receta' => $solicitud->tipo_receta ?? '',
                    'imagen' => $solicitud->imagen ?? '/Images/img_sinperfilusuario.png',
                    'ingredientes' => $solicitud->ingredientes ?? [],
                    'pasos' => $solicitud->pasos ?? [],
                    'calificaciones' => $solicitud->calificaciones ?? [],
                    'fecha_creacion' => new MongoDB\BSON\UTCDateTime()
                ]);
                $cliente->executeBulkWrite('Veganimo.Recetas', $bulkInsert);

                // ⚡ Borrar de SolicitudReceta
                $bulkDelete = new MongoDB\Driver\BulkWrite;
                $bulkDelete->delete(['_id' => $idObj], ['limit' => 1]);
                $cliente->executeBulkWrite('Veganimo.SolicitudReceta', $bulkDelete);
            }

            echo json_encode([
                'success' => true,
                'moved' => true
            ]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Estado no válido']);
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

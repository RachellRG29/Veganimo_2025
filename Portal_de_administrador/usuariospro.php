<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json; charset=utf-8');

try {
    $metodo = $_SERVER['REQUEST_METHOD'];

    // =========================
    // ELIMINAR USUARIO PRO (solo Perfil_nutricional)
    // =========================
    if ($metodo === 'DELETE') {
        if (empty($_GET['id'])) {
            throw new Exception("Falta ID de usuario");
        }

        $id = new MongoDB\BSON\ObjectId($_GET['id']);

        // Eliminar únicamente de Perfil_nutricional
        $bulk = new MongoDB\Driver\BulkWrite();
        $bulk->delete(['_id' => $id]);
        $result = $cliente->executeBulkWrite("Veganimo.Perfil_nutricional", $bulk);

        echo json_encode([
            "success" => true,
            "deletedCount" => $result->getDeletedCount()
        ]);
        exit;
    }

    // =========================
    // LISTAR USUARIOS PRO
    // =========================
    $query = new MongoDB\Driver\Query([]);
    $cursor = $cliente->executeQuery("Veganimo.Perfil_nutricional", $query);

    $usuarios = [];
    foreach ($cursor as $doc) {
        $usuario = (array) $doc;

        $usuario_id = null;
        $email = 'No disponible';
        $banned = false;
        $role = 'user';

        if (!empty($usuario['user_id'])) {
            $usuario_id = (string) $usuario['user_id'];

            $queryUsuario = new MongoDB\Driver\Query(['_id' => new MongoDB\BSON\ObjectId($usuario['user_id'])]);
            $resultadoUsuario = $cliente->executeQuery("Veganimo.Usuarios", $queryUsuario);
            $arrayUsuario = iterator_to_array($resultadoUsuario);

            if (!empty($arrayUsuario)) {
                $userObj = $arrayUsuario[0];
                $email = $userObj->email ?? 'No disponible';
                $banned = $userObj->banned ?? false;
                $role = $userObj->role ?? 'user';
            }
        }

        $usuarios[] = [
            '_id'               => (string) ($usuario['_id'] ?? ''),
            'usuario_id'        => $usuario_id,
            'nombre_completo'   => $usuario['nombre_completo'] ?? 'No especificado',
            'email'             => $email,
            'fecha_nacimiento'  => $usuario['fecha_nacimiento'] ?? 'No registrada',
            'genero'            => $usuario['genero'] ?? 'No definido',
            'plan'              => $usuario['plan'] ?? 'Sin plan',
            'tiempo_restante'   => $usuario['tiempo_restante'] ?? '—',
            'fecha_creacion'    => isset($usuario['fecha_creacion'])
                                   ? date('Y-m-d', $usuario['fecha_creacion']->toDateTime()->getTimestamp())
                                   : 'No registrada',
            'banned'            => $banned,
            'role'              => $role
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $usuarios
    ]);

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al obtener usuarios: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error: " . $e->getMessage()
    ]);
}

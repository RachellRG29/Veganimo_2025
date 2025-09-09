<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/auth_functions.php'; // Funciones de autenticación
header('Content-Type: application/json');

// Verificar permisos de administrador
checkAdminAccess();

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Obtener todos los usuarios
    if ($method === 'GET') {
        $query = new MongoDB\Driver\Query([]);
        $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

        $usuarios = [];
        foreach ($cursor as $documento) {
            $usuario = (array)$documento;
            $usuario['_id'] = (string)$usuario['_id'];
            $usuario['created_at'] = $usuario['created_at']->toDateTime()->format('c');
            $usuarios[] = $usuario;
        }
        
        echo json_encode($usuarios);
    }
    
    // Actualizar usuario
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $bulk = new MongoDB\Driver\BulkWrite;
        $filter = ['_id' => new MongoDB\BSON\ObjectId($data['_id'])];
        $update = [
            '$set' => [
                'fullname' => $data['fullname'],
                'email' => $data['email'],
                'birthdate' => $data['birthdate'],
                'gender' => $data['gender']
            ]
        ];
        
        // Actualizar contraseña si se proporcionó
        if (!empty($data['password'])) {
            if ($data['password'] !== $data['confirmPassword']) {
                throw new Exception("Las contraseñas no coinciden");
            }
            $update['$set']['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        $bulk->update($filter, $update);
        $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
        
        echo json_encode(['success' => true, 'modified' => $result->getModifiedCount()]);
    }
    
    // Eliminar usuario
    elseif ($method === 'DELETE') {
        $id = $_GET['id'];

        // Primero obtener el usuario para verificar su rol
        $query = new MongoDB\Driver\Query(['_id' => new MongoDB\BSON\ObjectId($id)]);
        $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
        $usuario = current($cursor->toArray());

        if (!$usuario) {
            throw new Exception("Usuario no encontrado");
        }

        if (isset($usuario->role) && $usuario->role === 'admin') {
            throw new Exception("No se puede eliminar a un administrador");
        }

        // Si no es admin, proceder a eliminar
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete(['_id' => new MongoDB\BSON\ObjectId($id)]);
        $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);

        echo json_encode(['success' => true, 'deleted' => $result->getDeletedCount()]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

<?php
// ======================== CONFIGURACIONES Y PERMISOS ========================

// Importa la configuración de conexión a MongoDB
require_once __DIR__ . '/../misc/db_config.php';

// Importa funciones relacionadas con autenticación (por ejemplo, para verificar roles)
require_once __DIR__ . '/../misc/auth_functions.php';

// Indica que las respuestas serán en formato JSON
header('Content-Type: application/json');

// Verifica que el usuario actual tenga permisos de administrador
// Si no es admin, esta función debería lanzar un error o redirigir
checkAdminAccess();

try {
    // Obtiene el método HTTP usado en la petición (GET, PUT, DELETE)
    $method = $_SERVER['REQUEST_METHOD'];
    
    // ======================== OBTENER USUARIOS ========================
    if ($method === 'GET') {

        // Crea un filtro para excluir a los usuarios con rol "admin"
        // "$ne" significa "no igual a"
        $filtro = ['role' => ['$ne' => 'admin']];

        // Crea una consulta para MongoDB con ese filtro
        $query = new MongoDB\Driver\Query($filtro);

        // Ejecuta la consulta en la colección "Usuarios" dentro de la base de datos "Veganimo"
        $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

        // Se prepara un arreglo para guardar los resultados convertidos
        $usuarios = [];

        // Recorre cada documento obtenido
        foreach ($cursor as $documento) {
            // Convierte el documento BSON a arreglo PHP
            $usuario = (array)$documento;

            // Convierte el campo _id de tipo ObjectId a cadena para poder enviarlo en JSON
            $usuario['_id'] = (string)$usuario['_id'];

            // Si existe la fecha de creación, la convierte a formato legible ISO 8601
            if (isset($usuario['created_at']) && $usuario['created_at'] instanceof MongoDB\BSON\UTCDateTime) {
                $usuario['created_at'] = $usuario['created_at']->toDateTime()->format('c');
            }

            // Agrega el usuario procesado al arreglo
            $usuarios[] = $usuario;
        }
        
        // Devuelve todos los usuarios en formato JSON
        echo json_encode($usuarios);
    }
    
    // ======================== ACTUALIZAR USUARIO ========================
    elseif ($method === 'PUT') {
        // Obtiene los datos enviados en el cuerpo de la solicitud (en formato JSON)
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Crea un objeto BulkWrite (permite hacer operaciones de escritura en MongoDB)
        $bulk = new MongoDB\Driver\BulkWrite;

        // Filtro para identificar al usuario a modificar por su _id
        $filter = ['_id' => new MongoDB\BSON\ObjectId($data['_id'])];

        // Datos que se actualizarán en el documento
        $update = [
            '$set' => [
                'fullname' => $data['fullname'],
                'email' => $data['email'],
                'birthdate' => $data['birthdate'],
                'gender' => $data['gender']
            ]
        ];
        
        // Si el usuario proporcionó una nueva contraseña, se valida y se encripta
        if (!empty($data['password'])) {
            // Verifica que la contraseña y su confirmación coincidan
            if ($data['password'] !== $data['confirmPassword']) {
                throw new Exception("Las contraseñas no coinciden");
            }

            // Hashea (encripta) la nueva contraseña con el algoritmo por defecto de PHP
            $update['$set']['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        // Agrega la operación de actualización a la cola de BulkWrite
        $bulk->update($filter, $update);

        // Ejecuta la operación en la base de datos
        $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
        
        // Devuelve una respuesta con éxito y cuántos documentos fueron modificados
        echo json_encode(['success' => true, 'modified' => $result->getModifiedCount()]);
    }
    
    // ======================== ELIMINAR USUARIO ========================
    elseif ($method === 'DELETE') {
        // Obtiene el ID del usuario desde los parámetros de la URL (?id=xxxxx)
        $id = $_GET['id'];

        // Primero se busca al usuario en la base de datos
        $query = new MongoDB\Driver\Query(['_id' => new MongoDB\BSON\ObjectId($id)]);
        $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

        // Se obtiene el primer resultado (debería ser un único usuario)
        $usuario = current($cursor->toArray());

        // Si no se encuentra el usuario, se lanza una excepción
        if (!$usuario) {
            throw new Exception("Usuario no encontrado");
        }

        // Si el usuario es un administrador, no se permite eliminarlo
        if (isset($usuario->role) && $usuario->role === 'admin') {
            throw new Exception("No se puede eliminar a un administrador");
        }

        // Si no es admin, se procede a eliminarlo
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->delete(['_id' => new MongoDB\BSON\ObjectId($id)]);

        // Ejecuta la operación de eliminación
        $result = $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);

        // Devuelve una respuesta con éxito y cuántos documentos fueron eliminados
        echo json_encode(['success' => true, 'deleted' => $result->getDeletedCount()]);
    }
    
} catch (Exception $e) {
    // Si ocurre un error en cualquier parte del código, se devuelve el mensaje en JSON
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

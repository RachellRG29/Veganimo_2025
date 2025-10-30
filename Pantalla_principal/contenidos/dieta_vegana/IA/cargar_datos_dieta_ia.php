<?php
require_once __DIR__ . '/../../../../misc/db_config.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

// 🧠 Verificar sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "⚠️ No hay sesión activa"]);
    exit;
}

$userId = $_SESSION['user_id'];

// 🔍 Verificar formato del ID
if (!preg_match('/^[a-f\d]{24}$/i', $userId)) {
    echo json_encode(["success" => false, "message" => "❌ ID de usuario inválido"]);
    exit;
}

// --- 🧍 Obtener datos del usuario ---
try {
    if (!isset($cliente) || !$cliente instanceof MongoDB\Driver\Manager) {
        throw new Exception("Conexión MongoDB no inicializada");
    }

    $queryUser = new MongoDB\Driver\Query(
        ['_id' => new MongoDB\BSON\ObjectId($userId)],
        ['limit' => 1]
    );

    $cursorUser = $cliente->executeQuery('Veganimo.Usuarios', $queryUser);
    $usuario = current($cursorUser->toArray());

    if (!$usuario) {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
        exit;
    }

    $avatar = $usuario->avatar ?? 'predeterminado.png';
    $datosUsuario = [
        "nombre_completo"   => $usuario->fullname ?? '',
        "email"             => $usuario->email ?? '',
        "fecha_nacimiento"  => $usuario->birthdate ?? '',
        "genero"            => $usuario->gender ?? '',
        "avatar"            => $avatar
    ];

} catch (Throwable $e) {
    echo json_encode(["success" => false, "message" => "Error usuario: " . $e->getMessage()]);
    exit;
}

// --- 🥦 Obtener perfil nutricional ---
try {
    $filter = ['user_id' => $userId];
    $options = ['sort' => ['fecha_creacion' => -1], 'limit' => 1];

    $queryPerfil = new MongoDB\Driver\Query($filter, $options);
    $cursorPerfil = $cliente->executeQuery("Veganimo.Perfil_nutricional", $queryPerfil);
    $perfil = current($cursorPerfil->toArray());

    if ($perfil) {
        $perfil->_id = (string)$perfil->_id;
        if (isset($perfil->fecha_creacion) && $perfil->fecha_creacion instanceof MongoDB\BSON\UTCDateTime) {
            $perfil->fecha_creacion = $perfil->fecha_creacion->toDateTime()->format('Y-m-d H:i:s');
        }
    } else {
        $perfil = null;
    }

    echo json_encode([
        "success" => true,
        "usuario" => $datosUsuario,
        "perfil"  => $perfil,
        "nivel"   => $perfil->nivel ?? "No definido"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    echo json_encode(["success" => false, "message" => "Error perfil: " . $e->getMessage()]);
}

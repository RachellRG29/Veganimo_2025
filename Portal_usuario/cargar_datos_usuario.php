<?php
require_once __DIR__ . '/../misc/db_config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Sesión no iniciada."
    ]);
    exit;
}

$userId = $_SESSION['user_id'];

// --- Obtener datos personales ---
try {
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

    // ⚡ Obtener avatar o predeterminado
    $avatar = $usuario->avatar ?? 'predeterminado.png';

    $datosUsuario = [
        "nombre_completo"   => $usuario->fullname ?? '',
        "email"             => $usuario->email ?? '',
        "fecha_nacimiento"  => $usuario->birthdate ?? '',
        "genero"            => $usuario->gender ?? '',
        "avatar"            => $avatar
    ];
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error al consultar usuario: " . $e->getMessage()]);
    exit;
}

// --- Obtener perfil nutricional ---
$filter = ['user_id' => $userId];
$options = ['sort' => ['fecha_creacion' => -1], 'limit' => 1];
$queryPerfil = new MongoDB\Driver\Query($filter, $options);

try {
    $cursorPerfil = $cliente->executeQuery("Veganimo.Perfil_nutricional", $queryPerfil);
    $perfil = current($cursorPerfil->toArray());

    if ($perfil) {
        $perfil->_id = (string)$perfil->_id;
        $perfil->fecha_creacion = $perfil->fecha_creacion->toDateTime()->format('Y-m-d H:i:s');
    } else {
        $perfil = null;
    }

    echo json_encode([
        "success" => true,
        "usuario" => $datosUsuario,
        "perfil"  => $perfil,
        "nivel"   => $perfil->nivel ?? "No definido"
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al consultar perfil: " . $e->getMessage()
    ]);
}

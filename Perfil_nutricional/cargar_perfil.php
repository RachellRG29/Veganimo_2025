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

$filter = ['user_id' => $userId];
$options = ['sort' => ['fecha_creacion' => -1], 'limit' => 1];

$query = new MongoDB\Driver\Query($filter, $options);

try {
    $cursor = $cliente->executeQuery("Veganimo.Perfil_nutricional", $query);
    $perfil = current($cursor->toArray());

    if (!$perfil) {
        echo json_encode([
            "success" => false,
            "message" => "No se encontró un perfil nutricional."
        ]);
        exit;
    }

    // Convertir fecha de creación y ObjectID a string
    $perfil->_id = (string)$perfil->_id;
    $perfil->fecha_creacion = $perfil->fecha_creacion->toDateTime()->format('Y-m-d H:i:s');

    echo json_encode([
        "success" => true,
        "datos" => $perfil
    ]);
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error al consultar la base de datos: " . $e->getMessage()
    ]);
}
?>

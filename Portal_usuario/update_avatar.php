<?php
require_once __DIR__ . '/../misc/auth_functions.php';
require_once __DIR__ . '/../vendor/autoload.php'; // Composer de MongoDB

iniciarSesionSiNoEstaIniciada();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión activa']);
    exit;
}

if (!isset($_POST['avatar'])) {
    echo json_encode(['success' => false, 'message' => 'No se recibió avatar']);
    exit;
}

$avatar = $_POST['avatar'];
$userId = $_SESSION['user_id'];

$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->Veganimo->Usuarios;

$result = $collection->updateOne(
    ['_id' => new MongoDB\BSON\ObjectId($userId)],
    ['$set' => ['avatar' => $avatar]]
);

if ($result->getModifiedCount() > 0) {
    $_SESSION['avatar'] = $avatar; // actualizar sesión
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se pudo actualizar avatar']);
}

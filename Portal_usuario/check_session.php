<?php
require_once __DIR__ . '/../misc/auth_functions.php';
require_once __DIR__ . '/../vendor/autoload.php'; // Composer MongoDB

// Iniciar sesión si no está iniciada
iniciarSesionSiNoEstaIniciada();

header('Content-Type: application/json');

// Respuesta por defecto
$response = [
    'logged_in' => false,
    'role' => 'guest',
    'avatar' => 'predeterminado.png',
    'display_name' => ''
];

if (isset($_SESSION['user_id'])) {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $collection = $client->Veganimo->Usuarios;

    // Buscar usuario por ID
    $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($_SESSION['user_id'])]);

    if ($user) {
        $response['logged_in'] = true;
        $response['display_name'] = $user['display_name'] ?? '';
        $response['role'] = $user['role'] ?? 'user';
        $response['avatar'] = $user['avatar'] ?? 'predeterminado.png';
    }
}

echo json_encode($response);

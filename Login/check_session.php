<?php
require_once __DIR__ . '/../misc/auth_functions.php';
iniciarSesionSiNoEstaIniciada();

header('Content-Type: application/json');

$response = [
    'logged_in' => false,
    'role' => 'guest'
];

if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['display_name'] = $_SESSION['display_name'] ?? '';
    $response['role'] = $_SESSION['user_role'] ?? 'user';
}

echo json_encode($response);
?>
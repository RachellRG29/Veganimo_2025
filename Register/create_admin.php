<?php
require_once __DIR__ . '/../misc/db_config.php';
require_once __DIR__ . '/../misc/phpmailer_config.php';
session_start();

// Solo permitir ejecución desde línea de comandos o con credenciales especiales
if (php_sapi_name() !== 'cli' && (!isset($_SERVER['PHP_AUTH_USER']) || $_SERVER['PHP_AUTH_USER'] !== 'admin_setup')) {
    die("Acceso no autorizado");
}

// Datos del administrador
$adminData = [
    'fullname' => 'Administrador Equipo Quintessence',
    'birthdate' => '1980-01-01',
    'gender' => 'Masculino',
    'email' => 'veganimo2025@gmail.com',
    'password' => password_hash('Veganimo.2025', PASSWORD_DEFAULT),
    'created_at' => new MongoDB\BSON\UTCDateTime(),
    'verified' => true,
    'role' => 'admin',
    'permissions' => ['all'] // Todos los permisos
];

// Verificar si ya existe
$filtro = ['email' => $adminData['email']];
$query = new MongoDB\Driver\Query($filtro, ['limit' => 1]);
$cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);

if (count($cursor->toArray()) > 0) {
    echo "El administrador ya existe\n";
    exit;
}

// Insertar
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert($adminData);

try {
    $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
    echo "Administrador creado exitosamente\n";
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "Error al crear administrador: " . $e->getMessage() . "\n";
}
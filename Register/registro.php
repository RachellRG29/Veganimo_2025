<?php
require_once __DIR__ . '/../misc/db_config.php';

// Capturar datos del formulario
$fullname = $_POST['fullname'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';
$gender = $_POST['gender'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validar que se hayan recibido todos los datos
if (empty($fullname) || empty($birthdate) || empty($gender) || empty($email) || empty($password)) {
    die("❌ Faltan datos del formulario.");
}

// Documento a insertar
$documento = [
    'fullname' => $fullname,
    'birthdate' => $birthdate,
    'gender' => $gender,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT),  // Hasheo de la contraseña
    'created_at' => new MongoDB\BSON\UTCDateTime()
];

// Preparar la inserción
$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert($documento);

// Cambiar la base de datos y colección
$baseDatos = 'Veganimo';
$coleccion = 'Usuarios';

try {
    $cliente->executeBulkWrite("$baseDatos.$coleccion", $bulk);
    echo "✅ Datos guardados exitosamente.";
} catch (MongoDB\Driver\Exception\Exception $e) {
    echo "❌ Error al guardar: " . $e->getMessage();
}
?>

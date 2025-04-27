<?php
// Conexión a la base de datos MongoDB
require 'vendor/autoload.php'; // Asegúrate de que el autoload de Composer está cargado

$client = new MongoDB\Client("mongodb+srv://hatreck1:FeFtffXRVNimWiC2@cluster0.mongodb.net/veganimo");
$db = $client->veganimo;
$collection = $db->usuarios;

// Verifica si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Recibe los datos del formulario
    $fullname = $_POST['fullname'];
    $birthdate = $_POST['birthdate'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Inserta el nuevo usuario en la colección 'usuarios'
    $result = $collection->insertOne([
        'fullname' => $fullname,
        'birthdate' => $birthdate,
        'gender' => $gender,
        'email' => $email,
        'password' => $password // Recuerda que por ahora no lo cifras
    ]);

    // Redirige a una página de éxito o muestra un mensaje
    if ($result->getInsertedCount() > 0) {
        echo "¡Usuario registrado exitosamente!";
    } else {
        echo "Error al registrar el usuario.";
    }
}
?>
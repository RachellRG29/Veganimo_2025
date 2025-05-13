<?php
session_start();
require_once __DIR__ . '/../misc/db_config.php';

$codigoIngresado = ($_POST['digit1'] ?? '') .
                   ($_POST['digit2'] ?? '') .
                   ($_POST['digit3'] ?? '') .
                   ($_POST['digit4'] ?? '');

if (!isset($_SESSION['verification_code'], $_SESSION['user_data'])) {
    die("❌ No hay sesión activa.");
}

if ($codigoIngresado == $_SESSION['verification_code']) {
    $userData = $_SESSION['user_data'];

    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert($userData);

    try {
        $cliente->executeBulkWrite('Veganimo.Usuarios', $bulk);
        session_destroy();
        echo "✅ Verificación exitosa. Usuario registrado.";
    } catch (MongoDB\Driver\Exception\Exception $e) {
        echo "❌ Error al guardar en la base de datos: " . $e->getMessage();
    }
} else {
    echo "❌ Código incorrecto.";
}

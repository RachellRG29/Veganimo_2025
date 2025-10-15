<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../misc/db_config.php';
session_start();

// =======================
// CAPTURA Y VALIDACIÓN DE DATOS
// =======================
$numero = preg_replace('/\s+/', '', trim($_POST['numero'] ?? '')); // quitar espacios
$titular = trim($_POST['titular'] ?? '');
$mes = trim($_POST['mes'] ?? '');
$anio = trim($_POST['anio'] ?? '');
$cvv = trim($_POST['cvv'] ?? '');
$monto = floatval($_POST['monto'] ?? 5); // si no se manda, por defecto 5 USD

if (!$numero || !$titular || !$mes || !$anio || !$cvv) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Todos los campos de la tarjeta son obligatorios"
    ]);
    exit;
}

try {
    // =======================
    // PREPARAR FILTRO
    // =======================
    $filtro = [
        'numero' => $numero,
        'mes' => str_pad($mes, 2, "0", STR_PAD_LEFT),
        'anio' => $anio,
        'cvv' => $cvv
    ];

    $query = new MongoDB\Driver\Query($filtro);
    $cursor = $cliente->executeQuery("Veganimo.Tarjeta", $query);
    $tarjetas = iterator_to_array($cursor);

    // =======================
    // VALIDAR TITULAR IGNORANDO MAYÚSCULAS/MINÚSCULAS
    // =======================
    $tarjeta = null;
    foreach ($tarjetas as $t) {
        if (strcasecmp($t->titular, $titular) === 0) {
            $tarjeta = $t;
            break;
        }
    }

    if (!$tarjeta) {
        echo json_encode([
            "success" => false,
            "message" => "❌ No se pudo realizar el pago con la tarjeta"
        ]);
        exit;
    }

    // =======================
    // VALIDAR SALDO
    // =======================
    if ($tarjeta->saldo < $monto) {
        echo json_encode([
            "success" => false,
            "message" => "❌ Saldo insuficiente en la tarjeta"
        ]);
        exit;
    }

    // =======================
    // ACTUALIZAR SALDO
    // =======================
    $nuevoSaldo = $tarjeta->saldo - $monto;

    $bulk = new MongoDB\Driver\BulkWrite();
    $bulk->update(
        ['_id' => $tarjeta->_id],
        ['$set' => ['saldo' => $nuevoSaldo]]
    );
    $cliente->executeBulkWrite("Veganimo.Tarjeta", $bulk);

    // =======================
    // RESPUESTA FINAL
    // =======================
    echo json_encode([
        "success" => true,
        "message" => "✅ Pago realizado correctamente",
        "nuevoSaldo" => $nuevoSaldo
    ]);

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Error en la base de datos: " . $e->getMessage()
    ]);
}
?>

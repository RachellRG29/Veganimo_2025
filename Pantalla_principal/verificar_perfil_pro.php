<?php
session_start();
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json; charset=utf-8');

try {
    if (empty($_SESSION['user_id'])) {
        echo json_encode([
            "pro" => false,
            "message" => "No hay sesión activa"
        ]);
        exit;
    }

    // user_id se guarda como STRING en Perfil_nutricional, no como ObjectId
    $userId = $_SESSION['user_id'];

    // Buscar perfil nutricional que coincida con el user_id
    $query = new MongoDB\Driver\Query(['user_id' => $userId]);
    $cursor = $cliente->executeQuery("Veganimo.Perfil_nutricional", $query);
    $resultados = iterator_to_array($cursor);

    if (!empty($resultados)) {
        $perfil = $resultados[0];

        echo json_encode([
            "pro" => true,
            "nombre_completo" => $perfil->nombre_completo ?? 'Sin nombre',
            "plan" => $perfil->plan ?? '',
            "fecha_creacion" => isset($perfil->fecha_creacion)
                ? $perfil->fecha_creacion->toDateTime()->format('Y-m-d H:i:s')
                : null
        ]);
    } else {
        echo json_encode(["pro" => false]);
    }

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "pro" => false,
        "error" => "Error de base de datos: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "pro" => false,
        "error" => "Error general: " . $e->getMessage()
    ]);
}

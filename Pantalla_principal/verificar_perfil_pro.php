<?php
session_start();
require_once __DIR__ . '/../misc/db_config.php';
header('Content-Type: application/json; charset=utf-8');

try {
    // Verificar si hay sesión activa
    if (empty($_SESSION['user_id'])) {
        echo json_encode([
            "pro" => false,
            "mostrar_boton" => false,
            "message" => "No hay sesión activa"
        ]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    // Buscar el perfil nutricional que coincide con el user_id
    $filtro = ['user_id' => $userId];
    $query = new MongoDB\Driver\Query($filtro);
    $cursor = $cliente->executeQuery("Veganimo.Perfil_nutricional", $query);
    $resultados = iterator_to_array($cursor);

    if (empty($resultados)) {
        echo json_encode([
            "pro" => false,
            "mostrar_boton" => false,
            "message" => "Perfil no encontrado"
        ]);
        exit;
    }

    $perfil = $resultados[0];
    $plan = $perfil->plan ?? 'Standard';

    // Determinar si el usuario es Premium
    $esPremium = (strtolower($plan) === 'premium');

    echo json_encode([
        "pro" => $esPremium,
        "mostrar_boton" => $esPremium,
        "nombre_completo" => $perfil->nombre_completo ?? 'Sin nombre',
        "plan" => $plan,
        "fecha_creacion" => isset($perfil->fecha_creacion)
            ? $perfil->fecha_creacion->toDateTime()->format('Y-m-d H:i:s')
            : null
    ]);

} catch (MongoDB\Driver\Exception\Exception $e) {
    echo json_encode([
        "pro" => false,
        "mostrar_boton" => false,
        "error" => "Error de base de datos: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "pro" => false,
        "mostrar_boton" => false,
        "error" => "Error general: " . $e->getMessage()
    ]);
}

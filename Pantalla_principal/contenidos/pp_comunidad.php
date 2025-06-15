<?php
session_start();

// Ruta corregida al archivo de configuración
require_once __DIR__ . '/../../misc/db_config.php';

$perfilExistente = false;

if (isset($_SESSION['user_id'])) {
    try {
        $query = new MongoDB\Driver\Query(['user_id' => $_SESSION['user_id']]);
        $cursor = $cliente->executeQuery('Veganimo.Perfil_nutricional', $query);
        $perfil = current($cursor->toArray());
        $perfilExistente = $perfil ? true : false;
    } catch (Exception $e) {
        $perfilExistente = false;
    }
}
?>

<!-- pp_comunidad.php y css: styles_pp_comunidad.css -->
<section class="section_comunidad">
    <h1 class="lbl_bienvenida_vg_comunidad">Bienvenido a Vegánimo 🌱</h1>
  





</section>
<?php
session_start();
session_unset();
session_destroy();

header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "redirect" => "/pantalla_principal/index_pantalla_principal.html"
]);
?>



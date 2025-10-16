<?php
function iniciarSesionSiNoEstaIniciada() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function isAdmin() {
    iniciarSesionSiNoEstaIniciada();
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function checkAdminAccess() {
    if (!isAdmin()) {
        if (!headers_sent()) {
            header('HTTP/1.0 403 Forbidden');
        }
        die('Acceso denegado');
    }
}
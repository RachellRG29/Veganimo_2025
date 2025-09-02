<?php
session_start();
require_once __DIR__ . '/../../misc/db_config.php';

$perfilExistente = false;
$isAdmin = false;

function esAdmin($cliente, $userId) {
    if (!$userId) return false;
    try {
        $ors = [];
        if (is_string($userId) && preg_match('/^[a-f0-9]{24}$/i', $userId)) {
            $ors[] = ['_id' => new MongoDB\BSON\ObjectId($userId)];
        }
        $ors[] = ['_id' => $userId];
        $ors[] = ['user_id' => $userId];

        $query  = new MongoDB\Driver\Query(['$or' => $ors], ['limit' => 1]);
        $cursor = $cliente->executeQuery('Veganimo.Usuarios', $query);
        $doc    = current($cursor->toArray());

        if (!$doc) return false;

        $role = null;
        if (isset($doc->role)) $role = strtolower((string)$doc->role);
        elseif (isset($doc->rol)) $role = strtolower((string)$doc->rol);
        elseif (isset($doc->tipo)) $role = strtolower((string)$doc->tipo);

        if ($role) {
            return in_array($role, ['admin','administrador','administrator'], true);
        }

        if (isset($doc->is_admin)) return (bool)$doc->is_admin;
        if (isset($doc->admin))   return (bool)$doc->admin;

        return false;
    } catch (Throwable $e) {
        return false;
    }
}

if (isset($_SESSION['user_id'])) {
    try {
        $query   = new MongoDB\Driver\Query(['user_id' => $_SESSION['user_id']]);
        $cursor  = $cliente->executeQuery('Veganimo.Perfil_nutricional', $query);
        $perfil  = current($cursor->toArray());
        $perfilExistente = $perfil ? true : false;
    } catch (Exception $e) {
        $perfilExistente = false;
    }

    if (isset($_SESSION['role'])) {
        $isAdmin = in_array(strtolower((string)$_SESSION['role']), ['admin','administrador','administrator'], true);
    } else {
        $isAdmin = esAdmin($cliente, $_SESSION['user_id']);
    }
}
?>

<!-- Menú perfil global -->
<div class="menu_perfil" id="menu_popup" style="display: none;">
    <ul>
        <?php if (!$isAdmin): ?>
            <?php if ($perfilExistente): ?>
                <li><a href="/Perfil_nutricional/perfil_nutricional.html">Perfil nutricional</a></li>
            <?php endif; ?>
            <li><a href="/Portal_usuario/portal_usuario.html">Perfil de usuario</a></li>
        <?php endif; ?>

        <?php if ($isAdmin): ?>
            <li><a href="/Portal_administrador/portal_adm.html">Perfil administrador</a></li>
        <?php endif; ?>

        <li>
            <a href="#" class="pop-cerrar-sesion">
                Cerrar sesión 
                <i class="ph ph-sign-out" style="font-size: 18px; position: relative; bottom: -4px;"></i>
            </a>
        </li>
    </ul>
</div>




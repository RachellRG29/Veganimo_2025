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

        <?php if (isset($_SESSION['user_id']) && !$isAdmin): ?>
            <li><a href="/Portal_usuario/portal_usuario.html">Portal del usuario</a></li>
        <?php endif; ?>

        <?php if ($isAdmin): ?>
            <li><a href="/Portal_administrador/portal_adm.html">Portal del administrador</a></li>
        <?php endif; ?>

        <!-- Sección Configuración -->
 
        <li class="configuracion">
            <button class="config-btn" onclick="toggleConfig()">
                Configuración <i class="ph ph-caret-down"></i>
            </button>

            <ul class="submenu-config" id="submenu-config">
                <!-- Modo Tema -->
                <li>
                <span>Modo tema:</span>
                <div id="firstFilter" class="filter-switch">
                    <input checked id="theme-light" name="theme-options" type="radio" />
                    <label class="option" for="theme-light">Claro</label>
                    <input id="theme-dark" name="theme-options" type="radio" />
                    <label class="option" for="theme-dark">Oscuro</label>
                    <span id="bgTheme" class="background"></span>
                </div>
                </li>


                <!-- Idioma -->
                <li>
                    <span>Idioma:</span>
                    <div id="secondFilter" class="filter-switch">
                        <input checked id="lang1" name="lang-options" type="radio" />
                        <label class="option" for="lang1">Español</label>
                        <input id="lang2" name="lang-options" type="radio" />
                        <label class="option" for="lang2">Inglés</label>
                        <span id="bgLang" class="background"></span>
                    </div>
                </li>
            </ul>
        </li>

        <!-- Cerrar sesión -->
        <li>
            <a href="#" class="pop-cerrar-sesion">
                Cerrar sesión 
                <i class="ph ph-sign-out" style="font-size: 18px; position: relative; bottom: -4px;"></i>
            </a>
        </li>
    </ul>
</div>







<button class="btn-ver-mas-dash ver-mas btn-ver-receta" 
        data-tipo="desayuno" 
        data-plan-id="<?php echo $planData['id']; ?>"
        data-receta='<?php 
            $recetaData = $recetas['desayuno'];
            if (isset($recetaData['ingredientes']) && is_string($recetaData['ingredientes'])) {
                $recetaData['ingredientes'] = [$recetaData['ingredientes']];
            }
            if (isset($recetaData['preparacion']) && is_string($recetaData['preparacion'])) {
                $recetaData['preparacion'] = [$recetaData['preparacion']];
            }
            echo htmlspecialchars(json_encode($recetaData), ENT_QUOTES, 'UTF-8'); 
        ?>'>
    <?php echo ($planData['completadas']['desayuno'] ?? false) ? 'Completado ✓' : 'Ver más'; ?>
    <i class="ph ph-arrow-circle-right icon-estado-receta"></i>
</button>
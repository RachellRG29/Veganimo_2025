<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear perfil nutricional</title>
    <link rel="website icon" href="../Images/Icono_veganimo.svg">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

    <!-- Iconos -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Gloock&display=swap" rel="stylesheet" />

    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="../style_perfil_usuario.css"> <!-- Estilos para el perfil de usuario --> 

</head>

<body>

    <!-- Tarjeta menu perfil nutricional -->
    <div class="tarjeta_menu">
      <!-- Tarjeta usuario del perfil -->
      <div class="tarjeta-perfil" id="tarj_perfil_user"> <!-- CAMBIO AQUÍ -->
        <h2 class="lbl_nombre_user">User</h2>  
        <div class="circulo_perfil">
          <img src="../Images/img_sinperfilusuario.png" alt="" class="img_perfil">
        </div>
      </div>

      <!-- Menu perfil popup -->
      <div class="menu_perfil" id="menu_popup" style="display: none;">
        <ul>
          <li><a href="/Perfil_nutricional/perfil_nutricional.html">Perfil nutricional </a></li>
          <li>

            <a href="#" class="pop-cerrar-sesion">Cerrar sesión 
              <i class="ph ph-sign-out" style="font-size: 18px; position: relative; bottom: -4px;"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <form action="guardar_recetas.php" id="form-receta" class="form-receta" method="POST" enctype="multipart/form-data">

        <!-- Sección 1: Crear receta -->
        <div class="section active" id="section1">
            <h1 class="main-title">Crear recetas</h1>
            <div class="title-decoration"></div>

            <h2 class="section-title" style=" margin-bottom: 40px;">Datos de receta</h2>

            <div class="form-group centered-group">
              <div class="zona-principal">
                <!-- Zona izquierda -->
                <div class="zona-izquierda">
                  <div class="mb-3">
                    <label for="name-receta" class="form-label">Nombre de receta:</label>
                    <input type="text" id="name-receta" name="name-receta" class="form-control input-border" placeholder="Ingrese el nombre de la receta">
                  </div>
            
                  <div class="mb-3">
                    <label for="description-receta" class="form-label">Descripción:</label>
                    <textarea id="description-receta" name="description-receta" class="form-control input-border textarea-fija" rows="3" placeholder="Describa la receta"></textarea>
                  </div>

                  <div class="mb-3">
                    <!-- Categoría -->
                    <div class="categoria">
                      <label for="categoria-receta" class="form-label">Categoría:</label>
                      <select id="categoria-receta" name="categoria-receta" class="form-control input-border select-categoria">
                        <option value="" disabled selected>Seleccionar categoría</option>
                        <option value="cat_transc">Transicionista</option>
                        <option value="cat_veget">Vegetariano</option>
                        <option value="cat_vegan">Vegano</option>
                      </select>
                    </div>
                  </div>

                </div>

                <!-- Zona derecha: Imagen, estrellas y categoria -->
                <div class="zona_tarjeta_calif">
                    <label for="lbl_imagen" class="form-label">Imagen de receta:</label>
                  <div class="zona-derecha">
                     
                    <!-- Imagen -->
                    <div class="img-container" onclick="document.getElementById('input-imagen-receta').click()">
                        <i class="ph ph-image icono-placeholder"></i>
                        <img id="preview-imagen-receta" class="img-preview" style="display: none;">
                      </div>
                      <input 
                        type="file" 
                        id="input-imagen-receta" 
                        name="imagen" 
                        accept="image/*" 
                        style="display: none;" 
                        onchange="mostrarPreviewReceta(this, document.getElementById('preview-imagen-receta'))"
                      >
                    <!-- Estrellas -->
                     <label for="estrella_rating" style="color: #F6FFFE;" class="form-label">Calificación con estrellas:</label>
                     <div class="rating">
                        <input type="radio" id="star-1" name="star-radio[]" value="5">
                        <label for="star-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                        </label>
                        <input type="radio" id="star-2" name="star-radio[]" value="4">
                        <label for="star-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                        </label>
                        <input type="radio" id="star-3" name="star-radio[]" value="3">
                        <label for="star-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                        </label>
                        <input type="radio" id="star-4" name="star-radio[]" value="2">
                        <label for="star-4">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                        </label>
                        <input type="radio" id="star-5" name="star-radio[]" value="1">
                        <label for="star-5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                        </label>
                     </div>

                  </div>

                </div>



              </div>
                
            </div>
            

            <div class="buttons-container center-button">
                <button type="button" class="form-button next-button" onclick="nextSectionCR(1)">Siguiente</button>
            </div>

            <div class="progress-container">
                <div class="progress-step active"></div>
                <div class="progress-line"></div>
                <div class="progress-step inactive"></div>
                <div class="progress-line"></div>
                <div class="progress-step inactive"></div>
            </div>

        </div>

        <!-- Sección 2: Caracteristicas + Ingredientes -->
        <div class="section" id="section2">

          <h2 class="section-title">Características de la receta</h2>
          <div class="caracteristicas_recetas">
            <div class="tiempo-dificultad">
              <div class="tiempo">
                <label for="time-receta" class="form-label">Tiempo de preparación:</label>
                <div class="tiempo-inputs">
                  <input type="number" id="time-receta" name="time-receta" class="form-control input-border" placeholder="Ej: 30" min="1">
                  <select id="unidad-tiempo" name="unidad-tiempo" class="form-control input-border">
                    <option value="minutos">Minutos</option>
                    <option value="horas">Horas</option>
                  </select>
                </div>
              </div>

              <div class="separador-vertical"></div>

              <div class="dificultad">
                <label class="form-label">Dificultad:</label>
                <div class="dificultad-con-icono">
                  <i class="ph ph-square-fill" id="icon-dificultad" style="font-size: 24px; color: #1A1C1C;"></i>
                  <select id="select-dificultad" name="dificultad" class="form-control input-border" onchange="cambiarColorIcono()">
                    <option value="" disabled selected class="select_dif">Seleccionar dificultad</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
              
          <br>
          <br>
          <h2 class="section-title">Ingredientes</h2>
          <div class="zona-ingredientes">
            <div id="lista-ingredientes" class="lista-dinamica">
              <div class="ingrediente-item sin-boton">
                <input type="text" class="form-control input-border" name="ingredientes[]" placeholder="Ingrediente 1">
              </div>
            </div>
            <button type="button" onclick="agregarIngrediente()" class="btn-agregar btn-agregar-ingrediente">Añadir más</button>
          </div>

            <div class="buttons-container">
                <button type="button" class="form-button prev-button" onclick="prevSectionCR(2)">Atrás</button>
                <button type="button" class="form-button next-button" onclick="nextSectionCR(2)">Siguiente</button>
            </div>

            <div class="progress-container2">
                <div class="progress-step2 active"></div>
                <div class="progress-line2"></div>
                <div class="progress-step2 active"></div>
                <div class="progress-line2"></div>
                <div class="progress-step2 inactive"></div>
            </div>

        </div>

        <!-- Sección 3: Pasos -->
        <div class="section" id="section3">

              <!-- Pasos -->
              <h2 class="section-title">Pasos</h2>
              <div class="zona-pasos">
                <div id="lista-pasos" class="lista-dinamica">
                  <div class="paso-item sin-boton">
                    <div class="paso-imagen-small" onclick="this.querySelector('input').click()">
                      <i class="ph ph-image icono-placeholder"></i>
                      <img class="img-preview" style="display:none;">
                      <input type="file" accept="image/*" name="imagen-paso[]" style="display:none;" onchange="mostrarPreviewPaso(this, this.previousElementSibling)">
                    </div>
                    <input type="text" name="pasos[]" class="form-control input-border paso-input" placeholder="Paso 1">
                  </div>
                </div>
                <button type="button" onclick="agregarPaso()" class="btn-agregar btn-agregar-paso">Añadir más</button>
              </div>

              <div class="progress-container3">
                <div class="progress-step3 active"></div>
                <div class="progress-line3"></div>
                <div class="progress-step3 active"></div>
                <div class="progress-line3"></div>
                <div class="progress-step3 inactive"></div>
              </div>

              <!-- Botón de Guardar -->
              <div class="buttons-container">
                <button type="button" class="form-button prev-button" onclick="prevSectionCR(3)">Atrás</button>
                <button type="submit" class="form-button btn-crear-receta">Guardar receta</button>
              </div>
            
        

        </div>


    </form>

    

    <!-- SCRIPTS DE CREAR RECETAS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>  <!-- SweetAlert -->
    <script src="https://unpkg.com/phosphor-icons"></script> <!-- Iconos -->

</body>

</html>
<?php include_once __DIR__ . '/../menu_perfil.php'; ?>


<section class="section_mi_plan">
  <div class="lbl_bienvenida_plan_dash">
    <h1 class="lbl_titulo_dash">Mi plan 🌱</h1>
    <p class="lbl_user_nivel">Nivel: Transicionista</p>
  </div>

  <div class="dashboard_plan">

    <!-- 1️⃣ Plan Nutricionista -->
    <div class="div_dash1">
      <div class="header_plan">
        <h2 class="titulo_plan">Plan Nutricionista</h2>
        <span class="etiqueta_premium">Plan premium</span>
      </div>

      <div class="recetas_contenedor">
        <div class="tarjeta_receta tipo_desay">
          <img src="/Images/fondo_pu_oscuro.png" alt="Desayuno" class="img_receta">
          <span class="etiqueta_letra">D</span>
          <p class="nombre_receta">Desayuno</p>
        </div>

        <div class="tarjeta_receta tipo_almue">
          <img src="/Images/fondo_pu_oscuro.png" alt="Almuerzo" class="img_receta">
          <span class="etiqueta_letra">A</span>
          <p class="nombre_receta">Almuerzo</p>
        </div>

        <div class="tarjeta_receta tipo_cena">
          <img src="/Images/fondo_pu_oscuro.png" alt="Cena" class="img_receta">
          <span class="etiqueta_letra">C</span>
          <p class="nombre_receta">Cena</p>
        </div>
      </div>

        <div class="barra_y_calorias">
            <div class="barra_contenedor">
            <div class="barra_progreso" style="width:66%;"></div>
            </div>
            <span class="porcentaje">66%</span>
            <span class="calorias">150 Calorías</span>
        </div>

    </div>

    <!-- 2️⃣ Calendario -->
    <div class="div_dash2">
      <div class="calendario_titulo">
        <h3 id="mes_cald_dash">Octubre 2025</h3>
        <div class="calendario_nav">
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>

      <div class="calendario">
        <div class="dias">
          <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
        </div>
        <div class="numeros">
          <span>1</span><span>2</span><span>3</span><span class="naranja_estado">4</span><span>5</span><span class="verde_estado">6</span><span>7</span>
          <span>8</span><span class="verde_estado">9</span><span class="amarillo_estado">10</span><span>11</span><span>12</span><span>13</span><span>14</span>
          <span>15</span><span class="verde_estado">16</span><span>17</span><span>18</span><span class="rojo_estado">19</span><span>20</span><span>21</span>
          <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span class="naranja_estado">27</span><span>28</span>
          <span>29</span><span class="verde_estado">30</span><span>31</span>
        </div>
      </div>
    </div>

    <!-- 3️⃣ Contador y frase -->
    <div class="div_dash3">
      <div class="contador_superior">
        <span class="lbl_contador_titulo">Contador</span>
        <span class="lbl_tiempo">Tiempo restante</span>
        <span class="lbl_dias">230 días</span>
      </div>
      <p class="frase_veg">
        El veganismo no es solo una forma de alimentarse, es un camino hacia la salud, la compasión y un planeta mejor.
      </p>
    </div>

    <!-- 4️⃣ Guía -->
    <div class="div_dash4">
      <ul class="guia_colores">
        <li><span class="color_guia amarillo"></span> Receta asignada</li>
        <li><span class="color_guia verde"></span> Receta completada</li>
        <li><span class="color_guia rojo"></span> Receta no completada</li>
        <li><span class="color_guia naranja"></span> Receta a media</li>
      </ul>
    </div>

    <!-- 5️⃣ Disclaimer -->
    <div class="div_dash5">
      <span class="lbl_plan_auto">Plan automatizado</span>
      <div class="contenido_disclaimer">
        <div class="gif_container">
          <img src="/Images/gif/alerta.gif" alt="Gif vegano" class="gif_disclaimer">
        </div>
        <p class="disclaimer">
          Esta aplicación brinda orientación general y no sustituye el consejo médico o nutricional profesional.  
          <br><br>Un estilo de vida vegano equilibrado puede requerir suplementos como Vitamina B12,
          Vitamina D, Omega-3, Hierro o Calcio según tus necesidades individuales.
        </p>
      </div>
    </div>

  </div>
</section>

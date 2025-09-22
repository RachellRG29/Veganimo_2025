// script_portal_user.js
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 Portal Usuario iniciado');

    const navItems = document.querySelectorAll(".nav-item-user");
    const contenidoUser = document.getElementById("contenido-user");

    // Función para marcar el item activo
    const seleccionarItem = (item) => {
        navItems.forEach(i => i.classList.remove("active", "highlight"));
        item.classList.add("active", "highlight");
    };

    // Función para cargar contenido dinámico
async function cargarContenido(pagina) {
    const url = `../Portal_de_usuario/contenidos/${pagina}`;
    try {
        const response = await fetch(url);
        const html = await response.text();
        contenidoUser.innerHTML = html;

        // Ejecutar scripts específicos después de cargar el contenido
        setTimeout(() => {
            if (pagina === 'pp_portal_us.html') {
                if (typeof inicializarPUser === 'function') {
                    inicializarPUser();
                }
                // renderizar datos personales ahora que el HTML ya existe
                if (typeof renderDatosPersonales === 'function') {
                    renderDatosPersonales();
                }
            }
        }, 50); // pequeño delay para asegurar que el HTML esté en el DOM
    } catch (err) {
        contenidoUser.innerHTML = "<p>Error al cargar el contenido.</p>";
        console.error(err);
    }
}


    // Manejar clics en el sidebar
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const pagina = item.getAttribute("data-page");
            if (pagina) {
                seleccionarItem(item);
                cargarContenido(pagina);
            }
        });
    });

    // Cargar última página visitada o perfil por defecto
    const ultimaPagina = localStorage.getItem("ultimaPaginaCargada_user");
    if (ultimaPagina) {
        console.log('📖 Cargando última página:', ultimaPagina);
        cargarContenido(ultimaPagina);
        const item = [...navItems].find(i => i.getAttribute("data-page") === ultimaPagina);
        if (item) seleccionarItem(item);
    } else {
        console.log('📖 No hay última página guardada, cargando perfil por defecto');
        const defaultItem = navItems[0];
        if (defaultItem) {
            seleccionarItem(defaultItem);
            cargarContenido(defaultItem.getAttribute("data-page"));
        }
    }
});

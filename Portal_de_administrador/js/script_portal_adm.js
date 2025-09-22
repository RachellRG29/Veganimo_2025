document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 Portal Admin iniciado');
    
    const navItems = document.querySelectorAll(".nav-item-admin");
    const contenidoAdmin = document.getElementById("contenido-admin");

    const seleccionarItem = (item) => {
        navItems.forEach(i => i.classList.remove("active", "highlight"));
        item.classList.add("active", "highlight");
    };

    async function cargarContenido(pagina) {
        const url = `/Portal_de_administrador/contenidos/${pagina}`;
        console.log("📥 Solicitando:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${url}`);

            const html = await response.text();
            contenidoAdmin.innerHTML = html;

            // EJECUTAR SCRIPTS ESPECÍFICOS DESPUÉS DE CARGAR EL CONTENIDO
            setTimeout(() => {
                console.log('🔄 Inicializando módulos para:', pagina);
                
                if (pagina === 'pp_usuario.html') {
                    if (typeof inicializarUsuarios === 'function') {
                        console.log('✅ Inicializando usuarios...');
                        inicializarUsuarios();
                    } else {
                        console.log('❌ inicializarUsuarios no está disponible');
                    }
                }
                
                if (pagina === 'pp_recetas.html') {
                    if (typeof cargarRecetas === 'function') {
                        console.log('✅ Inicializando recetas...');
                        cargarRecetas();
                    } else {
                        console.log('❌ cargarRecetas no está disponible');
                    }
                }
            }, 200);

            localStorage.setItem("ultimaPaginaCargada_admin", pagina);
            return true;
        } catch (err) {
            console.error("⚠️ Error al cargar contenido:", err);
            contenidoAdmin.innerHTML = "<p>Error al cargar el contenido.</p>";
            return false;
        }
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const pagina = item.getAttribute("data-page");
            if (pagina) {
                seleccionarItem(item);
                cargarContenido(pagina);
            }
        });
    });

    // Cargar última página
    const ultimaPagina = localStorage.getItem("ultimaPaginaCargada_admin");
    if (ultimaPagina) {
        console.log('📖 Cargando última página:', ultimaPagina);
        cargarContenido(ultimaPagina);
        const item = [...navItems].find(i => i.getAttribute("data-page") === ultimaPagina);
        if (item) seleccionarItem(item);
    } else {
        console.log('📖 No hay última página guardada');
    }
});
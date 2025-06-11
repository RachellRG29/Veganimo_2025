
if (result.success) {
    // Guardar el nombre en localStorage
    if (result.display_name) {
        localStorage.setItem('userDisplayName', result.display_name);
    }
    
    // Redirigir después de mostrar el mensaje
    setTimeout(() => {
        window.location.href = "/Pantalla_principal/index_pantalla_principal.html"; 
    }, 1500);
}





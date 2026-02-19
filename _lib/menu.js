// // Función principal para cargar los datos del servidor
async function cargarDatosDeSesion() {
    try {
        // 1. Hacemos la petición al archivo PHP
        const response = await fetch('../_lib/generar_menu.php');
        
        // 2. Convertimos la respuesta a un objeto JSON
        const data = await response.json();

        // 3. Verificamos si hay una sesión activa
        if (!data.usuario) {
            console.warn("Sesión no encontrada, redirigiendo...");
            window.location.href = '../login/';
            return;
        }

        // 4. Usamos la info básica (ejemplo: mostrar en consola o pantalla)
        console.log(`Bienvenido ${data.name} (${data.role})`);
        
        // Si tienes un elemento para el nombre, lo actualizamos:
        const userLabel = document.querySelector('.user-name');
        if(userLabel) userLabel.innerText = data.name;

        // 5. Construimos el menú dinámicamente
        renderizarMenu(data.menu);

    } catch (error) {
        console.error("Error crítico al recibir el JSON:", error);
    }
}

// Función para pintar los iconos en el DOM
function renderizarMenu(opciones) {
    const menuContainer = document.querySelector('.bottom-menu');
    if (!menuContainer) return;

    // Limpiamos el contenedor
    menuContainer.innerHTML = '';

    opciones.forEach(opcion => {
        // Creamos el elemento <a>
        const link = document.createElement('a');
        link.href = opcion.link;
        link.title = opcion.label;

        // Detectamos si es la página activa
        if (window.location.pathname.includes(opcion.link.replace('..', ''))) {
            link.classList.add('active');
        }

        // Insertamos el icono para Lucide
        link.innerHTML = `<i data-lucide="${opcion.icon}"></i>`;
        
        menuContainer.appendChild(link);
    });

    // IMPORTANTE: Refrescar Lucide para que detecte los nuevos iconos creados
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Ejecutamos la carga al iniciar el script
cargarDatosDeSesion();
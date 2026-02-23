document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();
});

async function cargarHistorial() {
    const lista = document.getElementById('lista-historial');
    const totalDisplay = document.getElementById('total-general');
    
    try {
        // 1. Petición al backend
        const response = await fetch('../_lib/historial.php');
        
        // Verificamos si la respuesta es un JSON válido
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        
        const data = await response.json();
        console.log(data);
        // 2. Validar sesión
        if (data.usuario === false) {
            console.warn("Sesión no encontrada, redirigiendo...");
            window.location.href = '../login/';
            return;
        }

        // 3. Limpiar el contenedor (quitar spinner)
        lista.innerHTML = ""; 

        // 4. Actualizar el Total Registrado
        if (totalDisplay) {
            // Usamos el total que ya viene calculado desde el PHP
            totalDisplay.innerText = `$ ${data.total.toLocaleString('es-CL')}`;
        }

        // 5. Validar si hay registros en la tabla tbl_comprobante
        if (!data.datos || data.datos.length === 0) {
            lista.innerHTML = `
                <div class="text-center py-5">
                    <i data-lucide="info" style="width: 48px; height: 48px; color: rgba(255,255,255,0.2)"></i>
                    <p class="mt-2 text-muted">No hay facturas registradas aún.</p>
                </div>`;
            lucide.createIcons();
            return;
        }

        // 6. Renderizar la lista con los nombres de campos correctos
        data.datos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-item';
            
            // Importante: Usamos item.fecha e item.url porque así los definimos en el PHP
            card.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.nombre}</span>
                    <span class="item-date">${item.fecha}</span>
                    <span class="item-price">$ ${item.precio.toLocaleString('es-CL')}</span>
                </div>
                <a href="${item.id}" target="_blank" class="btn-pdf" title="Ver Comprobante">
                    <i data-lucide="file-text"></i>
                </a>
            `;
            lista.appendChild(card);
        });

        // 7. Inicializar iconos de Lucide para los nuevos elementos
        lucide.createIcons(); 

    } catch (error) {
        console.error("Error cargando historial:", error);
        lista.innerHTML = `
            <div class="alert alert-danger bg-dark text-danger border-danger">
                Error crítico: No se pudo obtener la información del servidor.
            </div>`;
    }
}
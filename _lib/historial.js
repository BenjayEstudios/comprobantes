document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();
});

function visualizarDocumento(base64Data) {
    if (!base64Data) {
        Swal.fire('Error', 'No hay archivo disponible', 'error');
        return;
    }

    // 1. Extraer el MIME Type
    const matches = base64Data.match(/^data:([^;]+);base64,(.*)$/);
    const mimeType = matches ? matches[1] : 'application/pdf';

    // 2. Si es IMAGEN, la mostramos en un Modal (Perfecto para celulares)
    if (mimeType.startsWith('image/')) {
        Swal.fire({
            title: 'Visualización de Imagen',
            imageUrl: base64Data,
            imageAlt: 'Comprobante',
            width: '90%',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3085d6',
            // Esto permite que en el celular se vea grande y cómodo
        });
    } 
    // 3. Si es PDF, usamos el método del Blob
    else {
        try {
            const b64 = matches ? matches[2] : base64Data;
            const byteCharacters = atob(b64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(blob);
            
            window.open(fileURL, '_blank');
        } catch (e) {
            Swal.fire('Error', 'No se pudo generar el visor de PDF', 'error');
        }
    }
}
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
                <button onclick="visualizarDocumento('${item.documento}')" class="btn-pdf">
                    <i data-lucide="eye"></i>
                </button>
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
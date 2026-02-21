const form = document.getElementById('recoveryForm');
const mensajeDiv = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo){
    // Limpiar contenido previo
    mensajeDiv.innerHTML = "";
    const msg = document.createElement("div");
    msg.className = `mensaje ${tipo}`;
    msg.textContent = texto;
    mensajeDiv.appendChild(msg);

    setTimeout(() => {
        msg.style.animation = "fadeOut 0.5s ease forwards";
        setTimeout(() => msg.remove(), 500);
    }, 4000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    try {
        // Apuntamos a un nuevo archivo PHP de recuperación
        const res = await fetch("../_lib/recovery.php", {
            method: "POST",
            body: formData
        });
        
        const data = await res.json();
        mostrarMensaje(data.mensaje, data.success ? "exito" : "error");
        
        if(data.success) {
            form.reset();
            // Opcional: Redirigir después de unos segundos
            // setTimeout(() => { window.location.href = "../"; }, 3000);
        }
    } catch(err) {
        mostrarMensaje("❌ Error al conectar con el servidor", "error");
        console.error(err);
    }
});
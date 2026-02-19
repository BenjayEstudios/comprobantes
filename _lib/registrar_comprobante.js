// registrar_comprobante.js

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnSnap = document.getElementById('btn-snap');

// 1. Iniciar la cámara apenas cargue el script
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment", // Usa la cámara trasera en tu iPhone
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        alert("No se pudo activar la cámara. Revisa los permisos de tu navegador.");
    }
}

// 2. Función para tomar la foto
btnSnap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujamos el video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertimos a Base64
    const imageData = canvas.toDataURL('image/png');
    
    console.log("Imagen capturada con éxito");
    // Aquí podrías disparar un mensaje de éxito con la clase .mensaje que creamos
});

// Arrancar cámara
initCamera();
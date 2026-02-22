const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btnSnap = document.getElementById('btn-snap');
const fileInput = document.getElementById('file-input');
const btnUpload = document.getElementById('btn-upload');
const btnRegistrar = document.getElementById('btn-registrar');
const previewContainer = document.getElementById('preview-container');
const imgPreview = document.getElementById('img-preview');
const btnRemove = document.getElementById('btn-remove-file');

let currentFileData = null;
let stream = null;

// Iniciar Cámara
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 1280, height: 720 },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error de cámara:", err);
        alert("No se pudo acceder a la cámara. Revisa los permisos.");
    }
}

// Capturar Foto
btnSnap.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    currentFileData = canvas.toDataURL('image/png');
    imgPreview.src = currentFileData;
    mostrarPreview();
});

// Adjuntar Archivo
btnUpload.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentFileData = event.target.result;
            imgPreview.src = file.type.includes('pdf') ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' : currentFileData;
            mostrarPreview();
        };
        reader.readAsDataURL(file);
    }
});

function mostrarPreview() {
    previewContainer.classList.remove('preview-hidden');
    if (stream) stream.getTracks().forEach(track => track.stop());
}

btnRemove.addEventListener('click', () => {
    previewContainer.classList.add('preview-hidden');
    currentFileData = null;
    fileInput.value = "";
    initCamera();
});

// 1. Inicializar AutoNumeric en el campo precio
const anElement = new AutoNumeric('#precio', {
    currencySymbol: '$',
    digitGroupSeparator: '.',
    decimalCharacter: ',',
    decimalPlaces: 0, // En Chile no usamos decimales para pesos
    unformatOnSubmit: true // Ayuda a obtener el valor limpio
});

// 2. Modificación en la lógica de Registro Final
btnRegistrar.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    
    // OBTENER EL VALOR LIMPIO (Solo números)
    // .getNumber() devuelve el valor como float/int directamente
    const precioLimpio = anElement.getNumber(); 

    if (!currentFileData) {
        alert("⚠️ Debes capturar o adjuntar un documento primero.");
        return;
    }
    if (!nombre || precioLimpio <= 0) {
        alert("⚠️ Por favor, ingresa el nombre y un precio válido.");
        return;
    }

    // Confirmación con formato bonito para el usuario
    const precioFormateado = anElement.getFormatted();
    if (confirm(`¿Estás seguro de registrar esta factura por ${precioFormateado}?`)) {
        enviarFactura(nombre, precioLimpio);
    }
});

// Conexión con guardar_comprobante.php
async function enviarFactura(nombre, precio) {
    const btnTextoOriginal = btnRegistrar.innerHTML;
    btnRegistrar.disabled = true;
    btnRegistrar.innerHTML = "Procesando...";

    const formData = new FormData();
    formData.append('imagen', currentFileData);
    formData.append('nombre', nombre);
    formData.append('precio', precio);

    try {
        const response = await fetch('../_lib/guardar_comprobante.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert("✅ " + result.mensaje);
            // Limpiar formulario o redirigir
            window.location.reload(); 
        } else {
            alert("❌ Error: " + result.mensaje);
            btnRegistrar.disabled = false;
            btnRegistrar.innerHTML = btnTextoOriginal;
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("❌ Error de conexión con el servidor.");
        btnRegistrar.disabled = false;
        btnRegistrar.innerHTML = btnTextoOriginal;
    }
}

initCamera();